<template>
  <MenuArea
    @data-clicked="handleDataClicked"
    @select-method-changed="handleSelectMethodChanged"
    @select-classifyN-changed="handleSelectClassifyNChanged"
    @change-start-color="handleChangeStartColor"
    @change-end-color="handleChangeEndColor"
  ></MenuArea>
  <ShowArea
    :currData="currData"
    :styleMethod="styleMethod"
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
      styleMethod: "nature",
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
          console.log("unknown classifyN");
          break;
      }
      console.log("APP-classifyN: " + this.classifyN);
    },
    handleChangeStartColor(value) {
      this.startColor = value;
    },
    handleChangeEndColor(value) {
      this.endColor = value;
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
