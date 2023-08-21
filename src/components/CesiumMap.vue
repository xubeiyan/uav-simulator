<script setup>
import { onMounted } from 'vue';

import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Ion Token
import { token } from '../cesiumMapToken.json'

import { getFlagForKey, flags } from './uav_controller/keypress';

// emit
const emit = defineEmits(['updateCamera']);
// props
const props = defineProps(['points', 'drawStatus']);

// 点对象
let pointData = undefined;
let lineEntity = undefined;

// 清空所有entity
const clearAllEntities = () => {
  if (viewer == undefined) return;
  if (pointData == undefined) return;
  pointData.entities.removeAll();
  if (lineEntity == undefined) return;
  lineEntity.polyline.positions = [];
}

// 计算点的经纬度
const computeLongLati = () => {
  if (viewer == undefined) return;

  let longlatiPos = props.points.map(point => {
    let cart = Cesium.Cartographic.fromCartesian(point);

    return {
      longitude: Cesium.Math.toDegrees(cart.longitude),
      latitude: Cesium.Math.toDegrees(cart.latitude),
      height: 5,
    }
  })

  return longlatiPos;
}

// 跳至指定地点
const flyTo = ({ long, lati, height }) => {
  if (viewer == undefined) return;
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(long, lati, height),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
    }
  });
}

// 暴露在外的方法
defineExpose({ clearAllEntities, computeLongLati, flyTo });

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
    // terrainProvider,
    infoBox: false,
    timeline: false, // 时间滚动条控件
    animation: false, // 控制场景动画的播放速度控件
  });

  // 去掉版权信息（喂）
  viewer._cesiumWidget._creditContainer.style.display = "none";

  pointData = new Cesium.CustomDataSource('points');
  viewer.dataSources.add(pointData);

  const scene = viewer.scene;
  // disable the default event handlers
  // scene.screenSpaceCameraController.enableRotate = false;
  // scene.screenSpaceCameraController.enableTranslate = false;
  // scene.screenSpaceCameraController.enableZoom = false;
  // scene.screenSpaceCameraController.enableTilt = false;
  // scene.screenSpaceCameraController.enableLook = false;

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(82.8472369, 43.861348, 1000),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
    }
  });

  const damLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: 1830821 })
  );

  const bitcq = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: 1835084 })
  );


  // 航迹线
  lineEntity = viewer.entities.add({
    polyline: {
      positions: props.points,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 1
      }),
      width: 5,
      show: true
    }
  });

  //create the screen space event handler
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  const pickPoint = (click) => {
    // 不是drawing状态则结束
    if (props.drawStatus !== 'drawing') return;
    const ray = viewer.camera.getPickRay(click.position);
    let cartesian = viewer.scene.globe.pick(ray, viewer.scene);

    if (cartesian == undefined) {
      return;
    }

    // 画点
    pointData.entities.add({
      description: 'Preview Point For Path Creation',
      position: cartesian,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.NONE,
      }
    });

    // 画航线
    props.points.push(cartesian);
    lineEntity.polyline.positions = props.points;
  }

  //set the input action to pick point on the earth\point cloud on left click
  handler.setInputAction(pickPoint, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 按键
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