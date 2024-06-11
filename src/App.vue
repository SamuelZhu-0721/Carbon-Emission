<template>
  <MenuArea
    @data-clicked="handleDataClicked"
    @select-method-changed="handleSelectMethodChanged"
    @select-stretchingN-changed="handleSelectStretchingNChanged"
    @select-classifyN-changed="handleSelectClassifyNChanged"
    @change-start-color="handleChangeStartColor"
    @change-end-color="handleChangeEndColor"
  ></MenuArea>
  <ShowArea
    :currData="currData"
    :styleMethod="styleMethod"
    :stretchingN="stretchingN"
    :classifyN="classifyN"
    :startColor="startColor"
    :endColor="endColor"
  ></ShowArea>
</template>

<script setup>
import MenuArea from "./components/MenuArea.vue";
import ShowArea from "./components/ShowArea.vue";
</script>

<script>
export default {
  data() {
    return {
      year: 1970,
      currData: null,
      styleMethod: "stretching",
      stretchingN: 2,
      classifyN: 3,
      startColor: "#FFFF00",
      endColor: "FF0000",
    };
  },
  methods: {
    handleDataClicked(dataType) {
      this.currData = dataType;
      console.log("APP: " + this.currData);
    },
    handleSelectMethodChanged(value) {
      this.styleMethod = value;
      console.log("curr method: " + this.styleMethod);
    },
    handleSelectStretchingNChanged(value) {
      switch (value) {
        case "线性":
          this.stretchingN = 1;
          break;
        case "平方根":
          this.stretchingN = 2;
          break;
        case "立方根":
          this.stretchingN = 3;
          break;
        case "六次根":
          this.stretchingN = 4;
          break;
        default:
          console.log("unknown stretchingN");
          break;
      }
      console.log("curr stretchingN: " + this.stretchingN);
    },
    handleSelectClassifyNChanged(value) {
      switch (value) {
        case "3类":
          this.classifyN = 3;
          break;
        case "4类":
          this.classifyN = 4;
          break;
        case "5类":
          this.classifyN = 5;
          break;
        default:
          console.log("unknown stretchingN");
          break;
      }
      console.log("APP-classifyN: " + this.classifyN);
    },
    handleChangeStartColor(value) {
      this.startColor = value;
      // console.log("APP-startColor: " + this.startColor);
    },
    handleChangeEndColor(value) {
      this.endColor = value;
      // console.log("APP-endColor: " + this.endColor);
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.iconButtons {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
