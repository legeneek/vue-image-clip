<template>
  <div class="cropper-modal">
    <div class="overlay"></div>
    <div class="modal">
      <div class="modal-head">
        <div class="head-wrap">title</div>
      </div>
      <div class="modal-content clearfix">
        <div class="img-clip-wrap">
          <div class="container-bg">
            <div class="img-container">
              <img id="clip_src_img" @load="srcImgLoaded" :src="img">
              <div class="shadow-box"></div>
              <Select-Box ref="box" :srcSize="imgSize" :ratio="ratio" :img="img" @selectEnd="selectEnd"
                          @selectChange="selectChange"></Select-Box>
            </div>
          </div>
          <div class="reset-img">
            <i class="icon-reset"></i>
            <span>select image</span>
            <input type="file" id="file_input" accept="image/png,image/jpg,image/gif" @change="fileChange">
          </div>
        </div>
        <div class="img-preview-wrap">
          <div class="pre-container">
            <img id="clip_res_img" :src="img">
          </div>
          <div class="pre-info">preview</div>
        </div>
      </div>
      <div class="modal-footer">
        <a class="modal-btn btn-confirm" :href="clipData" download="crop.jpg">clip</a>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectBox from './SelectBox.vue'

  export default {
    components: {
      SelectBox
    },
    data () {
      return {
        img: null,
        $srcImg: null,
        $resImg: null,
        $input: null,
        $imgContainer: null,
        $preContainer: null,
        nw: 0,
        nh: 0,
        clipData: null,
        ratio: 16 / 10, // equal to SelectBox's width / height
        imgSize: {w: 0, h: 0},
        containerTop: 0
      }
    },
    mounted () {
      this.$input = this.$el.querySelectorAll('#file_input')[0]
      this.$srcImg = this.$el.querySelectorAll('#clip_src_img')[0]
      this.$resImg = this.$el.querySelectorAll('#clip_res_img')[0]
      this.$imgContainer = this.$el.querySelectorAll('.img-container')[0]
      this.$preContainer = this.$el.querySelectorAll('.pre-container')[0]
      this.$containerBox = this.$el.querySelectorAll('.container-bg')[0]
    },
    methods: {
      selectChange () {
        const rec = this.$refs.box.rec
        if (rec.w > 0 && rec.h > 0) {
          this.updatePreview()
        }
      },
      selectEnd () {
        const rec = this.$refs.box.rec
        if (rec.w > 0 && rec.h > 0) {
          this.clip()
        }
      },
      fileChange () {
        const me = this
        const fd = new FileReader()
        fd.onloadend = function () {
          me.img = fd.result
        };
        if (this.$input.files && this.$input.files[0]) {
          fd.readAsDataURL(this.$input.files[0])
        }
      },
      srcImgLoaded () {
        this.nw = this.$srcImg.naturalWidth
        this.nh = this.$srcImg.naturalHeight
        this.clearSelect()
        this.setImgSize()
        this.updatePreview()
        this.clip()
      },
      clearSelect () {
        const box = this.$refs.box
        box.clearRec()
        this.clipData = null
      },
      setImgSize () {
        // image's naturalWidth naturalHeight ratio
        const nr = this.nw / this.nh
        const scw = this.$containerBox.offsetWidth
        const sch = this.$containerBox.offsetHeight
        let rw = 0  // select box width
        let rh = 0  // select box height
        if (nr >= this.ratio) {
          this.imgSize.w = scw
          this.imgSize.h = scw / nr
          this.containerTop = (sch - this.imgSize.h) / 2
          rh = this.imgSize.h
          rw = rh * this.ratio
        } else {
          this.imgSize.h = sch
          this.imgSize.w = sch * nr
          this.containerTop = 0
          rw = this.imgSize.w
          rh = rw / this.ratio
        }
        this.$srcImg.setAttribute('style', `width:${this.imgSize.w}px;height:${this.imgSize.h}px;`)
        this.$imgContainer.setAttribute('style',
          `width:${this.imgSize.w}px;height:${this.imgSize.h}px;top:${this.containerTop}px;`)
        this.$refs.box.rec = {w: rw, h: rh, l: 0, t: 0}
      },
      getComputedRec (r) {
        const cw = this.$imgContainer.offsetWidth
        const ch = this.$imgContainer.offsetHeight
        const wr = cw / this.nw
        const hr = ch / this.nh
        return {
          l: r.l / wr, t: r.t / hr,
          w: r.w / wr, h: r.h / hr
        }
      },
      updatePreview () {
        const rec = this.$refs.box.rec
        const pcw = this.$preContainer.offsetWidth
        const pch = this.$preContainer.offsetHeight
        const wr = pcw / rec.w
        const hr = pch / rec.h
        const w = wr * this.$imgContainer.offsetWidth
        const h = hr * this.$imgContainer.offsetHeight
        const l = -rec.l * wr
        const t = -rec.t * hr
        this.$resImg.setAttribute('style',
          `width:${w}px;height:${h}px;top:${t}px;left:${l}px;`)
      },
      clip () {
        let rec = this.$refs.box.rec
        if (!rec.w || !rec.h) {
          return
        }

        const bufferCanvas = document.createElement('canvas')
        const bfx = bufferCanvas.getContext('2d')
        const computedRec = this.getComputedRec(rec)
        bufferCanvas.width = computedRec.w
        bufferCanvas.height = computedRec.h
        bfx.drawImage(this.$srcImg, -computedRec.l, -computedRec.t, this.nw, this.nh)
        this.clipData = bufferCanvas.toDataURL('image/jpeg', 1)
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
    height: 0;
    margin: auto;
  }

  .img-container img {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .img-container .shadow-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1;
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
    overflow: hidden;
    border-radius: 4px;
  }

  .pre-container img {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .pre-info {
    margin-top: 20px;
    font-size: 12px;
    color: #99a2aa;
  }

  .clearfix:before, .clearfix:after {
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
    text-decoration: none;
  }

  .btn-confirm {
    border: 1px solid #00a1d6;
    color: #fff;
    background-color: #00a1d6;
  }

  .btn-confirm:hover {
    background-color: #00b5e5;
  }
</style>
