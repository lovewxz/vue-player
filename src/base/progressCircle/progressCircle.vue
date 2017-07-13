<template>
<div class="progress-circle">
  <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-background"></circle>
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-bar" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
  <slot></slot>
</div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 2 * 50
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable";

.progress-circle {
    position: relative;
    circle {
        stroke-width: 8px;
        transform-origin: center;
        &.progress-background {
            transform: scale(.9);
            stroke: $color-theme-d;
        }
        &.progress-bar {
            transform: rotate(270deg) scale(.9);
            stroke: $color-theme;
        }
    }
}
</style>
