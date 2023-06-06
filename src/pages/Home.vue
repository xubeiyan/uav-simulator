<template>
  <div class="container">
    <Interface :position="position"/>
    <CesiumMap @updateCamera="updateCamera" />
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import CesiumMap from '../components/CesiumMap.vue';
import Interface from '../components/Interface.vue';

const position = reactive({
  long: null,
  lati: null,
  height: null,
})

// 更新摄像机
const updateCamera = ({ long, lati, height }) => {
  position.long = long;
  position.lati = lati;
  position.height = height;
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>