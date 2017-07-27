<template>
<transition name="drop">
  <div class="top-tip" @click="hide" v-show="showFlag">
    <slot></slot>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    delayTime: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delayTime)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.top-tip {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 500;
    background: $color-dialog-background;
    &.drop-enter-active,
    &.drop-leave-active {
        transition: all 0.4s;
    }
    &.drop-enter,
    &.drop-leave-to {
        transform: translate3d(0,-100%,0);
    }
}
</style>
