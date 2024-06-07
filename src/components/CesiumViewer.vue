<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { onMounted } from 'vue';

onMounted(() => {
  const viewer = new Cesium.Viewer('cesiumContainer')
})
</script>

