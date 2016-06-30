<template>
  <div class="image-cropper">
    <div class="ori-canvas-wrap">
      <canvas class="ori-canvas"></canvas>
      <Select-Rec></Select-Rec>
      <input type="file" accept="image/*" title="请选择封面图"/>
      <div class="slide-wrap">
        <Slide min="-100" max="100" :cur.sync="cur"></Slide>
      </div>
    </div>
    <div class="rst-canvas-wrap">
      <canvas class="rst-canvas"></canvas>
    </div>
  </div>
</template>

<script>
  import SelectRec from './SelectRec.vue';
  import Slide from './Slide.vue';

  export default {
    components: {
      SelectRec,
      Slide
    },
    data() {
      return {
        cur: 0
      }
    }
  }
</script>

<style scoped>
  .slide-wrap {
    width: 300px;
    margin: 0 auto;
  }
</style>