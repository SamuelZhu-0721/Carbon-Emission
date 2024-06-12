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
  data() {
    return {
      myCurrCountry: "ALBANIA",
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
    async initChart() {
      const chartDom = document.getElementById("timeSeries");
      this.myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "20%",
          top: "10%",
          bottom: "10%",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (value) {
              return value / 1000000 + " million";
            },
          },
        },
        series: [
          {
            name: "碳排放总量",
            type: "line",
            data: [],
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
          this.myChart.resize();
        }
      });
      this.resizeObserver.observe(chartDom);
    },
    beforeDestroy() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.myChart) {
        this.myChart.dispose(); // 清理图表实例
      }
    },
  },
};
</script>

<style>
#timeSeriesContainer {
  width: 100%;
  height: 100%;
}#timeSeries {
  width: 100%;
  height: 100%;
}
</style>
