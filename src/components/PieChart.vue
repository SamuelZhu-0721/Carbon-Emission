<template>
  <div id="pieChart"></div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  mounted() {
    this.initChart();
  },
  data() {
    return {
      myYear: 2000,
      myCurrCountry: "ALBANIA",
    };
  },
  props: {
    year: {
      type: Number,
      required: true,
      default: 1970,
    },
    currCountry: {
      type: String,
      required: true,
      default: "ALBANIA",
    },
  },
  watch: {
    currCountry(newValue) {
      this.myCurrCountry = newValue;
      this.initChart();
    },
    year(newValue){
      this.myYear=newValue;
      this.initChart();
    }
  },
  methods: {
    async initChart() {
      const chartDom = document.getElementById("pieChart");
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: "10%", // 将负数值调小一些，使图例更向右移动
          top: "center", // 顶部对齐
        },
        series: [
          {
            name: "CO2排放",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 文件路径和对应的名称
      const fileUrls = [
        { url: "./data/AFOLU.geojson", name: "农牧业" },
        { url: "./data/buildings.geojson", name: "建筑" },
        { url: "./data/energy.geojson", name: "生产能源" },
        { url: "./data/industry.geojson", name: "工业" },
        { url: "./data/transport.geojson", name: "交通" },
      ];
      const data = [];
      try {
        // 发送所有请求
        const requests = fileUrls.map((item) => axios.get(item.url));
        const responses = await Promise.all(requests);
        // 处理每个响应
        responses.forEach((response, index) => {
          const geoJsonData = response.data;
          const feature = geoJsonData.features.find(
            (f) => f.properties.NAME === this.myCurrCountry
          );
          const PropertyYear = `F${this.myYear}`;
          if (feature && feature.properties[PropertyYear] !== undefined) {
            data.push({
              name: fileUrls[index].name,
              value: feature.properties[PropertyYear],
            });
          }
        });
        // 更新图表数据
        option.series[0].data = data;
        myChart.setOption(option);
      } catch (error) {
        console.error("加载GeoJSON数据时出错:", error);
      }
    },
  },
};
</script>

<style>
#pieChart {
  width: 100%;
  height: 100%;
}
</style>
