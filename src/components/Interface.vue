<script setup>
const props = defineProps(['position']);
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
.position-data {
  max-width: 15em;
  background: rgba(255, 255, 255, 0.5);
  margin: 1em;
  padding: .5em 1em;
  border-radius: .5em;
}

.position-data td.text-r {
  text-align: right;
}
</style>