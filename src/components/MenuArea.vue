<template>
  <div id="menuArea">
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="pickData">
        <div :class="infoRectangle">
          <h2>选择数据</h2>
          <div :class="intervals"></div>
          <div id="dataHelp" :class="['iconButtons']"></div>
          <div id="totalCarbon" :class="dataType1" @click="$emit('data-clicked', 'total')">总碳排放</div>
          <div id="buildings" :class="dataType2">建筑排放</div>
          <div id="industry" :class="dataType2">工业排放</div>
          <div id="transport" :class="dataType2">交通排放</div>
          <div id="energySystem" :class="dataType2">能源系统排放</div>
          <div id="AFOLU" :class="dataType2">其他土地利用排放</div>
          <div id="perCarbon" :class="dataType1">人均碳排放</div>
          <div id="cleanEnergy" :class="dataType1">清洁能源</div>
          <div id="wind" :class="dataType2">风能</div>
          <div id="solar" :class="dataType2">太阳能</div>
          <div id="nuclear" :class="dataType2">核能</div>
          <div id="hydro" :class="dataType2">水电</div>
        </div>
      </div>
    </div>
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="pickStyle">
        <div :class="infoRectangle">
          <h2>选择样式</h2>
          <div :class="intervals"></div>
          <div id="classifyMethodArea">
            <div :class="selectStyleHeading">分类方法</div>
            <select id="classifyMethod">
              <option>拉伸</option>
              <option>自然间断法</option>
              <option>等间距法</option>
              <option>分位数法</option>
            </select>
            <select id="stretchingNumber">
              <option>平方根</option>
              <option>线性</option>
              <option>立方根</option>
              <option>六次根</option>
            </select>
            <select id="classifyNumber">
              <option>3类</option>
              <option>4类</option>
              <option>5类</option>
            </select>
          </div>
          <div :class="intervals"></div>
          <div id="setRibbonArea">
            <div :class="selectStyleHeading">色带设置</div>
            <canvas id="ribbon"></canvas>
            <input type="color" id="startColor" value="#ffff00" />
            <input type="color" id="endColor" value="#ff0000" />
          </div>
        </div>
      </div>
    </div>
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="starred">
        <div :class="infoRectangle">
          <h2>已收藏</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuArea",
  data() {
    return {
      iconContainer: "iconContainer",
      infoRectangle: "infoRectangle",
      intervals: "intervals",
      selectStyleHeading: "selectStyleHeading",
      dataType1: "dataType1",
      dataType2: "dataType2",
    };
  },
};
</script>

<style>
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
#pickData {
  background-image: url("../assets/icon/数据.png");
}
#pickData:hover {
  background-image: url("../assets/icon_hover/数据.png");
}
#dataHelp {
  position: absolute;
  min-width: 25px;
  width: 25px;
  height: 25px;
  top: 25px;
  left: 120px;
  background-image: url("../assets/icon/帮助.png");
}
#dataHelp:hover {
  background-image: url("../assets/icon_hover/帮助.png");
}

#pickStyle {
  background-image: url("../assets/icon/样式选择.png");
}
#pickStyle:hover {
  width: 40px;
  height: 40px;
  background-image: url("../assets/icon_hover/样式选择.png");
}

#starred {
  background-image: url("../assets/icon/收藏.png");
}
#starred:hover {
  background-image: url("../assets/icon_hover/收藏.png");
}
.iconContainer {
  width: 100%;
}
/*  */
#menuArea {
  z-index: 100;
  position: absolute;
  height: 100%;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mainButtons {
  margin-left: 10px;
  left: 10px;
  margin-top: 20px;
  width: 40px;
  height: 40px;
}

.infoRectangle {
  position: absolute;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #f6f6f7;
  left: 100%;
  transition: width 0.2s ease;
  justify-content: center;
  overflow: hidden;
}

#startColor:active .infoRectangle,
.mainButtons:hover .infoRectangle {
  width: 250px;
}
.infoRectangle > * {
  min-width: 250px;
  cursor: default;
}
.infoRectangle > h2 {
  margin-left: 20px;
  color: #3478f5;
}
.infoRectangle > h3 {
  margin-left: 30px;
  font-weight: 500;
}

.dataType1 {
  padding-left: 30px;
  font-weight: 500;
  font-size: 20px;
  line-height: 50px;
  height: 50px;
}
.dataType1:hover {
  background-color: #dbdff4;
}

.dataType2 {
  padding-left: 40px;
  font-weight: 400;
  font-size: 15px;
  line-height: 30px;
  height: 30px;
}
.dataType2:hover {
  background-color: #dbdff4;
}
/* 样式选择 */
#classifyMethodArea,
#setRibbonArea {
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
}
.selectStyleHeading {
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 18px;
  line-height: 30px;
  height: 30px;
}
#applyButton1,
#applyButton2 {
  margin: 10px auto 20px auto;
  padding: 0 5px 0 5px;
  width: fit-content;
  background-color: #e9e9eb;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
#applyButton1:hover,
#applyButton2:hover {
  color: #3478f5;
}
#applyButton1:active,
#applyButton2:active {
  background-color: #e0e0e0;
}

#classifyMethod,
#classifyNumber,
#stretchingNumber {
  display: block;
  left: 100px;
  margin: 10px;
  margin-left: 10%;
  padding: 2px;
  padding-left: 10%;
  padding-right: 10%;
  font-size: 17px;
  width: 80%;
}

#classifyNumber {
  display: none;
}

#ribbon {
  height: 22px;
  border: 1px solid black;
  width: 98%;
  border-radius: 5px;
}
#startColor,
#endColor {
  width: 20px;
  height: 20px;
  padding: 0;
}
#endColor {
  float: right;
}
</style>
