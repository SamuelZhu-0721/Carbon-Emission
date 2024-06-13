<template>
  <div id="ForecastChartContainer">
    <div id="ForecastChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";

export default {
  mounted() {
    this.fetchDataAndInitChart();
    this.initResizeObserver();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  data() {
    return {
      myCurrCountry: "ALBANIA", // 默认国家，可以通过props传入或修改
      labelFontSize: 12,
    };
  },
  props: {
    currCountry: {
      type: String,
      default: "ALBANIA",
    },
  },
  watch: {
    currCountry(newValue) {
      this.myCurrCountry = newValue;
      this.fetchDataAndInitChart();
    },
  },
  methods: {
    calculateFontSize(containerWidth) {
      return Math.max(containerWidth / 50, 12);
    },
    async fetchDataAndInitChart() {
      const chartDom = document.getElementById("ForecastChart");
      this.myChart = echarts.init(chartDom);
      const containerWidth = chartDom.clientWidth;
      this.labelFontSize = this.calculateFontSize(containerWidth);

      const option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => `${value / 1000000}M tons`,
          },
        },
        series: [
          {
            name: "CO2 Emissions",
            type: "line",
            stack: "total",

            data: [],
            lineStyle: {
              width: 3,
              color: "rgba(97, 152, 84, 0.6)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(97, 152, 84, 1.0)" },
                { offset: 1, color: "rgba(97, 152, 84, 0.2)" },
              ]),
            },
            itemStyle: {
              color: "rgba(97, 152, 84, 1.0)",
            },
          },
        ],
      };

      try {
        const response = await axios.get(
          `http://localhost:5000/predict?country=${this.myCurrCountry}`
        );
        if (response.data && response.data.length > 0) {
          option.xAxis.data = response.data.map((item) => item.year.toString());
          option.series[0].data = response.data.map((item) => item.value);
          this.myChart.setOption(option);
        } else {
          console.error("No data found for the country:", this.myCurrCountry);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    initResizeObserver() {
      const chartDom = document.getElementById("ForecastChart");
      this.resizeObserver = new ResizeObserver(() => {
        if (this.myChart) {
          const containerWidth = chartDom.clientWidth;
          this.labelFontSize = this.calculateFontSize(containerWidth);
          const option = this.myChart.getOption();
          option.xAxis[0].axisLabel.fontSize = this.labelFontSize;
          option.yAxis[0].axisLabel.fontSize = this.labelFontSize;
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
#ForecastChartContainer {
  width: 100%;
  height: 100%;
}
#ForecastChart {
  width: 100%;
  height: 100%;
}
</style>
