<template>
  <div class="legendArea">
    <CloseOutlined id="closeLegend" @click="closeLegend"></CloseOutlined>

    <h4>{{ currData }}</h4>
    <div id="legend">
      <div
        v-for="(item, index) in legendItems"
        :key="index"
        class="classifyLabel"
      >
        <div
          class="classifyColor"
          :style="{ backgroundColor: item.color }"
        ></div>
        <div class="classifyNumber">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { CloseOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    CloseOutlined,
  },
  data() {
    return {
      styleMethodCHN: "自然间断法",
      currData: null,
    };
  },
  props: {
    legendItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    styleMethod: {
      type: String,
      required: true,
      default: "nature",
    },
    addedData: {
      type: String,
      default: null,
    },
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
    addedData(newValue) {
      switch (newValue) {
        case "total":
          this.currData = "总碳排";
          break;
        case "buildings":
          this.currData = "建筑碳排";
          break;
        case "energy":
          this.currData = "能源碳排";
          break;
        case "transport":
          this.currData = "交通碳排";
          break;
        case "AFOLU":
          this.currData = "其他碳排";
          break;
        case "industry":
          this.currData = "工业碳排";
          break;
        case "total_per":
          this.currData = "人均总碳排";
          break;
        case "buildings_per":
          this.currData = "人均建筑碳排";
          break;
        case "energy_per":
          this.currData = "人均能源碳排";
          break;
        case "transport_per":
          this.currData = "人均交通碳排";
          break;
        case "industry_per":
          this.currData = "人均工业碳排";
          break;
        case "AFOLU_per":
          this.currData = "人均其他碳排";
          break;
        default:
          console.log("unknown type");
          this.currData = "错误碳排";
          break;
      }
      console.log(this.currData);
    },
  },
  methods: {
    closeLegend() {
      this.$emit("change-isLegendShow");
    },
  },
};
</script>

<style>
/* 图例 */
.legendArea {
  z-index: 10;
  border-radius: 10px;
  background-color: #e6eefd;
  position: absolute;
  width: 17%;
  max-width: 200px;
  overflow: auto;
  max-height: 250px;
  bottom: 40px;
  right: 10px;
  color: #000000;
  padding: 5px 10px 5px 10px;
}

.legendArea h4 {
  font-size: 16px;
  margin: 4px 0 0 0;
  color: #3478f5;
  /* text-align: center; */
}
.legendArea h5 {
  display: inline-block;
  margin: 0 0 0 5px;
  color: #3478f5;
  /* text-align: center; */
}

#legend {
  width: 100%;
  height: 85%;
  display: flex;
  align-items: center;
  color: #3478f5;
  font-weight: 700;

  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;

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
  min-width: 24px;
  border-radius: 12px;
}

.classifyNumber {
  margin-left: 10px;
  font-weight: 500;
}
#closeLegend {
  font-size: 17px;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
