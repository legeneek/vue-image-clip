<template>
  <div class="slider" @click="clickUpdate">
    <span class="bar">
            <span class="process" @mousedown="dragActive=true"></span>
        </span>
  </div>
</template>

<script>
  import { getLeft } from '../util.js'

  export default {
    props: {
      min: {
        default: 0
      },
      max: {
        default: 100
      },
      cur: {
        default: 50
      },
      step: {
        default: 1
      }
    },
    data() {
      return {
        dragActive: false,
        moveHandler: null
      }
    },
    computed: {
      percent() {
        return this.cur >= this.max ? 100 : ((+this.cur - +this.min) / (+this.max - +this.min)) * 100;
      }
    },
    watch: {
      cur() {
        this.updateToggle();
        this.$dispatch('sliderChange', this.cur);
      }
    },
    created() {
    },
    ready() {
      this.updateToggle();

      window.addEventListener('mousemove', this.dragUpdate);
      window.addEventListener('mouseup', this.deactiveDrag);
    },
    beforeDestroy() {
      window.removeEventListener('mousemove', this.dragUpdate);
      window.removeEventListener('mouseup', this.deactiveDrag);
    },
    methods: {
      plus() {
        this.cur += this.step;
        if (this.cur >= this.max) {
          this.cur = this.max;
        }
      },
      minus() {
        this.cur -= this.step;
        if (this.cur <= this.min) {
          this.cur = this.min;
        }
      },
      dragUpdate(e) {
        if (!this.dragActive) {
          return;
        }
        const w = this.$el.offsetWidth;
        const d = e.pageX - getLeft(this.$el);

        this.updateCur(w, d);
      },
      clickUpdate(e) {
        const w = this.$el.offsetWidth;
        const d = e.pageX - getLeft(this.$el);

        this.updateCur(w, d);
      },
      updateCur(w, d) {
        if (d <= 0) {
          this.cur = this.min;
        } else if (d >= w) {
          this.cur = this.max;
        } else {
          this.cur = d * (+this.max - +this.min) / w + +this.min;
        }
      },
      deactiveDrag() {
        this.dragActive = false;
      },
      updateToggle() {
        this.$el.querySelectorAll('.process')[0].setAttribute('style', `left: ${this.percent}%`)
      }
    }
  }
</script>

<style scoped>
  span {
    display: inline-block;
  }

  .slider {
    width: 100%;
    position: relative;
    color: #6d757a;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .bar {
    position: relative;
    top: -5px;
    width: 100%;
    height: 2px;
    background-color: #99a2aa;
    z-index: 10;
  }

  .process {
    position: absolute;
    text-align: center;
  }

  .process {
    top: -6px;
    left: 0;
    width: 14px;
    height: 14px;
    border-radius: 10px;
    border: 2px solid #fff;
    background-color: #6d757a;
  }
</style>