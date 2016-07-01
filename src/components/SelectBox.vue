<template>
  <div class="crop-wrap" @mousedown="wrapMouseDown">
    <div class="crop-box" @mousedown="boxMouseDown"></div>
  </div>
</template>

<script>
  import { getLeft, getTop } from '../util'

  export default {
    components: {},
    data() {
      return {
        rec: { w: 0, h: 0, l: 0, t: 0 },
        parent: { l: 0, t: 0 },
        action: '',
        actionPoint: { x: 0, y: 0 },
        radio: 16 / 9,
        referPoint: { x: 0, y: 0 }
      }
    },
    watch: {
      rec: {
        handler() {
          this.drawRec();
        },
        deep: true
      }
    },
    ready() {
      window.addEventListener('mouseup', this.disableDrag);
      window.addEventListener('mousemove', this.updateRec)
    },
    beforeDestory() {
      window.removeEventListener('mouseup', this.disableDrag);
      window.removeEventListener('mousemove', this.updateRec)
    },
    methods: {
      initAction(name, x, y) {
        this.action = name;
        this.pl = getLeft(this.$el);
        this.pt = getTop(this.$el);
        this.actionPoint = { x, y }
      },
      boxMouseDown(e) {
        this.initAction('move', e.pageX, e.pageY);
        e.preventDefault();
        e.stopPropagation();
      },
      wrapMouseDown(e) {
        this.initAction('cross', e.pageX, e.pageY);
        this.rec = {
          w: 0,
          h: 0,
          l: e.pageX - this.pl,
          t: e.pageY - this.pt
        };
        this.referPoint = { x: this.rec.l, y: this.rec.t };
      },
      disableDrag() {
        this.action = '';
        this.referPoint = { x: this.rec.l, y: this.rec.t };
        console.log(JSON.stringify(this.rec));
      },
      updateRec(e) {
        if (!this.action) {
          return
        }

        const elWidth = this.$el.offsetWidth;
        const elHeight = this.$el.offsetHeight;
        const dx = e.pageX - this.actionPoint.x;
        const dy = e.pageY - this.actionPoint.y;
        let w = 0;
        let h = 0;
        let t = 0;
        let l = 0;

        if (this.action === 'move') {
          t = dy + this.referPoint.y;
          l = dx + this.referPoint.x;

          if (t <= 0) {
            t = 0;
          } else if (t + this.rec.h >= elHeight) {
            t = elHeight - this.rec.h;
          }

          if (l <= 0) {
            l = 0;
          } else if (l + this.rec.w >= elWidth) {
            l = elWidth - this.rec.w;
          }

          this.rec.l = l;
          this.rec.t = t;
        }

        if (this.action === 'cross') {
          if (dx >= 0 && dy >= 0) {
            w = dx + this.rec.l >= elWidth ? elWidth - this.rec.l : dx;
            h = w / this.radio;

            if (h + this.rec.t > elHeight) {
              h = elHeight - this.rec.t;
              w = h * this.radio;
            }
            this.rec.w = w;
            this.rec.h = h;
          } else if (dx >= 0 && dy < 0) {
            w = dx + this.rec.l >= elWidth ? elWidth - this.rec.l : dx;
            h = w / this.radio;

            if (h + this.rec.t > elHeight) {
              h = elHeight - this.rec.t;
              w = h * this.radio;
            }

            t = this.referPoint.y - h;
            t = t <= 0 ? 0 : t;
            this.rec.t = t;
            this.rec.w = w;
            this.rec.h = h;
          }
        }
      },
      drawRec() {
        const $rec = this.$el.querySelectorAll('.crop-box')[0];
        $rec.setAttribute('style',
            `width:${this.rec.w}px;height:${this.rec.h}px;left:${this.rec.l}px;top:${this.rec.t}px`);
      }
    }
  }
</script>

<style scoped>
  .crop-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .crop-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    background: rgba(255,255,255,.1);
    cursor: pointer;
  }
</style>