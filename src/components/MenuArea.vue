<template>
  <div id="menuArea">
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="pickData">
        <div :class="infoRectangle">
          <h2>选择数据</h2>
          <div id="dataHelp" :class="['iconButtons']" @click="toggleNote"></div>
          <div id="note" v-show="showNote">
            <div id="noteContent">
              <p style="font-weight: bold">数据说明</p>
              <p>· GWP(Global Warming Potential)：温室气体等效二氧化碳质量</p>
              <p>· GWP可用于衡量温室气体对全球变暖的影响/p></p>
              <p>· 本项目中所涉数据若无特殊申明单位均为(GWP)吨</p>
              <p>· 碳排放数据源：World Bank</p>
              <p>· 清洁能源数据源：Global Energy Monitor</p>
            </div>
          </div>
          <!-- <div id="helpContent">帮助提示内容</div> -->
          <div
            id="totalCarbon"
            :class="dataType1"
            @click="$emit('data-clicked', 'total')"
          >
            总碳排放
          </div>
          <div
            id="buildings"
            :class="dataType2"
            @click="$emit('data-clicked', 'buildings')"
          >
            建筑排放
          </div>
          <div
            id="industry"
            :class="dataType2"
            @click="$emit('data-clicked', 'industry')"
          >
            工业排放
          </div>
          <div
            id="transport"
            :class="dataType2"
            @click="$emit('data-clicked', 'transport')"
          >
            交通排放
          </div>
          <div
            id="energySystem"
            :class="dataType2"
            @click="$emit('data-clicked', 'energy')"
          >
            能源系统排放
          </div>
          <div
            id="AFOLU"
            :class="dataType2"
            @click="$emit('data-clicked', 'AFOLU')"
          >
            其他土地利用排放
          </div>
          <div
            id="totalCarbon2"
            :class="dataType1"
            @click="$emit('data-clicked', 'total_per')"
          >
            人均碳排放
          </div>
          <div
            id="buildings2"
            :class="dataType2"
            @click="$emit('data-clicked', 'buildings_per')"
          >
            建筑排放
          </div>
          <div
            id="industry2"
            :class="dataType2"
            @click="$emit('data-clicked', 'industry_per')"
          >
            工业排放
          </div>
          <div
            id="transport2"
            :class="dataType2"
            @click="$emit('data-clicked', 'transport_per')"
          >
            交通排放
          </div>
          <div
            id="energySystem2"
            :class="dataType2"
            @click="$emit('data-clicked', 'energy_per')"
          >
            能源系统排放
          </div>
          <div
            id="AFOLU2"
            :class="dataType2"
            @click="$emit('data-clicked', 'AFOLU_per')"
          >
            其他土地利用排放
          </div>
        </div>
      </div>
    </div>
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="pickStyle">
        <div :class="infoRectangle">
          <h2>选择样式</h2>
          <div id="classifyMethodArea">
            <div :class="selectStyleHeading">分类方法</div>
            <select id="classifyMethod" @change="changeClassifyMethod">
              <option>自然间断法</option>
              <option>等间距法</option>
              <option>分位数法</option>
            </select>
            <select id="classifyNumber" @change="changeClassifyN">
              <option>3类</option>
              <option>4类</option>
              <option>5类</option>
            </select>
          </div>
          <div id="setRibbonArea">
            <div :class="selectStyleHeading">色带设置</div>
            <div id="ribbon" ref="ribbonRef"></div>
            <input
              type="color"
              id="startColor"
              v-model="startColor"
              @change="changeStartColor"
            />
            <input
              type="color"
              id="endColor"
              v-model="endColor"
              @change="changeEndColor"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="iconContainer">
      <div :class="['mainButtons', 'iconButtons']" id="starred">
        <div :class="infoRectangle">
          <h2>已收藏</h2>
          <div id="starContainer">
            <div
              v-for="(item, index) in collections"
              :key="index"
              class="starContent"
              @click="handleCollectionClick(item)"
              @contextmenu.prevent="showContextMenu(item, index, $event)"
            >
              <div class="starredLable">{{ item.name }}</div>
              <CloseSquareOutlined
                class="deleteStarred"
                @click="deleteItem(index)"
              ></CloseSquareOutlined>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CloseSquareOutlined } from "@ant-design/icons-vue";

export default {
  props: {
    signValue: {
      default: {
        name: "收藏",
        view: {
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
  },
  components: {
    CloseSquareOutlined,
  },
  data() {
    return {
      showNote: false,
      iconContainer: "iconContainer",
      infoRectangle: "infoRectangle",
      intervals: "intervals",
      selectStyleHeading: "selectStyleHeading",
      dataType1: "dataType1",
      dataType2: "dataType2",
      styleMethod: "nature",
      // classifyN: 3,
      classifyN: "3类",
      startColor: "#FFFF00",
      endColor: "#FF0000",

      collections: [],
      newCollectionName: "",
      contextMenuVisible: false,
      contextMenuIndex: null,
      showNote: false,
    };
  },
  methods: {
    toggleNote() {
      this.showNote = !this.showNote;
    },
    changeClassifyMethod(event) {
      const selcectValue = event.target.value;
      switch (selcectValue) {
        case "自然间断法":
          this.styleMethod = "nature";
          break;
        case "等间距法":
          this.styleMethod = "equalSpace";
          break;
        case "分位数法":
          this.styleMethod = "quartiles";
          break;
        default:
          console.log("unknown method");
          break;
      }
      this.$emit("select-method-changed", this.styleMethod);
    },
    // changeClassifyN(event) {
    //   const selcectValue = event.target.value;
    //   this.$emit("select-classifyN-changed", selcectValue);
    // },
    changeClassifyN(event) {
      this.classifyN = event.target.value;
      this.$emit("select-classifyN-changed", this.classifyN);
    },
    changeStartColor() {
      this.$emit("change-start-color", this.startColor);
      this.$refs.ribbonRef.style.background = `linear-gradient(to right, ${this.startColor}, ${this.endColor})`;
    },
    changeEndColor() {
      this.$emit("change-end-color", this.endColor);
      this.$refs.ribbonRef.style.background = `linear-gradient(to right, ${this.startColor}, ${this.endColor})`;
    },
    handleCollectionClick(item) {
      //const collectClassifyMethod=item.starClassifyM;
      this.styleMethod = item.starClassifyM;
      this.classifyN = item.starClassifyN;
      this.startColor = item.starStartC;
      this.endColor = item.starEndC;
      this.$emit("data-clicked", item.data);
      this.$emit("select-method-changed", this.styleMethod);
      this.$emit("select-classifyN-changed", this.classifyN);
      this.$emit("change-start-color", this.startColor);
      this.$emit("change-end-color", this.endColor);
      this.$emit("change-view", item.view);
      this.$refs.ribbonRef.style.background = `linear-gradient(to right, ${this.startColor}, ${this.endColor})`;
      console.log("pick collect succeed");
    },
    //这里时设置了一个函数可以删除收藏内容
    deleteItem(index) {
      this.collections.splice(index, 1);
    },
    toggleNote() {
      this.showNote = !this.showNote;
    },
  },
  watch: {
    signValue(newValue) {
      let myName = "收藏";
      if (newValue.name) {
        myName = newValue.name;
      }
      const starClassifyMethod = this.styleMethod;
      const starClassifyNumber = this.classifyN;
      const starStartColor = this.startColor;
      const starEndColor = this.endColor;
      this.collections.push({
        name: myName,
        starClassifyM: starClassifyMethod,
        starClassifyN: starClassifyNumber,
        starStartC: starStartColor,
        starEndC: starEndColor,
        view: newValue.view,
        data: newValue.data,
      });
    },
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

  padding-bottom: 20px;
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
  overflow-y: auto;
}
.infoRectangle > * {
  min-width: 250px;
  cursor: default;
}
.infoRectangle > h2 {
  margin-top: 22px;
  margin-left: 20px;
  color: #3478f5;
}
.infoRectangle > h3 {
  margin-left: 30px;
  font-weight: 500;
}

.dataType1 {
  margin-top: 20px;
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
  font-weight: 500;
  font-size: 15px;
  line-height: 30px;
  height: 30px;
  color: #474747;
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
#classifyNumber {
  display: block;
  left: 100px;
  margin: 10px;
  margin-left: 10%;
  padding: 2px;
  padding-left: 10%;
  padding-right: 10%;
  font-size: 17px;
  width: 80%;

  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

#classifyMethod:focus,
#classifyNumber:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 4px #66afe999;
}

#ribbon {
  height: 22px;
  border: 1px solid #bababa;
  width: 98%;
  border-radius: 5px;
  background: linear-gradient(to right, #ffff00, #ff0000);
}

#startColor,
#endColor {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid #f6f6f7;
}
#endColor {
  float: right;
}

#helpContent {
  background-color: #3478f5;
  display: block;
  min-width: auto;
  margin-left: 10%;
  width: 80%;
  height: 100px;
  /* border: ; */
  font-size: 10px;
  box-shadow: 1px 2px 5px #00e5ff;
}
#dataHelp:hover #helpContent {
  display: block;
}

.starContent {
  margin-top: 10px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 500;
  font-size: 15px;
  height: 30px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* item.name 居左，CloseSquareOutlined 居右 */
}
.starContent:hover {
  background-color: #dbdff4;
}

.starredLable {
  padding: 5px 10px 5px 10px;
  background-color: #e6eefd;
  border-radius: 5px;
  width: fit-content;
  color: #3579f6;
}

.starContent .deleteStarred {
  font-size: 20px;
}

#note {
  background-color: transparent;
  padding: 0;
}

#noteContent {
  margin: 10px;
  margin-left: 30px;
  padding: 10px;
  padding-top: 15px;
  font-size: 15px;
  width: 200px;
  /* height: 200px; */
  box-shadow: 1px 3px 7px lightblue;
  background-color: #f1f1f1;
  color: #555555;
  border-radius: 5px;
}
</style>
