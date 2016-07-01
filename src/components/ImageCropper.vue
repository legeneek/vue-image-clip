<template>
  <div class="image-cropper">
    <div class="img-container">
      <canvas class="ori-canvas"></canvas>
      <Select-Rec></Select-Rec>
    </div>
    <div class="img-preview">
    </div>
    <div class="slider-wrap">
      <Slide></Slide>
    </div>
  </div>
</template>

<script>
  import SelectRec from './SelectBox.vue';
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
  .slider-wrap {
    width: 300px;
  }
  .img-container {
    position: relative;
    width: 600px;
    height: 300px;
    background-color: #9da0a4;
  }
  .ori-canvas {
    width: 100%;
    height: 100%;
  }
</style>