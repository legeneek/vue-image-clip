<template>
  <div class="bili-modal cropper-modal">
    <div class="overlay"></div>
    <div class="modal">
      <div class="modal-head">
        <div class="head-wrap">建议上传高清封面960*600</div>
        <i class="icon-close">+</i>
      </div>
      <div class="modal-content clearfix">
        <div class="img-clip-wrap">
          <div class="container-bg">
            <div class="img-container">
              <img id="clip_src_img" @load="srcImgLoaded">
              <Select-Box v-ref:box></Select-Box>
            </div>
          </div>
          <div class="reset-img">
            <i class="icon-reset"></i>
            <span>重新选择</span>
            <input type="file" id="file_input" accept="image/*">
          </div>
        </div>
        <div class="img-preview-wrap">
          <div class="pre-container">
            <img id="clip_res_img">
          </div>
          <div class="pre-info">封面最终展示效果如上所示</div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="modal-btn btn-confirm">确认</div>
        <div class="modal-btn btn-cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBox from './SelectBox.vue';

  export default {
    components: {
      SelectBox
    },
    data() {
      return {
        $srcImg: null,
        $resImg: null,
        $input: null,
        $imgContainer: null,
        nw: 0,
        nh: 0,
        prePoint: { x: 0, y: 0 },
        initPoint: { x: 0, y: 0 },
        clipData: null,
        loaded: false,
        radio: 16 / 10
      }
    },
    events: {
      selectChange() {
        const rec = this.$refs.box.rec;
        if (rec.w > 0 && rec.h > 0 && this.loaded) {
          this.clip();
        }
      }
    },
    ready() {
      const me = this;
      this.$input = this.$el.querySelectorAll('#file_input')[0];
      this.$srcImg = this.$el.querySelectorAll('#clip_src_img')[0];
      this.$resImg = this.$el.querySelectorAll('#clip_res_img')[0];
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
    },
    beforeDestroy() {
      this.$input.removeEventListener('change');
    },
    methods: {
      srcImgLoaded() {
        this.nw = this.$srcImg.naturalWidth;
        this.nh = this.$srcImg.naturalHeight;
        this.setImgSize();
      },
      setImgSize() {
        let w = 0;
        let h = 0;
        let mt = 0;
        if (this.nw / this.nh >= 16 / 10) {
          //  宽撑满
          w = 480;
          h = this.nh * 480 / this.nw;
          mt = (300 - h) / 2;
        } else {
          //  高撑满
          h = 300;
          w = this.nw * 300 / this.nh;
        }
        this.$imgContainer.setAttribute('style', `width:${w}px;height:${h}px;top:${mt}px;`);
      },
      clearSelect() {
        const box = this.$refs.box;
        const $img = this.$imgs[0];
        const cw = this.$imgContainer.offsetWidth;
        const ch = this.$imgContainer.offsetHeight;
        if (box) {
          box.clearRec();
        }
        if (!this.loaded) {
          return;
        }
        this.imgOption = { scale: 1, left: 0, top: 0 };
        this.sliderValue = 0;
        this.clipData = null;
        $img.setAttribute('style',
            `width:${cw}px;height:${ch}px;left:0px;top:0px;`);
      },
      clip() {
        const rec = this.$refs.box.rec;
        if (!rec.w || !rec.h || !this.loaded) {
          return;
        }

        const ctx = this.$clipCanvas.getContext('2d');
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const cw = this.$imgContainer.offsetWidth;
        const ch = this.$imgContainer.offsetHeight;
        this.$clipCanvas.width = rec.w;
        this.$clipCanvas.height = rec.h;
        const bufferCanvas = document.createElement('canvas');
        const bfx = bufferCanvas.getContext('2d');
        tempCanvas.width = cw;
        tempCanvas.height = ch;
        tempCtx.drawImage(this.$imgs[0],
            parseInt(this.$imgs[0].style.left, 10) || 0,
            parseInt(this.$imgs[0].style.top, 10) || 0,
            cw * this.imgOption.scale, ch * this.imgOption.scale);
        bufferCanvas.width = rec.w;
        bufferCanvas.height = rec.h;
        bfx.putImageData(tempCtx.getImageData(rec.l, rec.t, rec.w, rec.h), 0, 0);
        const dImg = new Image();
        const url = bufferCanvas.toDataURL('image/png');
        this.clipData = url;
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
  .cropper-modal .modal {
    width: 840px;
    height: 524px;
    background-color: #fff;
  }
  .modal-head {
    position: relative;
    text-align: center;
    padding: 0 16px 0 40px;
  }
  .head-wrap {
    position: relative;
    font-size: 14px;
    color: #222;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e5e9ef;
  }
  .icon-close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: inline-block;
    font-size: 20px;
    color: #99a2aa;
    transform: rotate(40deg);
  }
  .modal-content {
    padding: 30px 40px 40px;
  }
  .img-clip-wrap {
    width: 500px;
    height: 330px;
    border-right: 1px solid #e5e9ef;
    float: left;
  }
  .container-bg {
    width: 480px;
    height: 300px;
    background-color: #000;
    border-radius: 4px;
  }
  .img-container {
    position: relative;
    margin: auto;
    width: 100%;
    height: 100%;
  }
  .img-container img{
    width: 100%;
    height: 100%;
  }
  .reset-img {
    position: relative;
    display: inline-block;
    margin-top: 16px;
    color: #6d757a;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
  }
  .reset-img input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer
  }
  .reset-img:hover {
    color: #00b5e5;
  }
  .img-preview-wrap {
    width: 240px;
    float: right;
  }
  .pre-container {
    width: 240px;
    height: 150px;
    background-color: #000;
    border-radius: 4px;
  }
  .pre-container img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .pre-info {
    margin-top: 20px;
    font-size: 12px;
    color: #99a2aa;
  }
  .clearfix:before,.clearfix:after {
    content: ' ';
    display: table;
  }
  .clearfix:after {
    clear: both;
  }
  .modal-footer {
    text-align: center;
  }
  .modal-btn {
    display: inline-block;
    width: 110px;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-confirm {
    border: 1px solid #00a1d6;
    color: #fff;
    background-color: #00a1d6;
  }
  .btn-confirm:hover {
    background-color: #00b5e5;
  }
  .btn-cancel {
    margin-left: 16px;
    border: 1px solid #ccd0d7;
    color: #6d757a;
    background-color: #fff;
  }
  .btn-cancel:hover {
    color: #00b5e5;
  }
</style>