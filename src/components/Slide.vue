<template>
  <div class="slider" @click="clickUpdate">
    <span class="bar">
            <span class="process" @mousedown="dragActive=true"></span>
        </span>
  </div>
</template>

<script>
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
        return this.cur >= this.max ? 100 : (this.cur / this.max) * 100;
      }
    },
    watch: {
      cur() {
        this.updateToggle();
      }
    },
    created() {
    },
    ready() {
      this.updateToggle();
      this.moveHandler = this.throttle(this.dragUpdate, 150, this);

      window.addEventListener('mousemove', this.moveHandler);
      window.addEventListener('mouseup', this.deactiveDrag);
    },
    beforeDestroy() {
      window.removeEventListener('mousemove', this.moveHandler);
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
        const d = e.pageX - this.getLeft(this.$el);

        this.updateCur(d / w * this.max);
      },
      clickUpdate(e) {
        const w = this.$el.offsetWidth;
        const d = e.pageX - this.getLeft(this.$el);

        this.updateCur(d / w * this.max);
      },
      deactiveDrag() {
        this.dragActive = false;
      },
      updateCur(c) {
        if (c <= 0) {
          this.cur = 0;
        } else if (c >= this.max) {
          this.cur = this.max;
        } else {
          this.cur = c;
        }
      },
      updateToggle() {
        this.$el.querySelectorAll('.process')[0].setAttribute('style', `left: ${this.percent}%`)
      },
      getLeft(el) {
        let left = el.offsetLeft;
        let parent = el.offsetParent;

        while (parent) {
          left += parent.offsetLeft;
          parent = parent.offsetParent;
        }

        return left;
      },
      throttle(fn, wait, ctx) {
        let t = null;

        return function (...args) {
          if (t) {
            clearTimeout(t);
            t = null;
          }

          setTimeout(function () {
              fn.call(ctx, ...args);
            }, wait);
          }
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
    transition: all .1s linear;
  }
</style>