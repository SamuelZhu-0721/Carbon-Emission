<template>
  <MenuArea></MenuArea>
  <ShowArea></ShowArea>
</template>

<script setup>
import MenuArea from "./components/MenuArea.vue";
import ShowArea from "./components/ShowArea.vue";
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
