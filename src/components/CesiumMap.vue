<script setup>
import { onMounted } from 'vue';

import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Ion Token
import { token } from '../cesiumMapToken.json'

import { getFlagForKey, flags } from './uav_controller/keypress';

// emit
const emit = defineEmits(['updateCamera']);

let viewer = undefined;

// 按下按键
const keydown = (e) => {
  if (viewer == undefined) return;

  let motion = getFlagForKey(e.key);

  if (motion == undefined) return;
  flags[motion] = true;
}

// 抬起按键
const keyup = (e) => {
  if (viewer == undefined) return;

  let motion = getFlagForKey(e.key);

  if (motion == undefined) return;
  flags[motion] = false;
}

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

onMounted(async () => {
  let west = 92.0;
  let south = 20.0;
  let east = 130.0;
  let north = 53.0;

  let rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);

  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rectangle;

  // The URL on your server where CesiumJS's static files are hosted.
  window.CESIUM_BASE_URL = '/cesium';
  Cesium.Ion.defaultAccessToken = token;
  const terrainProvider = await Cesium.createWorldTerrainAsync();
  // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
  viewer = new Cesium.Viewer('cesiummap', {
    terrainProvider,
    infoBox: false,
    timeline: false, // 时间滚动条控件
    animation: false, // 控制场景动画的播放速度控件
  });

  // 去掉版权信息（喂）
  viewer._cesiumWidget._creditContainer.style.display = "none";

  const scene = viewer.scene;
  // disable the default event handlers
  scene.screenSpaceCameraController.enableRotate = false;
  scene.screenSpaceCameraController.enableTranslate = false;
  scene.screenSpaceCameraController.enableZoom = false;
  scene.screenSpaceCameraController.enableTilt = false;
  scene.screenSpaceCameraController.enableLook = false;

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(106.82828, 29.71735, 400),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-15.0),
    }
  });

  viewer.clock.onTick.addEventListener(async clock => {
    const camera = viewer.camera;
    // 相对地面高度
    const cameraHeight = camera.positionCartographic.height;

    const positions = [{
      longitude: camera.positionCartographic.longitude,
      latitude: camera.positionCartographic.latitude,
    }];

    // 计算此地的对地高度和海拔高度，由于sampleTerrainMostDetailed是一个promise，所以放到主循环种会造成卡顿
    Cesium.sampleTerrainMostDetailed(terrainProvider, positions).then(updatedPositions => {
      // 传出位置信息
      emit('updateCamera', {
        long: Cesium.Math.toDegrees(camera.positionCartographic.longitude).toFixed(8),
        lati: Cesium.Math.toDegrees(camera.positionCartographic.latitude).toFixed(8),
        height: (cameraHeight - updatedPositions[0].height).toFixed(8),
        alt: updatedPositions[0].height.toFixed(8),
      });
    });

    const moveRate = cameraHeight / 100.0;

    if (flags.forward) {
      camera.moveForward(moveRate);
    }
    if (flags.backward) {
      camera.moveBackward(moveRate);
    }
    if (flags.up) {
      camera.moveUp(moveRate);
    }
    if (flags.down) {
      camera.moveDown(moveRate);
    }
    if (flags.left) {
      camera.moveLeft(moveRate);
    }
    if (flags.right) {
      camera.moveRight(moveRate);
    }
    if (flags.cameraLeft) {
      camera.setView({
        orientation: {
          heading: camera.heading - 0.01,
          pitch: camera.pitch,
          roll: camera.roll,
        }
      });
    }
    if (flags.cameraRight) {
      camera.setView({
        orientation: {
          heading: camera.heading + 0.01,
          pitch: camera.pitch,
          roll: camera.roll,
        }
      })
    }
    if (flags.cameraUp) {
      camera.setView({
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch + 0.005,
          roll: camera.roll,
        }
      })
    }
    if (flags.cameraDown) {
      camera.setView({
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch - 0.005,
          roll: camera.roll,
        }
      })
    }
    if (flags.cameraTwistLeft) {
      camera.twistLeft(0.005);
    }
    if (flags.cameraTwistRight) {
      camera.twistRight(0.005);
    }
  });
});
</script>

<template>
  <div id="cesiummap"></div>
</template>

<style scoped>
#cesiummap {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>