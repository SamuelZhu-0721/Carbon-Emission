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
    this.initChart();
    this.fetchData();
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
      myCurrCountry: "CHINA", // 默认国家，可以通过props传入或修改
      labelFontSize: 12,
    };
  },
  props: {
    currCountry: {
      type: String,
      default: "CHINA",
    },
  },
  watch: {
    currCountry(newValue) {
      this.myCurrCountry = newValue;
      this.initChart();
      this.fetchData();
    },
  },
  methods: {
    calculateFontSize(containerWidth) {
      return Math.max(containerWidth / 50, 12);
    },

    initChart() {
      const chartDom = document.getElementById("ForecastChart");
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(chartDom);
      this.initResizeObserver();
    },

    async fetchData() {
      const response = await axios.get(
        `http://localhost:5000/predict?country=${this.myCurrCountry}`
      );
      if (response.data && response.data.length > 0) {
        const option = this.buildChartOption(response.data);
        this.myChart.setOption(option);
      } else {
        console.error("No data found for the country:", this.myCurrCountry);
      }
    },

    buildChartOption(data) {
      const containerWidth =
        document.getElementById("ForecastChart").clientWidth;
      this.labelFontSize = this.calculateFontSize(containerWidth);

      return {
        title: {
          text: this.myCurrCountry,
          left: "center",
          top: "2%",
          textStyle: {
            fontSize: this.labelFontSize * 1.3,
          },
        },
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
          data: data.map((item) => item.year.toString()),
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: (value) => `${value} tons`,
          },
        },
        series: [
          {
            name: "CO2 Emissions",
            type: "line",
            stack: "total",
            data: data.map((item) => item.value),
            lineStyle: {
              width: 2,
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
            markLine: {
              symbol: ["none", "none"],
              label: {
                show: false,
              },
              lineStyle: {
                type: "dashed",
                color: "rgba(97, 152, 84, 0.6)",
                width: 2.5,
              },
              data: [
                {
                  xAxis: "2020",
                },
              ],
            },
          },
        ],
      };
    },

    initResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      const chartDom = document.getElementById("ForecastChart");
      this.resizeObserver = new ResizeObserver((entries) => {
        if (this.myChart && entries[0].contentRect.width > 0) {
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
