// main.js
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import ECharts from 'vue-echarts';
import 'echarts';

import 'ant-design-vue/dist/reset.css';
createApp(App)
  .component('v-chart', ECharts)
  .use(Antd)
  .mount('#app');