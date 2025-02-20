<template>
  <div id="container">
    <div id="fakeMenuArea"></div>
    <div id="showArea">
      <div id="mapArea" ref="mapArea">
        <CesiumViewer
          :currData="currData"
          :styleMethod="styleMethod"
          :classifyN="classifyN"
          :startColor="startColor"
          :endColor="endColor"
          :year="year"
          :_3dType="_3dType"
          :currView="currView"
          :myCurrView="myCurrView"
          ref="cesiumViewerRef"
          @country-clicked="handleCountryClicked"
        ></CesiumViewer>
        <div id="toolsArea">
          <div
            id="search"
            class="iconButtons"
            @click="toggleAutocomplete"
          ></div>
          <AutocompleteSearch
            v-if="showAutocomplete"
            @searchAndSelected="handleSearchAndSelected"
          />
          <div id="star" class="iconButtons" @click="getCollect"></div>
          <div
            id="modePicker_3d"
            class="iconButtons"
            @click="handleClick3d"
            v-show="_3dType == 3"
          ></div>
          <div
            id="modePicker_2_5d"
            class="iconButtons"
            @click="handleClick3d"
            v-show="_3dType == 2.5"
          ></div>
          <div
            id="modePicker_2d"
            class="iconButtons"
            @click="handleClick3d"
            v-show="_3dType == 2"
          ></div>
        </div>
        <TimeLine ref="timeline" @change-year="handleChangeYear"></TimeLine>
        <div id="stateArea">
          <span class="stateLabel">数据源：{{ currDataCHN }}</span>
          <span v-show="currDataCHN !== '无'" class="stateLabel"
            >年份：{{ year }}</span
          >
          <span v-show="currDataCHN !== '无'" class="stateLabel"
            >分类方式：{{ styleMethodCHN }}</span
          >
        </div>
      </div>
      <div id="columnDragger" @mousedown="startResize"></div>
      <div id="chartArea" ref="chartArea">
        <div id="pitGraphArea">
          <span class="graphHeading">碳排放类型占比</span>
          <div class="graphArea">
            <PieChart :currCountry="currCountry" :year="year"></PieChart>
          </div>
        </div>
        <div id="lineGraphArea">
          <span class="graphHeading">碳排放时序变化</span>
          <div class="graphArea">
            <TimeSeries :currCountry="currCountry"></TimeSeries>
          </div>
        </div>
        <div id="lineGraphArea2">
          <span class="graphHeading">清洁能源时序变化</span>
          <div class="graphArea">
            <ForecastChart :currCountry="currCountry"></ForecastChart>
          </div>
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
    AutocompleteSearch,
    PieChart,
    TimeSeries,
    ForecastChart,
  },
  props: {
    currData: {
      type: String,
      // required: true,
      default: null,
    },
    styleMethod: {
      type: String,
      required: true,
      default: "nature",
    },
    classifyN: {
      type: Number,
      required: true,
      default: 3,
    },
    startColor: {
      type: String,
      required: true,
      default: "#FFFF00",
    },
    endColor: {
      type: String,
      required: true,
      default: "#FF0000",
    },
    currView: {
      default: {
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
      },
    },
  },

  data() {
    return {
      showAutocomplete: false,
      initChartAreaWidth: null,
      initMapAreaWidth: null,
      resizeStartX: null,
      currChartAreaWidth: null,
      currMapAreaWidth: null,
      year: 1970,
      styleMethodCHN: "自然间断法",
      currDataCHN: "无",
      currCountry: null,
      _3dType: 3,
      myCurrView: null,
    };
  },
  watch: {
    styleMethod(newValue) {
      switch (newValue) {
        case "nature":
          this.styleMethodCHN = "自然间断法";
          break;
        case "equalSpace":
          this.styleMethodCHN = "等间距法";
          break;
        case "quartiles":
          this.styleMethodCHN = "分位数法";
          break;
        default:
          console.log("unknown type");
          break;
      }
    },
    currData(newValue) {
      switch (newValue) {
        case "total":
          this.currDataCHN = "总碳排";
          break;
        case "buildings":
          this.currDataCHN = "建筑碳排";
          break;
        case "energy":
          this.currDataCHN = "能源碳排";
          break;
        case "transport":
          this.currDataCHN = "交通碳排";
          break;
        case "industry":
          this.currDataCHN = "工业碳排";
          break;
        case "AFOLU":
          this.currDataCHN = "其他碳排";
          break;
        case "total_per":
          this.currDataCHN = "人均总碳排";
          break;
        case "buildings_per":
          this.currDataCHN = "人均建筑碳排";
          break;
        case "energy_per":
          this.currDataCHN = "人均能源碳排";
          break;
        case "transport_per":
          this.currDataCHN = "人均交通碳排";
          break;
        case "industry_per":
          this.currDataCHN = "人均工业碳排";
          break;
        case "AFOLU_per":
          this.currDataCHN = "人均其他碳排";
          break;
        default:
          console.log("unknown type");
          break;
      }
    },
  },
  mounted() {
    this.initChartAreaWidth = this.$refs.chartArea.offsetWidth;
    this.initMapAreaWidth = this.$refs.mapArea.offsetWidth;
    this.currChartAreaWidth = this.initChartAreaWidth;
    this.currMapAreaWidth = this.initMapAreaWidth;
  },
  methods: {
    toggleAutocomplete() {
      this.showAutocomplete = !this.showAutocomplete;
      console.log(this.showAutocomplete);
    },
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
    handleChangeYear(value) {
      this.year = value;
      console.log("showArea-year2:" + this.year);
    },
    handleCountryClicked(value) {
      this.currCountry = value;
      console.log("showarea: " + this.currCountry);
    },
    handleClick3d() {
      console.log(this._3dType);
      switch (this._3dType) {
        case 3:
          this._3dType = 2;
          break;
        case 2.5:
          this._3dType = 3;
          break;
        case 2:
          this._3dType = 2.5;
          break;
      }
      console.log(this._3dType);
    },
    getCollect() {
      const signValue = prompt("请设置收藏名称");
      const viewInfo = this.$refs.cesiumViewerRef.getViewInfo();
      this.$emit("get-collect-clicked", [signValue, viewInfo]);
    },

    handleSearchAndSelected(value) {
      this.showAutocomplete = false;
      this.myCurrView = {
        destination: Cesium.Cartesian3.fromDegrees(
          value.longitude,
          value.latitude,
          10000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(360), // Convert degrees to radians
          pitch: Cesium.Math.toRadians(-90), // Convert degrees to radians
          roll: 0,
        },
      };
      this.currCountry = value.name;
    },
  },
};

import CesiumViewer from "./CesiumViewer.vue";
import TimeLine from "./TimeLine.vue";
import AutocompleteSearch from "./Autocomplete.vue";
import PieChart from "./PieChart.vue";
import TimeSeries from "./TimeSeries.vue";
import ForecastChart from "./ForecastChart.vue";
import * as Cesium from "cesium";
</script>

<style>
#container {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: flex-start;
}

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
  min-height: 100vh;
  position: relative;
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  max-height: 100vh;
}

/* 工具区 */
#toolsArea {
  z-index: 300;
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
  background-image: url("../assets/icon/2.5d.png");
}
#modePicker_2_5d:hover {
  background-image: url("../assets/icon_hover/2.5d.png");
}
#modePicker_2d {
  background-image: url("../assets/icon/2d.png");
}
#modePicker_2d:hover {
  background-image: url("../assets/icon_hover/2d.png");
}

/* 状态栏 */
#stateArea {
  position: relative;
  height: 4%;
  background: #e0e0e0;
  color: #708ab8;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.stateLabel {
  margin-right: 30px;
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
  margin-top: 20px;
  margin-left: 5%;
  /* margin-bottom: 20px; */
  padding: 3px 10px 3px 10px;
  height: 20px;
  font-size: 19px;
  font-weight: 500;
  border-radius: 5px;
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

#pitGraphArea,
#lineGraphArea,
#lineGraphArea2 {
  margin-top: 30px;
  margin-bottom: 60px;
}

.graphArea {
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 5%;
  width: 90%;
  aspect-ratio: 16/9;
  background-color: #f6f6f6;
  border-radius: 15px;
}
</style>
