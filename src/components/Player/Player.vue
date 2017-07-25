<template>
<div class="player" v-show="playList.length > 0">
  <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.img" width="100%" height="100%">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="title" v-html="currentSong.name"></div>
        <div class="subtitle" v-html="currentSong.singer"></div>
      </div>
      <div class="middle" @touchstart.prevent="onMiddleTouchStart" @touchmove.prevent="onMiddleTouchMove" @touchend="onMiddleTouchEnd">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="animateRotate">
              <img :src="currentSong.img" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricWrapper">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p class="text" v-for="(line,index) in currentLyric.lines" ref="lyricline" :class="{current: currentLineNum === index}">{{line.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <div class="dot" :class="{active: currentShow === 'cd'}"></div>
          <div class="dot" :class="{active: currentShow === 'lyric'}"></div>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{_filterTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @progressOnChange="progressOnChange"></progress-bar>
          </div>
          <span class="time time-r">{{_filterTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disable">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disable">
            <i :class="playIcon" @click="togglePlaying"></i>
          </div>
          <div class="icon i-right" :class="disable">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-favorite"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :src="currentSong.img" alt="" width="40" height="40" :class="animateRotate">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius" :percent="percent">
          <i :class="miniPlayIcon" @click.stop="togglePlaying" class="icon-mini"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
  <playlist ref="playlist"></playlist>
  <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="getAudioTime" @ended="end"></audio>
</div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from '@/common/js/dom'
import progressBar from '@/base/progressBar/progressBar'
import progressCircle from '@/base/progressCircle/progressCircle'
import { playMode } from '@/common/js/config'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll/scroll'
import Playlist from '@/components/Playlist/Playlist'
import { playerMixin } from '@/common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentShow: 'cd',
      currentLineNum: 0,
      playingLyric: ''
    }
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    animateRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disable() {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'playing',
      'currentIndex'
    ])
  },
  methods: {
    showPlaylist() {
      this.$refs.playlist.show()
    },
    progressOnChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    getAudioTime(e) {
      this.currentTime = e.target.currentTime
    },
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style.transform = ''
    },
    togglePlaying() {
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this._loop()
      } else {
        this.next()
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this._loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
      }
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this._loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
      }
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error() {
      this.songReady = true
    },
    onMiddleTouchStart(e) {
      this.touch.init = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      // 用来判断是否是一次移动
      this.touch.moved = false
    },
    onMiddleTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth // 判断两种状态下的middlel和middler的位置
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricWrapper.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricWrapper.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    onMiddleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 400
      this.$refs.lyricWrapper.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricWrapper.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    _loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      // 循环播放时，让歌词回到0
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    _filterTime(time) {
      time = Math.floor(time)
      const minutes = Math.floor(time / 60)
      const seconds = this._pad(time % 60)
      return `${minutes}:${seconds}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - width / 2 - paddingTop - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    _getLyric() {
      this.currentSong.getLyric().then(res => {
        this.currentLyric = new Lyric(res, this._handlerLyric)
        console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    _handlerLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricline[lineNum - 5]
        this.$refs.lyricWrapper.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricWrapper.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  created() {
    this.touch = {}
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      // 歌词跳跃问题。是因为lyric-parser中有定时器，我们需要在歌曲改变的时候暂停歌词
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // 为了兼容微信切换到后台时，返回后继续能播放
      setTimeout(() => {
        this.$refs.audio.play()
        this._getLyric()
      }, 1000)
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        const audioDom = this.$refs.audio
        newPlaying ? audioDom.play() : audioDom.pause()
      })
    }
  },
  components: {
    progressBar,
    progressCircle,
    Scroll,
    Playlist
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.player {
    .normal-player {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;
        &.normal-enter-active,
        &.normal-leave-active {
            transition: all 0.4s;
            .bottom,
            .top {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }
        &.normal-enter,
        &.normal-leave-to {
            opacity: 0;
            .top {
                transform: translate3d(0,-100px,0);
            }
            .bottom {
                transform: translate3d(0,100px,0);
            }
        }
        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }
        .top {
            position: relative;
            margin-bottom: 25px;
            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: 22px;
                    color: $color-theme;
                    transform: rotate(-90deg);
                }
            }
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 18px;
                color: $color-text;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: $color-text;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        position: relative;
                        &.play {
                            animation: rotate 20s linear infinite;
                        }
                        &.pause {
                            animation-play-state: paused;
                        }
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: 14px;
                        color: $color-text-l;
                    }
                }
            }
            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        font-size: 14px;
                        line-height: 32px;
                        color: $color-text-l;
                        &.current {
                            color: $color-text-ll;
                        }
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper {
                text-align: center;
                .dot {
                    display: inline-block;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: $color-text-l;
                    &.active {
                        width: 20px;
                        border-radius: 5px;
                        background: $color-text-ll;
                    }
                }
            }
            .progress-wrapper {
                display: flex;
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time {
                    color: $color-text;
                    font-size: 12px;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                .progress-bar-wrapper {
                    flex: 1;
                }
            }
            .operators {
                display: flex;
                align-items: center;
                justify-content: center;
                .icon {
                    flex: 1;
                    color: $color-theme;
                    &.disable {
                        color: $color-theme-d;
                    }
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-favorite {
                    color: $color-theme;
                }
            }
        }
    }
    .mini-player {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-highlight-background;
        &.mini-enter-active,
        &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter,
        &.mini-leave-to {
            opacity: 0;
        }
        .icon {
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;
            img {
                border-radius: 50%;
                &.play {
                    animation: rotate 20s linear infinite;
                }
                &.pause {
                    animation-play-state: paused;
                }
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name {
                margin-bottom: 2px;
                @include no-wrap();
                font-size: 14px;
                color: $color-text;
            }
            .desc {
                @include no-wrap();
                font-size: 12px;
                color: $color-text-d;
            }
        }
        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-pause-mini,
            .icon-play-mini,
            .icon-playlist {
                font-size: 30px;
                color: $color-theme-d;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
