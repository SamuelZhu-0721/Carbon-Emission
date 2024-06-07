//界面初始化
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

viewer.scene.skyBox.show = false;
viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#ffffff");
viewer.scene.sun.show = false;
viewer.scene.moon.show = false;

// const dataSource = new Cesium.GeoJsonDataSource();
// dataSource.load("../../data_geojson/total.geojson").then(function (dataSource) {
//   // const entities = dataSource.entities.values;
//   // viewer.dataSources.add(dataSource);
// });

viewer.camera.setView({
  destination: {x: -3695288.431791321, y:13791004.176066725,z:10341618.403306393},
    orientation: {
        heading:6.283185307179586,
        pitch:-1.5707963267948966,
        roll:0
    }     
});
//Cesium.Cartesian3.fromDegrees(centeropt.x, centeropt.y, centeropt.z || 0);