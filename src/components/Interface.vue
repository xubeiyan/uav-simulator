<script setup>
const props = defineProps(['position', 'drawStatus', 'points', 'longLatiPos']);
const emit = defineEmits(['changeDrawerStatus', 'clearDrawPoints', 'downloadDrawPoints', 'flyTo']);
</script>

<template>
  <div class="interface">
    <div class="guide-text">
      <table>
        <thead>
          <th>
          <td>操作指引</td>
          </th>
        </thead>
        <tbody>
          <tr>
            <td>w/s</td>
            <td>前进/后退</td>
          </tr>
          <tr>
            <td>a/d</td>
            <td>左移/右移</td>
          </tr>
          <tr>
            <td>q/e</td>
            <td>拉高/降低</td>
          </tr>
          <tr>
            <td>i/k</td>
            <td>仰角拉高/降低</td>
          </tr>
          <tr>
            <td>j/l</td>
            <td>向左看/向右看</td>
          </tr>
          <tr>
            <td>u/o</td>
            <td>向左/向右翻滚</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="position-data">
      <table>
        <tbody>
          <tr>
            <td>经度</td>
            <td class="text-r">{{ $props.position.long }}</td>
          </tr>
          <tr>
            <td>纬度</td>
            <td class="text-r">{{ $props.position.lati }}</td>
          </tr>
          <tr>
            <td>对地高度</td>
            <td class="text-r">{{ $props.position.height }}</td>
          </tr>
          <tr>
            <td>地面海拔</td>
            <td class="text-r">{{ $props.position.alt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="navigation">
      <span>跳转至位置</span>
      <button @click="$emit('flyTo', 'bitcq')">北理工重庆创新中心</button>
      <button @click="$emit('flyTo', 'dam')">大坝</button>
    </div>
    <div class="longlatipos" v-if="$props.longLatiPos.length > 0">
      <textarea rows="30" cols="100">{{ JSON.stringify($props.longLatiPos) }}</textarea>
    </div>
    <div class="drawline-controll">
      <button class="drawing-btn" @click="$emit('changeDrawerStatus', 'drawing')"
        v-if="$props.drawStatus == 'notdrawing'">开始画线</button>
      <button class="drawing-btn" @click="$emit('changeDrawerStatus', 'notdrawing')"
        v-if="$props.drawStatus == 'drawing'">停止画线</button>
      <button class="drawing-btn" @click="$emit('clearDrawPoints')"
        v-if="$props.drawStatus == 'notdrawing' && $props.points.length > 0">清除</button>
      <button class="drawing-btn" @click="$emit('downloadDrawPoints')"
        v-if="$props.drawStatus == 'notdrawing' && $props.points.length > 0">下载线</button>
    </div>
  </div>
</template>

<style scoped>
.interface {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.guide-text,
.position-data,
.navigation {
  max-width: 15em;
  background: rgba(255, 255, 255, 0.5);
  margin: 1em;
  padding: .5em 1em;
  border-radius: .5em;
}

.longlatipos {
  background: rgba(255, 255, 255, 0.5);
  margin: 1em;
  padding: .5em 1em;
  border-radius: .5em;
  position: absolute;
  right: 0;
  bottom: 0;
}

.navigation,
.longlatipos {
  pointer-events: all;
}

.drawline-controll {
  position: absolute;
  bottom: 1em;
  left: 1em;
  pointer-events: all;
  display: flex;
  gap: .5em;
}

.drawing-btn {
  padding: .5em 2em;
  border-radius: .5em;
  border: 1px solid transparent;
  cursor: pointer;
}

.drawing-btn:hover {
  background: lightcyan;
  border: 1px solid greenyellow;
}

.position-data td.text-r {
  text-align: right;
}
</style>