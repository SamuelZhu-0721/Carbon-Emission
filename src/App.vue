<template>
  <cesium-viewer></cesium-viewer>
</template>

<script setup>
import CesiumViewer from './components/CesiumViewer.vue'; 
</script>

<style scoped> 
  #cesiumContainer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>