<template>
<transition name="moveInLeft">
  <div class="user-center">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="selectCurrentIndex"></switches>
    </div>
    <div class="play-btn">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper"></div>
  </div>
</transition>
</template>
<script>
import Switches from '@/base/switches/switches'

export default {
  data() {
    return {
      switches: [{ name: '我喜欢的' }, { name: '最近听的' }],
      currentIndex: 0
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    selectCurrentIndex(index) {
      this.currentIndex = index
    }
  },
  components: {
    Switches
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: $color-background;
    width: 100%;
    &.moveInLeft-enter-active,
    &.moveInLeft-leave-active {
        transition: all 0.4s;
    }
    &.moveInLeft-enter,
    &.moveInLeft-leave-to {
        transform: translate3d(100%,0,0);
    }
    .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
            display: block;
            padding: 10px;
            font-size: 22px;
            color: $color-theme;
        }
    }
    .switches-wrapper {
        margin: 10px 0 30px;
    }
    .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        font-size: 0;
        color: $color-text-l;
        .icon-play {
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: 16px;
        }
        .text {
            display: inline-block;
            font-size: 12px;
            vertical-align: middle;
        }
    }
    .list-wrapper {
        position: absolute;
        top: 110px;
        bottom: 0;
        width: 100%;
    }
}
</style>
