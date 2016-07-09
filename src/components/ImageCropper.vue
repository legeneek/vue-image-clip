<template>
  <div class="image-cropper">
    <div class="wrap">
      <div class="img-container" @mousedown="prepareMove">
        <img id="clip_src_img" @load="clearSelect">
        <Select-Box v-ref:box></Select-Box>
      </div>
      <div class="img-preview">
        <img id="clip_res_img">
      </div>
    </div>
    <div class="img-action">
      <span class="change-img action-btn">
        <input type="file" id="file_input" accept="image/*"/>选择图片
      </span>
      <span class="action-btn" @click="clearSelect">重置</span>
    </div>
    <div class="slider-wrap">
      <Slide min="-100" max="100" :cur.sync="sliderValue" step="5"></Slide>
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
        $clipCanvas: null,
        $srcImg: null,
        $resImg: null,
        $input: null,
        $imgContainer: null,
        imgOption: {
          scale: 1,
          left: 0,
          top: 0
        },
        sliderValue: 0,
        prePoint: {
          x: 0,
          y: 0
        },
        initPoint: {
          x: 0,
          y: 0
        },
        clipData: null,
        loaded: false
      }
    },
    events: {
      selectChange() {
        const rec = this.$refs.box.rec;
        if (rec.w > 0 && rec.h > 0 && this.loaded) {
          this.clip();
        }
      },
      sliderChange(v) {
        this.resize((+v + 100) / 100);
      }
    },
    watch: {
      imgOption: {
        handler() {
          this.clip();
        },
        deep: true
      }
    },
    ready() {
      const me = this;
      this.$input = this.$el.querySelectorAll('#file_input')[0];
      this.$srcImg = this.$el.querySelectorAll('#clip_src_img')[0];
      this.$resImg = this.$el.querySelectorAll('#clip_res_img')[0];
      this.$clipCanvas = this.$el.querySelectorAll('.clip-canvas')[0];
      this.$imgContainer = this.$el.querySelectorAll('.img-container')[0];

      this.$input.addEventListener('change', function () {
        const fd = new FileReader;
        fd.onloadend = function () {
          me.loaded = true;
          me.$srcImg.src = fd.result;
        };
        if (this.files && this.files[0]) {
          fd.readAsDataURL(this.files[0]);
        }
      });

      window.addEventListener('mousemove', this.moveImg);
      window.addEventListener('mouseup', this.disableMove);
    },
    beforeDestroy() {
      window.removeEventListener('mousemove', this.moveImg);
      window.removeEventListener('mouseup', this.disableMove);
    },
    methods: {
      clearSelect() {
        const box = this.$refs.box;
        const cw = this.$imgContainer.offsetWidth;
        const ch = this.$imgContainer.offsetHeight;
        if (box) {
          box.clearRec();
        }
        this.sliderValue = 0;
        this.clipData = null;
        this.imgOption = { scale: 1, left: 0, top: 0 };
        this.$srcImg.setAttribute('style',
            `width:${cw}px;height:${ch}px;left:0px;top:0px;`);
        this.$resImg.src = '';
      },
      prepareMove(e) {
        this.prePoint.x = e.pageX;
        this.prePoint.y = e.pageY;
        this.initPoint.x = e.pageX;
        this.initPoint.y = e.pageY;
        this.action = 'move';
      },
      moveImg(e) {
        if (this.action !== 'move') {
          return;
        }
        this.move(e.pageX, e.pageY);
      },
      move(x, y) {
        const dx = x - this.prePoint.x;
        const dy = y - this.prePoint.y;
        const l = (parseInt(this.$srcImg.style.left, 10) || 0) + dx;
        const t = (parseInt(this.$srcImg.style.top, 10) || 0) + dy;
        this.$srcImg.style.left = `${l}px`;
        this.$srcImg.style.top = `${t}px`;
        this.prePoint.x = x;
        this.prePoint.y = y;
        this.imgOption.left = x - this.initPoint.x;
        this.imgOption.top = y - this.initPoint.y;
      },
      disableMove() {
        this.action = '';
      },
      resize(v) {
        const cw = this.$imgContainer.offsetWidth;
        const ch = this.$imgContainer.offsetHeight;
        const w = cw * v;
        const h = ch * v;
        const l = (cw - w) / 2 + this.imgOption.left;
        const t = (ch - h) / 2 + this.imgOption.top;
        this.imgOption.scale = v;
        this.$srcImg.setAttribute('style',
            `width:${w}px;height:${h}px;left:${l}px;top:${t}px;`);
      },
      clip() {
        const rec = this.$refs.box.rec;
        if (!rec.w || !rec.h || !this.loaded) {
          return;
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const cw = this.$imgContainer.offsetWidth;
        const ch = this.$imgContainer.offsetHeight;
        const bufferCanvas = document.createElement('canvas');
        const bfx = bufferCanvas.getContext('2d');
        tempCanvas.width = cw;
        tempCanvas.height = ch;
        tempCtx.drawImage(this.$srcImg,
            parseInt(this.$srcImg.style.left, 10) || 0,
            parseInt(this.$srcImg.style.top, 10) || 0,
            cw * this.imgOption.scale, ch * this.imgOption.scale);
        bufferCanvas.width = rec.w;
        bufferCanvas.height = rec.h;
        bfx.putImageData(tempCtx.getImageData(rec.l, rec.t, rec.w, rec.h), 0, 0);
        const url = bufferCanvas.toDataURL('image/png');
        this.clipData = url;
        this.$resImg.src = url;
      }
    }
  }
</script>

<style scoped>
  .slider-wrap {
    margin-top: 20px;
    width: 300px;
  }
  .wrap {
    overflow: hidden;
    zoom: 1;
  }
  .img-container {
    position: relative;
    width: 600px;
    height: 300px;
    overflow: hidden;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
    float: left;
  }
  .img-container img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .img-preview {
    width: 200px;
    height: 100px;
    background-color: #f7f7f7;
    margin-left: 20px;
    float: left;
    overflow: hidden;
  }
  .img-preview img {
    width: 100%;
    height: 100%;
  }
  .img-action {
    margin-top: 10px;
  }
  .change-img {
    position: relative;
    overflow: hidden;
    margin-right: 100px;
  }
  .change-img input {
    position: absolute;
    opacity: 0;
    font-size: 100px;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .action-btn {
    font-size: 14px;
    display: inline-block;
    padding: 4px 8px;
    border: 1px solid #9da0a4;
    cursor: pointer;
    vertical-align: top;
  }
</style>