<template>
  <div id="timeSeries"></div>
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
      console.log("in");
      this.initChart();
    },
  },
  methods: {
    async initChart() {
      const chartDom = document.getElementById("timeSeries");
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "18%",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Population",
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
          myChart.setOption(option);
        } else {
          console.error("No data found for Albania");
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    },
  },
};
</script>

<style>
#timeSeries {
  width: 800px;
  height: 200px;
  right: 270px;
  top: 10px;
}
</style>
