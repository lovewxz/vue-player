<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
  <div class="bar-inner">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="onProgressTouchStart" @touchmove.prevent="onProgressTouchMove" @touchend="onProgressTouchEnd">
      <div class="progress-btn"></div>
    </div>
  </div>
</div>
</template>
<script>
import { prefixStyle } from '@/common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    onProgressTouchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    onProgressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    onProgressTouchEnd() {
      this.touch.init = false
      this._triggerPercent()
    },
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('progressOnChange', percent)
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.init) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = barWidth * newPercent
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable";

.progress-bar {
    height: 30px;
    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: $color-background-d;
        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
        }
        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-theme;
            }
        }
    }
}
</style>
