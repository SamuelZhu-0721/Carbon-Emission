<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";

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
  });
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.skyBox.show = false;
  viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#ffffff");
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
});
</script>

<style>
#container {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 60px 1fr; /* 第一列固定宽度，第二、三列平分剩余空间 */
  align-items: flex-start;
}
</style>
