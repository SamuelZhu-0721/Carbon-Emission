// 获取画布对象和颜色选择器
const ribbon = document.getElementById("ribbon");
const ctx = ribbon.getContext("2d");
const startColorInput = document.getElementById("startColor");
const endColorInput = document.getElementById("endColor");

const legendRibbon = document.getElementById("legendRibbon");
const cty = legendRibbon.getContext("2d");

// 创建两个长度为51的数组，分别存储当前数据各个年份的最小值和最大值
var minValueArray = new Array(51).fill(Number.MAX_VALUE);
var maxValueArray = new Array(51).fill(Number.MIN_VALUE);

// 存储样式
// 分类方法，默认为拉伸
var styleMethod = "stretching";
// 拉伸参数，即色带分布方式
var stretchingN = 2;
// 其他分类（等间距、分为数、自然间断）参数，即分类数量
var classifyN = 3;


// 初始化起始和终止颜色
let startColor = hexToRgb(startColorInput.value);
let endColor = hexToRgb(endColorInput.value);
generateRibbon();

// 每次颜色改动、重绘样式
startColorInput.addEventListener("change", function () {
  generateRibbon();
  changeStyle();
});
endColorInput.addEventListener("change", function () {
  generateRibbon();
  changeStyle();
});

// 生成色带
function generateRibbon() {
  startColor = hexToRgb(startColorInput.value);
  endColor = hexToRgb(endColorInput.value);
  for (let x = 0; x < ribbon.width; x++) {
    let r =
      startColor[0] +
      ((endColor[0] - startColor[0]) * Math.pow(x, stretchingN)) /
        Math.pow(ribbon.width, stretchingN);
    let g =
      startColor[1] +
      ((endColor[1] - startColor[1]) * Math.pow(x, stretchingN)) /
        Math.pow(ribbon.width, stretchingN);
    let b =
      startColor[2] +
      ((endColor[2] - startColor[2]) * Math.pow(x, stretchingN)) /
        Math.pow(ribbon.width, stretchingN);
    let color =
      "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
    ctx.fillStyle = color;
    ctx.fillRect(x, 0, 1, ribbon.height);
  }
  for (let y = 0; y < legendRibbon.height; y++) {
    let r =
      startColor[0] +
      ((endColor[0] - startColor[0]) *
        Math.pow(legendRibbon.height - y, stretchingN)) /
        Math.pow(legendRibbon.height, stretchingN);
    let g =
      startColor[1] +
      ((endColor[1] - startColor[1]) *
        Math.pow(legendRibbon.height - y, stretchingN)) /
        Math.pow(legendRibbon.height, stretchingN);
    let b =
      startColor[2] +
      ((endColor[2] - startColor[2]) *
        Math.pow(legendRibbon.height - y, stretchingN)) /
        Math.pow(legendRibbon.height, stretchingN);
    let color =
      "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
    cty.fillStyle = color;
    cty.fillRect(0, y, legendRibbon.width, 1);
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


// 加载total
let currDataSource = null;
Cesium.GeoJsonDataSource.load("../src/data_point/total_point.geojson", {})
  .then(function (dataSource) {
    currDataSource = dataSource;
    addData(); // 待注释
  })
  .catch((e) => {
    console.log(error);
  });

// 加载total
function addData() {
  if (!currDataSource) console.log("nodata");
  viewer.dataSources.add(currDataSource);
  let entities = currDataSource.entities.values;
  // 在加载时遍历得到当前数据所有国家，储存各个年份的最小值和最大值
  for (let i = 0; i < entities.length; i++) {
    for (let j = 1970; j <= 2020; j++) {
      const value = entities[i].properties[`_F${j}`]._value;
      if (value < minValueArray[j - 1970]) {
        minValueArray[j - 1970] = value;
      } else if (value > maxValueArray[j - 1970]) {
        maxValueArray[j - 1970] = value;
      }
    }
    entities[i].billboard = undefined;
    entities[i].point = new Cesium.PointGraphics({
      pixelSize: 15,
      color: Cesium.Color.fromCssColorString("#ff0000"),
      outlineWidth: 1,
      outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
    });
  }
  // changeStyle();
}


const classifyMethod = document.getElementById("classifyMethod");
const stretchingNumber = document.getElementById("stretchingNumber");
const classifyNumber = document.getElementById("classifyNumber");
// 更改符号化类型（拉伸和其他三种分层设色）
classifyMethod.addEventListener("change", function () {
  const value = classifyMethod.value;
  switch (value) {
    case "拉伸":
      styleMethod = "stretching";
      stretchingNumber.style.display = "block";
      classifyNumber.style.display = "none";
      break;
    case "自然间断法":
      styleMethod = "nature";
      stretchingNumber.style.display = "none";
      classifyNumber.style.display = "block";
      break;
    case "等间距法":
      styleMethod = "equalSpace";
      stretchingNumber.style.display = "none";
      classifyNumber.style.display = "block";
      break;
    case "分位数法":
      styleMethod = "quartiles";
      stretchingNumber.style.display = "none";
      classifyNumber.style.display = "block";
      break;
    default:
      console.log("Unknown command!");
      break;
  }
  console.log(styleMethod);
  changeStyle();
});
// 更改拉伸参数
stretchingNumber.addEventListener("change", function () {
  const value = stretchingNumber.value;
  switch (value) {
    case "线性":
      stretchingN = 1;
      break;
    case "平方根":
      stretchingN = 2;
      break;
    case "立方根":
      stretchingN = 3;
      break;
    case "六次根":
      stretchingN = 6;
      break;
    default:
      console.log("Unknown command!");
      break;
  }
  changeStyleStretching();
  generateRibbon();
});
// 更改分类参数
classifyNumber.addEventListener("change", function () {
  const value = classifyNumber.value;
  switch (value) {
    case "3类":
      classifyN = 3;
      break;
    case "4类":
      classifyN = 4;
      break;
    case "5类":
      classifyN = 5;
      break;
    default:
      console.log("Unknown command!");
      break;
  }
  changeStyle();
});

// 改变样式
function changeStyle() {
  switch (styleMethod) {
    case "stretching":
      changeStyleStretching();
      break;
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
}

// 生成拉伸的图例
function changeLegendStretching() {
  const legendArea1 = document.getElementById("legendArea1");
  const legendArea2 = document.getElementById("legendArea2");
  legendArea1.style.display = "block";
  legendArea2.style.display = "none";
  const labelMin = document.getElementById("stretchingMin");
  const labelMax = document.getElementById("stretchingMax");
  labelMin.textContent = minValueArray[year - 1970];
  const max = maxValueArray[year - 1970] / 100000000;
  labelMax.textContent = Math.round(max * 1000) / 1000 + "亿";
}
// 生成其他分类方法的图例
function changeLegendClassify(intervals, colors) {
  const legendArea1 = document.getElementById("legendArea1");
  const legendArea2 = document.getElementById("legendArea2");
  legendArea1.style.display = "none";
  legendArea2.style.display = "block";
  const legend2 = document.getElementById("legend2");
  while (legend2.firstChild) {
    legend2.removeChild(legend2.firstChild);
  }
  for (let i = 0; i < classifyN; i++) {
    const classifyLabel = document.createElement("div");
    classifyLabel.className = "classifyLabel";
    const classifyColor = document.createElement("div");
    classifyColor.className = "classifyColor";
    classifyColor.style.backgroundColor = colors[i];
    const classifyNumber = document.createElement("div");
    classifyNumber.className = "classifyNumber";
    let down = intervals[i] / 100000000;
    let up = intervals[i + 1] / 100000000;
    classifyNumber.textContent =
      down.toFixed(1) + "亿 - " + up.toFixed(1) + "亿";
    classifyLabel.appendChild(classifyColor);
    classifyLabel.appendChild(classifyNumber);
    legend2.appendChild(classifyLabel);
  }
}

// 改变拉伸
function changeStyleStretching() {
  startColor = hexToRgb(startColorInput.value);
  endColor = hexToRgb(endColorInput.value);
  let entities = currDataSource.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year}`]._value;
    let color;
    const minValue = minValueArray[year - 1970];
    const maxValue = maxValueArray[year - 1970];
    const ratio =
      (Math.pow(value, 1 / stretchingN) - Math.pow(minValue, 1 / stretchingN)) /
      (Math.pow(maxValue, 1 / stretchingN) -
        Math.pow(minValue, 1 / stretchingN));
    const r = startColor[0] + (endColor[0] - startColor[0]) * ratio;
    const g = startColor[1] + (endColor[1] - startColor[1]) * ratio;
    const b = startColor[2] + (endColor[2] - startColor[2]) * ratio;
    color = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    entities[i].point.color = Cesium.Color.fromCssColorString(color);
  }
  changeLegendStretching();
}

// 读取intervals（分类区间），生成colors，并设置各点颜色
// intervals的大小为classifyN+1，colors大小为classifyN
function setClassifyColor(intervals, colors) {
  for (let i = 0; i < classifyN; i++) {
    const ratio = i / (classifyN - 1);
    const r = startColor[0] + (endColor[0] - startColor[0]) * ratio;
    const g = startColor[1] + (endColor[1] - startColor[1]) * ratio;
    const b = startColor[2] + (endColor[2] - startColor[2]) * ratio;
    colors[i] =
      "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
  }
  let entities = currDataSource.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year}`]._value;
    let gear;
    for (let i = 0; i < classifyN; i++) {
      if (value >= intervals[i] && value <= intervals[i + 1]) {
        gear = i;
        break;
      }
    }
    let color = colors[gear];
    entities[i].point.color = Cesium.Color.fromCssColorString(color);
  }
}
// 改变等间距
function changeStyleEqualSpace() {
  // 直接基于currDataSource.entities.values;
  const min = minValueArray[year - 1970];
  const max = maxValueArray[year - 1970];
  // 生成intervals
  let intervals = new Array(classifyN + 1);
  let colors = new Array(classifyN);
  const step = (max - min) / classifyN;
  for (let i = 0; i <= classifyN; i++) {
    intervals[i] = min + step * i;
  }
  setClassifyColor(intervals, colors);
  changeLegendClassify(intervals, colors);
}
// 改变分位数
function changeStyleQuartiles() {
  // 需先将values读入数组
  const valueArray = [];
  let entities = currDataSource.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year}`]._value;
    valueArray.push(value);
  }
  valueArray.sort((a, b) => a - b);
  // 生成intervals
  let intervals = new Array(classifyN + 1);
  let colors = new Array(classifyN);
  const step = entities.length / classifyN;
  for (let i = 0; i < classifyN; i++) {
    intervals[i] = valueArray[Math.floor(i * step)];
  }
  intervals[classifyN] = valueArray[entities.length - 1];
  setClassifyColor(intervals, colors);
  changeLegendClassify(intervals, colors);
}
// 改变自然间断（基于jenks，中间一坨计算和生成intervlas的方法不用管
function changeStyleNature() {
  // 需先将values读入数组
  const valueArray = [];
  let entities = currDataSource.entities.values;
  for (let i = 0; i < entities.length; i++) {
    const value = entities[i].properties[`_F${year}`]._value;
    valueArray.push(value);
  }
  valueArray.sort((a, b) => a - b);
  let mat1 = [];
  let temp;
  for (let x = 0, xl = valueArray.length + 1; x < xl; x++) {
    temp = [];
    for (let j = 0, jl = classifyN + 1; j < jl; j++) {
      temp.push(0);
    }
    mat1.push(temp);
  }
  let mat2 = [];
  let temp2;
  for (let i = 0, il = valueArray.length + 1; i < il; i++) {
    temp2 = [];
    for (let c = 0, cl = classifyN + 1; c < cl; c++) {
      temp2.push(0);
    }
    mat2.push(temp2);
  }
  let v;
  for (let y = 1, yl = classifyN + 1; y < yl; y++) {
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
        for (let p = 2, pl = classifyN + 1; p < pl; p++) {
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
  for (i = 0, il = classifyN + 1; i < il; i++) {
    intervals.push(0);
  }
  intervals[classifyN] = parseFloat(valueArray[valueArray.length - 1]);
  intervals[0] = parseFloat(valueArray[0]);
  let countNum = classifyN;
  while (countNum >= 2) {
    let id = parseInt(mat1[k][countNum] - 2);
    intervals[countNum - 1] = valueArray[id];
    k = parseInt(mat1[k][countNum] - 1);
    countNum -= 1;
  }
  if (intervals[0] == intervals[1]) {
    intervals[0] = 0;
  }
  let colors = new Array(classifyN);
  setClassifyColor(intervals, colors);
  changeLegendClassify(intervals, colors);
}
