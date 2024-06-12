<template>
  <div class="legendArea">
    <h4>分类方法:{{ styleMethodCHN }}</h4>
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
export default {
  data() {
    return {
      styleMethodCHN: "自然间断法",
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
      console.log(this.styleMethodCHN);
    },
  },
};
</script>

<style>
/* 图例 */
.legendArea {
  z-index: 10;
  border-radius: 10px;
  background-color: #dee6ff;
  position: absolute;
  width: 17%;
  /* height: 250px; */
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
</style>
