<template>
<div class="music-list">
  <div class="back" @click="back">
    <i class="icon-back"></i>
  </div>
  <h1 class="title">{{title}}</h1>
  <div class="bg-image" :style="bgStyle" ref="bgImage">
    <div class="filter" ref="filter"></div>
    <div class="player-wrapper" v-show="songs.length > 0" ref="playBtn">
      <div class="player">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
  </div>
  <div class="layer" ref="layer"></div>
  <scroll class="list" :data="songs" ref="list" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
    <div class="song-list-wrapper">
      <song-list :songs="songs" @selectItem="selectItem"></song-list>
    </div>
    <div class="loading-wrapper">
      <loading></loading>
    </div>
  </scroll>
</div>
</template>
<script>
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import { prefixStyle } from '@/common/js/dom'
import Loading from '@/base/loading/loading'

import { mapActions } from 'vuex'

const TOP_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  data() {
    return {
      scrollY: -1
    }
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    bgImg: {
      type: String,
      default: ''
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImg})`
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslatey, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      const percent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale += percent
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      this.$refs.layer.style[transform] = `translate3D(0,${translateY}px,0)`
      if (newY < this.minTranslatey) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${TOP_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  mounted() {
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslatey = -this.imageHeight + TOP_HEIGHT
  }
}
</script>
<style lang="scss">
@import '../../common/scss/variable';

.music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
    .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
            padding: 10px;
            display: block;
            font-size: 22px;
            color: $color-theme;
        }
    }
    .title {
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
    }
    .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        background-size: cover;
        transform-origin: top;
        .filter {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(7,17,27,.4);
        }
        .player-wrapper {
            position: absolute;
            bottom: 20px;
            z-index: 50;
            width: 100%;
            .player {
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid $color-theme;
                color: $color-theme;
                border-radius: 100px;
                font-size: 0;
                .icon-play {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: 16px;
                }
                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 12px;
                }
            }
        }
    }
    .list {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $color-background;
        .song-list-wrapper {
            padding: 20px 30px;
        }
    }
    .layer {
        background: $color-background;
        position: relative;
        height: 100%;
    }
}
</style>
