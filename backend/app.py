from flask import Flask, request, jsonify, send_file
from difflib import get_close_matches
import json
import logging
from flask_cors import CORS
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
import pmdarima as pm
import numpy as np

import os

app = Flask(__name__)
CORS(app)  # 配置CORS以允许所有源

# 设置日志记录
logging.basicConfig(level=logging.DEBUG)

# 从文件加载GeoJSON数据
try:
    with open('./data/CO2-total.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    app.logger.info("GeoJSON文件加载成功")
except Exception as e:
    app.logger.error(f"加载GeoJSON文件时出错: {e}")

def find_country_coordinates(query, data, max_results=5):
    if not query:
        app.logger.error("查询参数缺失")
        return None
    
    query = query.lower()  # 将查询字符串转换为小写
    countries = [feature["properties"].get("NAME") for feature in data["features"] if "NAME" in feature["properties"]]
    app.logger.debug(f"查询参数: {query}")
    app.logger.debug(f"国家列表: {countries}")

    if not countries:
        app.logger.error("国家列表为空")
        return None

    countries_lower = [country.lower() for country in countries]  # 将国家名称转换为小写

    closest_matches = get_close_matches(query, countries_lower, n=max_results, cutoff=0.5)
    app.logger.debug(f"最接近的匹配: {closest_matches}")

    results = []
    for match in closest_matches:
        original_match = countries[countries_lower.index(match)]  # 找到原始的国家名称
        for feature in data["features"]:
            if feature["properties"]["NAME"] == original_match:
                coordinates = feature["geometry"]["coordinates"]
                results.append({
                    'name': original_match,
                    'latitude': coordinates[1],
                    'longitude': coordinates[0]
                })
    return results

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        app.logger.error("Query parameter is missing")
        return jsonify({'error': 'Query parameter is missing'}), 400

    app.logger.debug(f"Received query: {query}")
    
    results = find_country_coordinates(query, data)
    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'No match found'}), 404




# 预测

# 从文件加载GeoJSON数据
geojson_file_path = './data/CO2-total.geojson'
try:
    with open(geojson_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    app.logger.info("GeoJSON文件加载成功")
except Exception as e:
    app.logger.error(f"加载GeoJSON文件时出错: {e}")

def find_country_data(country_name, data):
    country_data = []
    for feature in data["features"]:
        properties = feature.get("properties", {})
        if properties.get("NAME", "").lower() == country_name.lower():
            for year in range(1970, 2021):
                year_str = f"F{year}"
                if year_str in properties:
                    country_data.append({'year': year, 'value': properties[year_str]})
                else:
                    app.logger.error(f"{year_str}字段缺失")
    if not country_data:
        app.logger.error(f"没有找到国家 {country_name} 的数据")
    return pd.DataFrame(country_data)

def check_stationarity(ts):
    result = adfuller(ts)
    return result[1] < 0.05

def determine_arima_params(ts):
    model = pm.auto_arima(ts, seasonal=False, stepwise=True, trace=True)
    return model.order

def fit_arima_model(ts, order):
    model = ARIMA(ts, order=order)
    return model.fit()

def forecast_future(model, steps):
    forecast = model.forecast(steps=steps)
    # 将负值替换为零
    forecast[forecast < 0] = 0
    return forecast

@app.route('/predict', methods=['GET'])
def predict():
    country_name = request.args.get('country')
    if not country_name:
        return jsonify({'error': 'Country parameter is missing'}), 400
    
    try:
        # 提取国家的时间序列数据
        df = find_country_data(country_name, data)
        if df.empty:
            return jsonify({'error': 'No data found for the specified country'}), 404

        # 处理NaN和Inf值
        df = df.replace([np.inf, -np.inf], np.nan).dropna()

        # 检查平稳性并进行差分
        if not check_stationarity(df['value']):
            df['value'] = df['value'].diff().dropna()
        
        # 再次处理NaN和Inf值
        df = df.replace([np.inf, -np.inf], np.nan).dropna()

        # 确定ARIMA模型参数
        order = determine_arima_params(df['value'].dropna())
        
        # 拟合ARIMA模型
        model = fit_arima_model(df['value'].dropna(), order)
        
        # 预测未来数据
        forecast = forecast_future(model, steps=30)
        
        # 组合历史数据和预测数据
        future_years = [year for year in range(2021, 2021 + len(forecast))]
        forecast_data = pd.DataFrame({'year': future_years, 'value': forecast})
        combined_df = pd.concat([df.set_index('year'), forecast_data.set_index('year')]).reset_index()
        
        # 更新GeoJSON文件（可选）
        for feature in data["features"]:
            properties = feature.get("properties", {})
            if properties.get("NAME", "").lower() == country_name.lower():
                for year, value in zip(combined_df['year'], combined_df['value']):
                    properties[f"F{year}"] = value
        
        with open('predicted_geojson_file.geojson', 'w', encoding='utf-8') as f:
            json.dump(data, f)

        # 返回组合后的数据作为JSON响应
        return jsonify(combined_df.to_dict(orient='records'))
    except Exception as e:
        app.logger.error(f"预测过程中发生错误: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # 指定 Flask 运行在 5000 端口
