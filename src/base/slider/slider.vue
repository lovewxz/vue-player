<template lang="html">
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPage === index}"></span>
    </div>
  </div>
</template>

<script>
import {
  addClass
} from '@/common/js/dom'
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      dots: [],
      currentPage: 0
    }
  },
  props: {
    autoplay: {
      default: true,
      type: Boolean
    },
    interval: {
      default: 4000,
      type: Number
    },
    loop: {
      default: true,
      type: Boolean
    }
  },
  mounted() {
    setTimeout(() => {
      this._setWidthSlider()
      this._initDots()
      this._initSlider()
      if (this.autoplay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setWidthSlider(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setWidthSlider(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        momentum: false,
        scrollY: false,
        scrollX: true
      })
      this.slider.on('scrollEnd', () => {
        this.currentPage = this.slider.getCurrentPage().pageX
        if (this.loop) {
          this.currentPage -= 1
        }
        if (this.autoplay) {
          this._play()
        }
      })
      this.slider.on('beforeScrollStart', () => {
        if (this.autoplay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play() {
      let pageIndex = this.currentPage + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss">
.slider {
    min-height: 1px;
    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }
            img {
                display: block;
                width: 100%;
            }
        }
    }
    .dots {
        position: absolute;
        bottom: 12px;
        text-align: center;
        right: 0;
        left: 0;
        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: hsla(0,0%,100%,.5);
            &.active {
                background: hsla(0,0%,100%,.8);
                border-radius: 5px;
                width: 20px;
            }
        }
    }
}
</style>
