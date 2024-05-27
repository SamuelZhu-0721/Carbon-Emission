// const dataSource = new Cesium.GeoJsonDataSource();
// dataSource.load("src/data/total.geojson").then(function (loadedDataSource) {
//     viewer.dataSources.add(loadedDataSource);
//     // const entities = loadedDataSource.entities.values;
// });

// 获取画布对象和颜色选择器
const ribbon = document.getElementById("ribbon");
const ctx = ribbon.getContext("2d");
const startColorInput = document.getElementById("startColor");
const endColorInput = document.getElementById("endColor");

// 初始化起始和终止颜色
let startColor = hexToRgb(startColorInput.value);
let endColor = hexToRgb(endColorInput.value);
generateRibbon();

startColorInput.addEventListener("change", generateRibbon);
endColorInput.addEventListener("change", generateRibbon);

// 生成色带的函数
function generateRibbon() {
  startColor = hexToRgb(startColorInput.value);
  endColor = hexToRgb(endColorInput.value);
  for (let x = 0; x < ribbon.width; x++) {
    let r = startColor[0] + ((endColor[0] - startColor[0]) * x) / ribbon.width;
    let g = startColor[1] + ((endColor[1] - startColor[1]) * x) / ribbon.width;
    let b = startColor[2] + ((endColor[2] - startColor[2]) * x) / ribbon.width;
    let color =
      "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, 1, ribbon.height);
  }
}

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
