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
cors = CORS(app, resources={r"/api/*": {"origins": "*"}}) # 配置CORS以允许所有源

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
geojson_file_path = './data/wind.geojson'
try:
    with open(geojson_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    app.logger.info("GeoJSON文件加载成功")
except Exception as e:
    app.logger.error(f"加载GeoJSON文件时出错: {e}")

def find_country_data(country_name, data):
    # 提取特定国家的时间序列数据
    country_data = []
    for feature in data["features"]:
        if feature.get("properties", {}).get("NAME", "").lower() == country_name.lower():
            country_data = [{'year': year, 'value': feature["properties"].get(f"F{year}", None)}
                            # for year in range(1970, 2011) if f"F{year}" in feature["properties"]]
                            for year in range(2007, 2020) if f"F{year}" in feature["properties"]]
            break
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

def process_data(df):
    # 处理数据，填充缺失值并检查平稳性
    df = df.dropna()  # 去除含有 NaN 的行
    if not check_stationarity(df['value']):
        df['diff_value'] = df['value'].diff().dropna()  # 使用差分
        return df, True
    return df, False

def predict_country_data(df, diffed):
    # 确定ARIMA模型参数
    if diffed:
        ts = df['diff_value'].dropna()
    else:
        ts = df['value'].dropna()

    order = determine_arima_params(ts)
    model = fit_arima_model(ts, order)
    forecast = forecast_future(model, steps=5)

    if diffed:
        # 如果数据被差分过，进行数据还原
        last_actual_value = df['value'].iloc[-1]
        forecast = np.r_[last_actual_value, forecast].cumsum()[1:]
    
    return forecast

@app.route('/predict', methods=['GET'])
def predict():
    country_name = request.args.get('country')
    if not country_name:
        return jsonify({'error': 'Country parameter is missing'}), 400
    
    # 提取国家的时间序列数据
    df = find_country_data(country_name, data)
    if df.empty:
        return jsonify({'error': 'No data found for the specified country'}), 404

    df, diffed = process_data(df)
    forecast = predict_country_data(df, diffed)

    # 将历史数据和预测数据合并
    last_year = df['year'].iloc[-1]
    future_years = range(last_year + 1, last_year + 1 + len(forecast))
    forecast_df = pd.DataFrame({'year': future_years, 'value': forecast})

    # 结合历史数据和预测数据
    combined_df = pd.concat([df[['year', 'value']], forecast_df])
    combined_df = combined_df.reset_index(drop=True)

    # 返回数据
    result = combined_df.to_dict(orient='records')  # 将DataFrame转换为字典列表
    return jsonify(result)
    
    
# 碳达峰时序预测
@app.route('/peak', methods=['GET'])
def peak():
        country_name = request.args.get('country')
        if not country_name:
            return jsonify({'error': 'Country parameter is missing'}), 400

        # 提取国家的时间序列数据
        df = find_country_data(country_name, data)
        if df.empty:
            return jsonify({'error': 'No data found for the specified country'}), 404

        df, diffed = process_data(df)
        forecast = predict_country_data(df, diffed)

        # 将历史数据和预测数据合并
        last_year = df['year'].iloc[-1]
        future_years = range(last_year + 1, last_year + 1 + len(forecast))
        forecast_df = pd.DataFrame({'year': future_years, 'value': forecast})

        # 结合历史数据和预测数据
        combined_df = pd.concat([df[['year', 'value']], forecast_df])
        combined_df = combined_df.reset_index(drop=True)

        # 返回数据
        result = combined_df.to_dict(orient='records')

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # 指定 Flask 运行在 5000 端口
