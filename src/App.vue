<template>
  <MenuArea @data-clicked="handleDataClicked"></MenuArea>
  <ShowArea></ShowArea>
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
    };
  },
  method: {
    handleDataClicked(dataType) {
      this.currData = dataType;
      console.log(this.currData);
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
