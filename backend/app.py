from flask import Flask, request, jsonify
from difflib import get_close_matches
import json
import logging
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # 指定 Flask 运行在 5000 端口
