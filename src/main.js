import { createApp } from "vue";
import App from "./App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import ECharts from 'vue-echarts'
import 'echarts'

createApp(App).use(Antd).mount("#app");
