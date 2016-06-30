<template>
  <div class="image-cropper">
    <Select-Rec></Select-Rec>
    <div class="slide-wrap">
      <Slide :cur.sync="cur"></Slide>
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
        cur: 40
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