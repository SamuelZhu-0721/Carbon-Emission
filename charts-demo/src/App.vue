<template>
  <div class="button-zone" v-if="!showCharts">
    <a-button type= "primary" @click="showCharts = true" >按下我就会发生一些有趣的事情</a-button>
  </div>
  <div class="chart-container" v-if="showCharts">
    
    <v-chart class="chart" :option="option1" autoresize />
    <v-chart class="chart" :option="option2" autoresize />
  
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
const showCharts = ref(false);
const totalEmissions = ref([{ year: 1970, emmissions: 100 }, { year: 1971, emmissions: 200 }, { year: 1972, emmissions: 300 }, { year: 1973, emmissions: 400 }, { year: 1974, emmissions: 500 }, { year: 1975, emmissions: 600 }, { year: 1976, emmissions: 700 }, { year: 1977, emmissions: 800 }, { year: 1978, emmissions: 900 }, { year: 1979, emmissions: 1000 }, { year: 1980, emmissions: 1100 }, { year: 1981, emmissions: 1200 }, { year: 1982, emmissions: 1300 }, { year: 1983, emmissions: 1400 }, { year: 1984, emmissions: 1500 }, { year: 1985, emmissions: 1600 }, { year: 1986, emmissions: 1700 }, { year: 1987, emmissions: 1800 }, { year: 1988, emmissions: 900 }, { year: 1989, emmissions: 2000 }, { year: 1990, emmissions: 2100 }, { year: 1991, emmissions: 2200 }, { year: 1992, emmissions: 2300 }, { year: 1993, emmissions: 2400 }, { year: 1994, emmissions: 2500 }, { year: 1995, emmissions: 2600 }, { year: 1996, emmissions: 2700 }, { year: 1997, emmissions: 2800 }, { year: 1998, emmissions: 2900 }, { year: 1999, emmissions: 3000 }, { year: 2000, emmissions: 3100 }, { year: 2001, emmissions: 3200 }, { year: 2002, emmissions: 3300 }, { year: 2003, emmissions: 3400 }, { year: 2004, emmissions: 3500 }, { year: 2005, emmissions: 600 }, { year: 2006, emmissions: 3700 }, { year: 2007, emmissions: 3800 }, { year: 2008, emmissions: 3900 }, { year: 2009, emmissions: 4000 }, { year: 2010, emmissions: 4100 }, { year: 2011, emmissions: 4200 }, { year: 2012, emmissions: 4300 }, { year: 2013, emmissions: 4400 }, { year: 2014, emmissions: 4500 }, { year: 2015, emmissions: 4600 }, { year: 2016, emmissions: 2700 }, { year: 2017, emmissions: 3800 }, { year: 2018, emmissions: 3900 }, { year: 2019, emmissions: 5000 }, { year: 2020, emmissions: 5100 }, { year: 2021, emmissions: 5200 }, { year: 2022, emmissions: 5300 }, { year: 2023, emmissions: 5400 }, { year: 2024, emmissions: 5500 }, { year: 2025, emmissions: 5600 }, { year: 2026, emmissions: 5700 }, { year: 2027, emmissions: 5800 }, { year: 2028, emmissions: 5900 }, { year: 2029, emmissions: 6000 }, { year: 2030, emmissions: 6100 }, { year: 2031, emmissions: 6200 }, { year: 2032, emmissions: 6300 }, { year: 2033, emmissions: 6400 }, { year: 2034, emmissions: 6500 }, { year: 2035, emmissions: 6600 }, { year: 2036, emmissions: 6700 }, { year: 2037, emmissions: 6800 }, { year: 2038, emmissions: 6900 }, { year: 2039, emmissions: 7000 }, { year: 2040, emmissions: 7100 }, { year: 2041, emmissions: 7200 }, { year: 2042, emmissions: 7300 }, { year: 2043, emmissions: 7400 }, { year: 2044, emmissions: 7500 }, { year: 2045, emmissions: 7600 }, { year: 2046, emmissions: 7700 }, { year: 2047, emmissions: 7800 }, { year: 2048, emmissions: 7900 }, { year: 2049, emmissions: 8000 }, { year: 2050, emmissions: 8100 },]);
//碳排放组成
const emmissionsComposition = ref([
  { name: '电力', value: 1000 },
  { name: '工业', value: 2000 },
  { name: '交通', value: 3000 },
  { name: '建筑', value: 4000 },
  { name: '农业', value: 5000 },
  { name: '其他', value: 6000 },
]);

const option1 = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  title: {
    text: '碳排放总量',
    left: 'center'
  },

  xAxis: {
    type: 'category',
    data: totalEmissions.value.map(item => item.year)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Emmissions',
      type: 'line',
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(128, 255, 165, 0.8)' },
            { offset: 1, color: 'rgba(1, 191, 236, 0.8)' }
          ]
        }
      },
      data: totalEmissions.value.map(item => item.emmissions)
    }
  ]
});

//碳排放组成饼图
const option2 = ref({
  title: {
    text: '碳排放组成',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: '10%',
  },
  series: [
    {
      name: '碳排放组成',
      type: 'pie',
      radius: '50%',
      data: emmissionsComposition.value.map(item => ({ name: item.name, value: item.value }))
    }
  ]
});





</script>

<style scoped>

.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}
.button-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.chart {
  height: 400px;
}
</style>
