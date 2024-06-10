<template>
  <div id="container">
    <div id="fakeMenuArea"></div>
    <div id="showArea">
      <div id="mapArea" ref="mapArea">
        <CesiumViewer :currData="currData"></CesiumViewer>
        <div id="toolsArea">
          <div id="search" class="iconButtons"></div>
          <div id="star" class="iconButtons"></div>
          <div id="modePicker_3d" class="iconButtons"></div>
          <div id="modePicker_2_5d" class="iconButtons"></div>
          <div id="modePicker_2d" class="iconButtons"></div>
        </div>
        <TimeLine ref="timeline"></TimeLine>
        <div id="legendArea1" class="legendArea">
          <h4>拉伸</h4>
          <div class="legend">
            <div id="legendRibbonArea">
              <canvas id="legendRibbon"></canvas>
            </div>
            <div id="legendLabelArea">
              <div id="stretchingMax">0</div>
              <div id="stretchingMin">0</div>
            </div>
          </div>
        </div>
        <div id="legendArea2" class="legendArea">
          <h4>分层设色</h4>
          <div class="legend" id="legend2"></div>
        </div>
        <div id="stateArea"></div>
      </div>
      <div id="columnDragger" @mousedown="startResize"></div>
      <div id="chartArea" ref="chartArea">
        <div id="compareIcon" class="iconButtons"></div>
        <div id="compare" class="iconButtons">对比</div>
        <div id="pitGraphArea">
          <span class="graphHeading">碳排放类型占比</span>
          <div class="graphArea"></div>
        </div>
        <div id="lineGraphArea">
          <span class="graphHeading">碳排放时序变化</span>
          <div class="graphArea"></div>
        </div>
        <div id="lineGraphArea2">
          <span class="graphHeading">清洁能源时序变化：(可选)</span>
          <div class="graphArea"></div>
        </div>
        <div id="predict" style="margin-bottom: 100px">
          <span class="graphHeading">碳达峰年份预测：</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowArea",
  components: {
    CesiumViewer,
    TimeLine,
  },
  props: {
    currData: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      initChartAreaWidth: null,
      initMapAreaWidth: null,
      resizeStartX: null,
      currChartAreaWidth: null,
      currMapAreaWidth: null,
    };
  },
  mounted() {
    this.initChartAreaWidth = this.$refs.chartArea.offsetWidth;
    this.initMapAreaWidth = this.$refs.mapArea.offsetWidth;
    this.currChartAreaWidth = this.initChartAreaWidth;
    this.currMapAreaWidth = this.initMapAreaWidth;
  },
  methods: {
    startResize(e) {
      this.resizeStartX = e.clientX;
      window.addEventListener("mousemove", this.resize);
      window.addEventListener("mouseup", this.stopResize);
    },
    resize(e) {
      const deltaX = e.clientX - this.resizeStartX;
      let newMapAreaWidth = this.currMapAreaWidth + deltaX;
      let newChartAreaWidth = this.currChartAreaWidth - deltaX;
      if (newMapAreaWidth < window.innerWidth / 2) {
        newMapAreaWidth = window.innerWidth / 2;
        newChartAreaWidth = window.innerWidth / 2 - 65;
        this.stopResize();
      }
      if (newChartAreaWidth < this.initChartAreaWidth) {
        newChartAreaWidth = this.initChartAreaWidth;
        newMapAreaWidth = this.initMapAreaWidth;
        this.stopResize();
      }
      this.$refs.mapArea.style.flex = `0 0 ${newMapAreaWidth}px`;
      this.$refs.chartArea.style.flex = `0 0 ${newChartAreaWidth}px`;
      this.currChartAreaWidth = newChartAreaWidth;
      this.currMapAreaWidth = newMapAreaWidth;
      this.resizeStartX = e.clientX;

      this.$refs.timeline.initPosition();
    },
    stopResize() {
      window.removeEventListener("mousemove", this.resize);
      window.removeEventListener("mouseup", this.stopResize);
    },

    // catch() {
    //   console.log("catch");
    // },
  },
};

import CesiumViewer from "./CesiumViewer.vue";
import TimeLine from "./TimeLine.vue";
</script>

<style>
/* 第一列：菜单栏 */
#fakeMenuArea {
  position: relative;
  height: 100%;
  background-color: #f6f6f7;
}
/* 第二列：地图和图标*/
#showArea {
  position: relative;
  height: 100%;
  display: flex;
}
#mapArea {
  position: relative;
  flex: 3;
  /* background-color: blue; */
}
#columnDragger {
  width: 5px;
  cursor: ew-resize;
  user-select: none;
  background-color: #f6f6f7;
}
#chartArea {
  position: relative;
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  max-height: 100vh;
}

/* 地图区 */
#cesiumContainer {
  position: relative;
  height: 96%;
  left: 0px;
}
/* 工具区 */
#toolsArea {
  position: absolute;
  top: 2%;
  right: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#toolsArea .iconButtons {
  margin: 5px;
  width: 35px;
  height: 35px;
  background-size: 27px 27px;
  background-color: #edeff8;
  border-radius: 5px;
}
#toolsArea .iconButtons:active {
  background-color: #e6e8ee;
}

#search {
  background-image: url("../assets/icon/搜索.png");
}
#search:hover {
  background-image: url("../assets/icon_hover/搜索.png");
}
#star {
  background-image: url("../assets/icon/收藏.png");
}
#star:hover {
  background-image: url("../assets/icon_hover/收藏.png");
}
#modePicker_3d {
  background-image: url("../assets/icon/3d.png");
}
#modePicker_3d:hover {
  background-image: url("../assets/icon_hover/3d.png");
}
#modePicker_2_5d {
  display: none;
  background-image: url("../assets/icon/2.5d.png");
}
#modePicker_2_5d:hover {
  background-image: url("../assets/icon_hover/2.5d.png");
}
#modePicker_2d {
  display: none;
  background-image: url("../assets/icon/2d.png");
}
#modePicker_2d:hover {
  background-image: url("../assets/icon_hover/2d.png");
}

/*  */
#stateArea {
  position: relative;
  height: 4%;
  background: #e0e0e0;
  color: #3478f5;
  font-family: "Arial", sans-serif;
  font-weight: bold;
}

/* 图表区 */

#compareIcon {
  position: absolute;
  top: 1px;
  left: 5%;
  width: 35px;
  height: 35px;
  background-image: url("../assets/icon/对比.png");
}
#compare {
  width: 100px;
  padding: 1px 5px 1px 40px;
  margin: 5px;
  margin-bottom: 15px;
  margin-left: 5%;
  font-size: 19px;
  font-weight: 500;
  color: #3478f5;
  background-color: #e6eefd;
  border-radius: 5px;
}
.graphHeading {
  margin-left: 5%;
  padding: 1px 5px 1px 5px;
  height: 20px;
  font-size: 19px;
  font-weight: 500;
  border-radius: 2px;
}
#pitGraphArea .graphHeading {
  background-color: #fbe6e7;
  color: #ea3543;
}
#lineGraphArea .graphHeading {
  background-color: #e6eefd;
  color: #3579f6;
}
#lineGraphArea2 .graphHeading {
  background-color: #dce4dd;
  color: #4e9a4b;
}
#predict .graphHeading {
  background-color: #f6f6f7;
  color: #6e757c;
}

.graphArea {
  margin-top: 5px;
  margin-bottom: 10px;
  margin-left: 5%;
  width: 90%;
  aspect-ratio: 16/9;
  background-color: #f6f6f6;
}

/*  */
.legendArea {
  display: none;
  border-radius: 10px;
  background-color: #dee6ff;
  position: absolute;
  width: 17%;
  /* height: 200px; */
  bottom: 40px;
  right: 10px;
  color: #000000;
  padding: 5px 10px 5px 10px;
}

.legendArea h4 {
  margin: 4px 0 0 0;
  color: #3478f5;
  text-align: center;
}

.legend {
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #3478f5;
  font-weight: 700;
}

#legendRibbonArea,
#legendLabelArea {
  height: 90%;
  width: 50%;
}

#legendRibbonArea {
  /* background-color: #4e9a4b; */
  width: 30%;
}
#legendLabelArea {
  width: 70%;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
}
#legendRibbon {
  /* margin-top: 10%; */
  width: 100%;
  height: 150px;
  border-radius: 5px;
}
#stretchingMax,
#stretchingMin {
  margin-left: 10px;
}

#stretchingMin {
  margin-top: auto;
}

/* #legendArea2 {
    display: none;
  } */
#legend2 {
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.classifyLabel {
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.classifyColor {
  margin-bottom: 5px;
  border: 2px solid rgb(255, 255, 255);
  background-color: #ff0101;
  width: 24px;
  height: 24px;
  border-radius: 12px;
}

.classifyNumber {
  margin-left: 10px;
  font-weight: 500;
}
</style>
