<template>
  <div class="image-cropper">
    <div class="img-container">
      <img width="600" height="300">
      <Select-Box v-ref:box></Select-Box>
    </div>
    <div class="img-preview">
      <img>
    </div>
    <div>
      <canvas class="clip-canvas"></canvas>
    </div>
    <div class="img-action">
      <input type="file" id="file_input" accept="image/*" title="请选择封面图"/>
      <div class="slider-wrap">
        <Slide></Slide>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBox from './SelectBox.vue';
  import Slide from './Slide.vue';

  export default {
    components: {
      SelectBox,
      Slide
    },
    data() {
      return {
        cur: 0,
        $clipCanvas: null,
        $imgs: null,
        $input: null
      }
    },
    events: {
      selectChange() {
        const rec = this.$refs.box.rec;
        if (rec.w > 0 && rec.h > 0) {
          this.clip();
        }
      }
    },
    ready() {
      const me = this;
      this.$input = this.$el.querySelectorAll('#file_input')[0];
      this.$imgs = this.$el.querySelectorAll('img');
      this.$clipCanvas = this.$el.querySelectorAll('.clip-canvas')[0];

      this.$input.addEventListener('change', function () {
        const fd = new FileReader;

        fd.onloadend = function () {
          me.$imgs[0].src = fd.result;
          me.$imgs[1].src = fd.result;
        };
        if (this.files) {
          fd.readAsDataURL(this.files[0]);
        }
      })
    },
    methods: {
      clip() {
        const rec = this.$refs.box.rec;
        const ctx = this.$clipCanvas.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        this.$clipCanvas.width = rec.w;
        this.$clipCanvas.height = rec.h;

        tempCanvas.width = 600;
        tempCanvas.height = 300;
        tempCtx.drawImage(this.$imgs[0], 0, 0, 600, 300);
        const imgData = tempCtx.getImageData(rec.l, rec.t, rec.w, rec.h);
        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = rec.w;
        bufferCanvas.height = rec.h;
        const bfx = bufferCanvas.getContext('2d');
        bfx.putImageData(imgData, 0, 0);
        const dImg = new Image();
        const url = bufferCanvas.toDataURL('image/png');
        dImg.src = url;
        this.$imgs[1].src = url;
        dImg.onload = function () {
          ctx.clearRect(0, 0, rec.w, rec.h);
          ctx.drawImage(dImg, 0, 0, rec.w, rec.h);
        };
      }
    }
  }
</script>

<style scoped>
  .slider-wrap {
    margin-top: 20px;
    width: 300px;
  }
  .img-container {
    position: relative;
    width: 600px;
    height: 300px;
    background-color: #9da0a4;
    float: left;
  }
  .img-preview {
    width: 200px;
    height: 100px;
    background-color: #9da0a4;
    margin-left: 20px;
    float: left;
    overflow: hidden;
  }
  .img-preview img {
    width: 100%;
    height: 100%;
  }
  .img-action {
    clear: left;
  }
  .clip-canvas {
    margin-left: 20px;
  }
</style>