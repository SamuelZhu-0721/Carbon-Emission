<template>
  <div id="cesiumContainer">
    <Legend
      v-show="isLegendShow"
      :legendItems="legendItems"
      :styleMethod="styleMethod"
      :addedData="addedData"
      @change-isLegendShow="handChangeIsLegendShow"
    ></Legend>
    <InfoBox
      v-show="isInfoBoxShow"
      :currCountry
      @change-isInfoBoxShow="handleChangeIsInfoBoxShow"
    ></InfoBox>
    <UpCircleOutlined
      v-show="!isLegendShow && addedData !== null"
      id="showLegend"
      @click="showLegend"
    ></UpCircleOutlined>
  </div>
</template>

<script setup>
import Legend from "./Legend.vue";
import * as Cesium from "cesium";
import { onMounted, watch, ref } from "vue";
import InfoBox from "./InfoBox.vue";
import { UpCircleOutlined } from "@ant-design/icons-vue";

const myViewer = ref(null);
const addedData = ref(null);
const currDataSource = ref(null);
const startColor = ref(null);
const endColor = ref(null);
const styleMethod = ref("nature");
const classifyN = ref(3);
const year = ref(1970);
const currCountry = ref("null");
const isLegendShow = ref(false);
const isInfoBoxShow = ref(false);

const legendItems = ref([]); // 用于存储图例项

const minValueArray = ref(new Array(51).fill(Number.MAX_VALUE));
const maxValueArray = ref(new Array(51).fill(Number.MIN_VALUE));

const props = defineProps({
  currData: {
    type: String,
    // required: true,
    default: null,
  },
  styleMethod: {
    type: String,
    required: true,
  },
  classifyN: {
    type: Number,
    required: true,
  },
  startColor: {
    type: String,
    required: true,
  },
  endColor: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    default: 1970,
  },
  _3dType: {
    type: Number,
    required: true,
    default: 3,
  },
});

const emit = defineEmits(["country-clicked"]);

watch(
  () => props.currData,
  (newValue) => {
    if (newValue) {
      addedData.value = newValue;
      // console.log(addedData.value);
      isLegendShow.value = true;
      addData();
    }
  }
);
watch(
  () => props.styleMethod,
  (newValue) => {
    // console.log("cesium-styleMethod:", newValue);
    styleMethod.value = newValue;
    if (currDataSource.value === null) {
      alert("请选择数据！");
    } else {
      changeStyle();
    }
  }
);
watch(
  () => props.classifyN,
  (newValue) => {
    // console.log("cesium-classifyN:", newValue);
    classifyN.value = newValue;
    if (currDataSource.value === null) {
      alert("请选择数据！");
    } else {
      changeStyle();
    }
  }
);
watch(
  () => props.startColor,
  (newValue) => {
    // console.log("newStart:" + newValue);
    startColor.value = newValue;
    if (currDataSource.value === null) {
      alert("请选择数据！");
    } else {
      changeStyle();
    }
  }
);
watch(
  () => props.endColor,
  (newValue) => {
    // console.log("endStart:" + newValue);
    endColor.value = newValue;
    if (currDataSource.value === null) {
      alert("请选择数据！");
    } else {
      changeStyle();
    }
  }
);
watch(
  () => props.year,
  (newValue) => {
    year.value = newValue;
    if (currDataSource.value === null) {
      alert("请选择数据！");
    } else {
      changeStyle();
    }
  }
);
watch(
  () => props._3dType,
  (newValue) => {
    // console.log(newValue);
    switch (newValue) {
      case 3:
        myViewer.value.scene.morphTo3D(1.5);
        break;
      case 2.5:
        myViewer.value.scene.morphToColumbusView(1.5);
        break;
      case 2:
        myViewer.value.scene.morphTo2D(1.5);
        break;
    }
  }
);

onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MWMwN2Q3YS1hNmY2LTQyNGMtOTkzYS0xZWUwNzU3ZDQ1OWIiLCJpZCI6MjA1MjI2LCJpYXQiOjE3MTE2ODM3NDB9.xFT6aZMZ8iEI7Y8bOjLGccEQO48g2GZDhIeCHPJ1A20";
  const viewer = new Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    animation: false,
    timeline: false,
    geocoder: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    homeButton: false,
    sceneModePicker: false,
    infoBox: false, // 禁用信息窗口
  });
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.skyBox.show = false;
  viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#fcfcfc");
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;

  const tiandiToken = "368473092ec184171e181f0a27935857";
  viewer.imageryLayers.removeAll();
  const tiandiMapVec = new Cesium.UrlTemplateImageryProvider({
    url:
      "http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +
      tiandiToken,
    maximumLevel: 22,
  });
  const tiandiMapCva = new Cesium.UrlTemplateImageryProvider({
    url:
      "http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +
      tiandiToken,
    maximumLevel: 22,
  });
  viewer.imageryLayers.addImageryProvider(tiandiMapVec);
  viewer.imageryLayers.addImageryProvider(tiandiMapCva);

  myViewer.value = viewer;
  startColor.value = "#FFFF00";
  endColor.value = "#FF0000";

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (e) {
    let pick = viewer.scene.pick(e.position);
    if (pick && pick.id) {
      // emit("country-clicked", pick.id._properties._NAME._value);
      isInfoBoxShow.value = true;
      currCountry.value = pick.id._properties._NAME._value;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  viewer.camera.flyTo({
    destination: {
      x: -3763615.263278671,
      y: 14328046.39785114,
      z: 11968303.428517662,
    },
    orientation: {
      heading: 6.283185307179586,
      pitch: -1.5690960444421616,
      roll: 0,
    },
    duration: 1,
  });
});

const addData = () => {
  const dataUrl = "./data/" + addedData.value + ".geojson";
  // console.log(dataUrl);
  const viewer = myViewer.value;
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load(dataUrl)
    .then((dataSource) => {
      currDataSource.value = dataSource;
      viewer.dataSources.add(dataSource);
      dataSource.clustering.enabled = true;
      dataSource.clustering.point = true;
      dataSource.clustering.pixelRange = 5; //聚合距离，小于这个距离会被融合
      dataSource.clustering.minimumClusterSize = 3; //每个聚合点的最小个数};
      for (let i = 0; i < minValueArray.value.length; i++) {
        minValueArray.value[i] = Number.MAX_VALUE;
      }
      for (let i = 0; i < maxValueArray.value.length; i++) {
        maxValueArray.value[i] = Number.MIN_VALUE;
      }
      let entities = dataSource.entities.values;
      // 在加载时遍历得到当前数据所有国家，储存各个年份的最小值和最大值
      for (let i = 0; i < entities.length; i++) {
        for (let j = 1970; j <= 2020; j++) {
          const value = entities[i].properties[`_F${j}`]._value;
          if (value < minValueArray.value[j - 1970]) {
            minValueArray.value[j - 1970] = value;
          } else if (value > maxValueArray.value[j - 1970]) {
            maxValueArray.value[j - 1970] = value;
          }
        }
        entities[i].billboard = undefined;
        const area = entities[i].properties.SHAPE_AREA.getValue();
        entities[i].point = new Cesium.PointGraphics({
          pixelSize: 10 + Math.log(area) * 10,
          color: new Cesium.Color(1, 0, 0, 0.6),
          outlineWidth: 1,
          outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
        });
      }

      dataSource.clustering.clusterEvent.addEventListener(function (
        clusteredEntities, // 注释会报错？
        cluster
      ) {
        // 关闭自带的显示聚合数量的标签
        cluster.label.show = false;
        cluster.billboard.show = false;
        cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      });
      changeStyle();
    })
    .catch((e) => {
      console.log(error);
    });
};

// 将十六进制颜色转换为RGB数组
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}
function setClassifyColor(intervals, colors) {
  const startColorValue = hexToRgb(startColor.value);
  const endColorValue = hexToRgb(endColor.value);
  for (let i = 0; i < classifyN.value; i++) {
    const ratio = i / (classifyN.value - 1);
    const r =
      startColorValue[0] + (endColorValue[0] - startColorValue[0]) * ratio;
    const g =
      startColorValue[1] + (endColorValue[1] - startColorValue[1]) * ratio;
    const b =
      startColorValue[2] + (endColorValue[2] - startColorValue[2]) * ratio;
    colors[i] =
      "rgb(" +
      Math.round(r) +
      "," +
      Math.round(g) +
      "," +
      Math.round(b) +
      "," +
      0.6 +
      ")";
  }
  let entities = currDataSource.value.entities.values;
  for (let i = 0; i < entities.length; i++) {
    let value = entities[i].properties[`_F${year.value}`]._value;
    let gear;
    for (let j = 0; j < classifyN.value; j++) {
      if (value >= intervals[j] && value <= intervals[j + 1]) {
        gear = j;
        break;
      }
    }
    let color = colors[gear];
    entities[i].point.color = Cesium.Color.fromCssColorString(color);
  }
}

const changeStyle = () => {
  switch (styleMethod.value) {
    case "nature":
      changeStyleNature();
      break;
    case "equalSpace":
      changeStyleEqualSpace();
      break;
    case "quartiles":
      changeStyleQuartiles();
      break;
    default:
      console.log("Unknown command!");
      break;
  }
  legendItems.value = generateLegendItems(
    startColor.value,
    endColor.value,
    minValueArray.value[year.value - 1970],
    maxValueArray.value[year.value - 1970],
    classifyN.value
  );
};
const changeStyleEqualSpace = () => {
  // 直接基于currDataSource.entities.values;
  const min = minValueArray.value[year.value - 1970];
  const max = maxValueArray.value[year.value - 1970];
  // 生成intervals
  let intervals = new Array(classifyN.value + 1);
  let colors = new Array(classifyN.value);
  const step = (max - min) / classifyN.value;
  for (let i = 0; i <= classifyN.value; i++) {
    intervals[i] = min + step * i;
  }
  setClassifyColor(intervals, colors);
};
const changeStyleQuartiles = () => {
  // 需先将values读入数组
  const valueArray = [];
  let entities = currDataSource.value.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year.value}`]._value;
    valueArray.push(value);
  }
  valueArray.sort((a, b) => a - b);
  // 生成intervals
  let intervals = new Array(classifyN.value + 1);
  let colors = new Array(classifyN.value);
  const step = entities.length / classifyN.value;
  for (let i = 0; i < classifyN.value; i++) {
    intervals[i] = valueArray[Math.floor(i * step)];
  }
  intervals[classifyN.value] = valueArray[entities.length - 1];
  setClassifyColor(intervals, colors);
};
const changeStyleNature = () => {
  // 需先将values读入数组
  const valueArray = [];
  let entities = currDataSource.value.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year.value}`]._value;
    valueArray.push(value);
  }
  valueArray.sort((a, b) => a - b);
  let mat1 = [];
  let temp;
  for (let x = 0, xl = valueArray.length + 1; x < xl; x++) {
    temp = [];
    for (let j = 0, jl = classifyN.value + 1; j < jl; j++) {
      temp.push(0);
    }
    mat1.push(temp);
  }
  let mat2 = [];
  let temp2;
  for (let i = 0, il = valueArray.length + 1; i < il; i++) {
    temp2 = [];
    for (let c = 0, cl = classifyN.value + 1; c < cl; c++) {
      temp2.push(0);
    }
    mat2.push(temp2);
  }
  let v;
  for (let y = 1, yl = classifyN.value + 1; y < yl; y++) {
    mat1[0][y] = 1;
    mat2[0][y] = 0;
    for (let t = 1, tl = valueArray.length + 1; t < tl; t++) {
      mat2[t][y] = Infinity;
    }
    v = 0.0;
  }
  for (let l = 2, ll = valueArray.length + 1; l < ll; l++) {
    let s1 = 0.0;
    let s2 = 0.0;
    let w = 0.0;
    for (let m = 1, ml = l + 1; m < ml; m++) {
      let i3 = l - m + 1;
      let val = parseFloat(valueArray[i3 - 1]);
      s2 += val * val;
      s1 += val;
      w += 1;
      v = s2 - (s1 * s1) / w;
      let i4 = i3 - 1;
      if (i4 != 0) {
        for (let p = 2, pl = classifyN.value + 1; p < pl; p++) {
          if (mat2[l][p] >= v + mat2[i4][p - 1]) {
            mat1[l][p] = i3;
            mat2[l][p] = v + mat2[i4][p - 1];
          }
        }
      }
    }
    mat1[l][1] = 1;
    mat2[l][1] = v;
  }
  let k = valueArray.length;
  // 生成intervals
  let intervals = [];
  for (let i = 0, il = classifyN.value + 1; i < il; i++) {
    intervals.push(0);
  }

  intervals[classifyN.value] = parseFloat(valueArray[valueArray.length - 1]);
  intervals[0] = parseFloat(valueArray[0]);
  let countNum = classifyN.value;
  while (countNum >= 2) {
    let id = parseInt(mat1[k][countNum] - 2);
    intervals[countNum - 1] = valueArray[id];
    k = parseInt(mat1[k][countNum] - 1);
    countNum -= 1;
  }
  if (intervals[0] == intervals[1]) {
    intervals[0] = 0;
  }
  let colors = new Array(classifyN.value);
  setClassifyColor(intervals, colors);
};

// 生成图例项
const generateLegendItems = (
  startColor,
  endColor,
  minValue,
  maxValue,
  steps
) => {
  const items = [];
  const startColorValue = hexToRgb(startColor);
  const endColorValue = hexToRgb(endColor);
  const step = (maxValue - minValue) / steps;
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r =
      startColorValue[0] + (endColorValue[0] - startColorValue[0]) * ratio;
    const g =
      startColorValue[1] + (endColorValue[1] - startColorValue[1]) * ratio;
    const b =
      startColorValue[2] + (endColorValue[2] - startColorValue[2]) * ratio;
    items.push({
      color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)},0.6)`,
      label: `${(minValue + (step * i) / 100000000).toFixed(1)}亿 - ${(
        minValue +
        (step * (i + 1)) / 100000000
      ).toFixed(1)}亿`,
    });
  }
  return items;
};

const handleChangeIsInfoBoxShow = () => {
  isInfoBoxShow.value = !isInfoBoxShow.value;
};
const handChangeIsLegendShow = () => {
  isLegendShow.value = !isLegendShow.value;
};
const showLegend = () => {
  isLegendShow.value = !isLegendShow.value;
};
</script>

<style>
#container {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: flex-start;
}
#showLegend {
  position: absolute;
  z-index: 100;
  font-size: 30px;
  right: 20px;
  bottom: 20px;
}
</style>
