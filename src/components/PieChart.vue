<template>
  <div id="pieChartContainer">
    <div id="pieChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  mounted() {
    this.initChart();
    this.initResizeObserver();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.myChart) {
      this.myChart.dispose(); // 清理图表实例
    }
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
    year(newValue) {
      this.myYear = newValue;
      this.initChart();
    },
  },
  methods: {
    calculateFontSize(containerWidth) {
      // 基于容器宽度计算字体大小，可以根据需要调整计算逻辑
      return Math.max(containerWidth / 30, 12); // 字体大小在12到24之间
    },
    async initChart() {
      const chartDom = document.getElementById("pieChart");
      this.myChart = echarts.init(chartDom); // 保存图表实例
      const containerWidth = chartDom.clientWidth;
      const fontSize = this.calculateFontSize(containerWidth);

      const option = {
        title: {
          text: `${this.myCurrCountry} ${this.myYear}`,
          left: "center",
          top: "2%",
          textStyle: {
            fontSize: fontSize * 1.5,
          },
        },
        tooltip: {
          trigger: "itsem",
        },
        legend: {
          orient: "vertical",
          right: "1%",
          top: "center",
          textStyle: {
            fontSize: fontSize,
          },
        },
        series: [
          {
            name: "CO2排放",
            type: "pie",
            radius: "50%",
            center: ["35%", "50%"],
            data: [],
            label: {
              fontSize: fontSize,
            },
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
        this.myChart.setOption(option);
      } catch (error) {
        console.error("加载GeoJSON数据时出错:", error);
      }
    },
    initResizeObserver() {
      const chartDom = document.getElementById("pieChartContainer");
      this.resizeObserver = new ResizeObserver(() => {
        if (this.myChart) {
          const containerWidth = chartDom.clientWidth;
          const fontSize = this.calculateFontSize(containerWidth);
          const option = this.myChart.getOption();
          option.legend[0].textStyle.fontSize = fontSize;
          option.series[0].label.fontSize = fontSize;
          this.myChart.setOption(option);
          this.myChart.resize();
        }
      });
      this.resizeObserver.observe(chartDom);
    },
  },
};
</script>

<style>
#pieChartContainer {
  width: 100%;
  height: 100%;
}
#pieChart {
  width: 100%;
  height: 100%;
}
</style>
