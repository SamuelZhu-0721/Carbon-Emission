<template>
  <div id="timeSeriesContainer">
    <div id="timeSeries"></div>
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
      this.myChart.dispose();
    }
  },
  data() {
    return {
      myCurrCountry: "ALBANIA",
      labelFontSize: 12,
    };
  },
  props: {
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
  },
  methods: {
    calculateFontSize(containerWidth) {
      return Math.max(containerWidth / 50, 12);
    },
    async initChart() {
      const chartDom = document.getElementById("timeSeries");
      this.myChart = echarts.init(chartDom);
      const containerWidth = chartDom.clientWidth;
      this.labelFontSize = this.calculateFontSize(containerWidth);

      const option = {
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
          left: "24%",
          top: "10%",
          bottom: "10%",
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            fontSize: this.labelFontSize,
          },
          boundaryGap: false,
          axisTick: {
            inside: true,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value / 1000000 + " million";
            },
            fontSize: this.labelFontSize,
          },
        },
        series: [
          {
            name: "碳排放总量",
            type: "line",
            data: [],
            lineStyle: {
              width: 3,
              color: "rgba(65,105,225,0.6)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(65, 105, 225, 1.0)" },
                { offset: 1, color: "rgba(65, 105, 225, 0.2)" },
              ]),
            },
          },
        ],
      };
      try {
        const dataUrl = "./data/total.geojson";
        const response = await axios.get(dataUrl);
        const geoJsonData = response.data;
        const feature = geoJsonData.features.find(
          (f) => f.properties.NAME === this.myCurrCountry
        );
        if (feature) {
          const properties = feature.properties;
          const years = [];
          const values = [];
          for (let year = 1970; year <= 2020; year++) {
            const key = `F${year}`;
            if (properties[key] !== undefined) {
              years.push(year.toString());
              values.push(properties[key]);
            }
          }
          option.xAxis.data = years;
          option.series[0].data = values;
          this.myChart.setOption(option);
        } else {
          console.error("No data found for Albania");
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    },
    initResizeObserver() {
      const chartDom = document.getElementById("timeSeries");
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
#timeSeriesContainer {
  width: 100%;
  height: 100%;
}
#timeSeries {
  width: 100%;
  height: 100%;
}
</style>
