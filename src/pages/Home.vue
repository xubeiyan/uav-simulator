<template>
  <div class="container">
    <Interface :position="position" @changeDrawerStatus="changeDrawerStatus" @clearDrawPoints="clearDrawPoints"
      @flyTo="flyTo" @downloadDrawPoints="downloadDrawPoints" :points="drawer.points" :drawStatus="drawer.status" :longLatiPos="drawer.longLatiPos" />
    <CesiumMap ref="cesiumMapRef" @updateCamera="updateCamera" :points="drawer.points" :drawStatus="drawer.status" />
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import CesiumMap from '../components/CesiumMap.vue';
import Interface from '../components/Interface.vue';

import axios from 'axios';

const position = reactive({
  long: null,
  lati: null,
  height: null,
});

// 地图
const cesiumMapRef = ref();

// 绘制线的内容
const drawer = reactive({
  status: 'notdrawing',
  points: [],
  longLatiPos: [],
});

// 改变绘制状态
const changeDrawerStatus = (status) => {
  // console.log('change!')
  drawer.status = status;
}

// 清除点
const clearDrawPoints = () => {
  drawer.points = [];
  drawer.longLatiPos = [];
  cesiumMapRef.value.clearAllEntities();
}

// 下载点坐标
const downloadDrawPoints = () => {
  const longLatiPos = cesiumMapRef.value.computeLongLati();
  drawer.longLatiPos = longLatiPos;

  axios.post('http://10.1.123.248:6789/kmz/outPut', {
    coordinateVos: longLatiPos,
  }).then(res => {

  }).catch(e => {
    console.log(e)
  })
}

// 跳至对应点
const flyTo = (name) => {
  const posLists = {
    'bitcq': {
      long: 106.82992253,
      lati: 29.722210836,
      height: 200,
    },
    'dam': {
      long: 82.8472369,
      lati: 43.861348,
      height: 500,
    }
  }

  if (posLists[name] == undefined) return;

  cesiumMapRef.value.flyTo({ long: posLists[name].long, lati: posLists[name].lati, height: posLists[name].height });
}

// 更新摄像机
const updateCamera = ({ long, lati, height, alt }) => {
  position.long = long;
  position.lati = lati;
  position.height = height;
  position.alt = alt;
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
</style>