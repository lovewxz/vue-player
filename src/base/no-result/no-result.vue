<template>
<div class="no-result">
  <div class="no-result-icon"></div>
  <p class="no-result-text">{{title}}</p>
</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
@import "../../common/scss/mixin";
@import "../../common/scss/variable";

.no-result {
    text-align: center;
    .no-result-icon {
        @include bg-image( 'no-result');
        width: 86px;
        height: 90px;
        margin: 0 auto;
        background-size: 86px 90px;
    }
    .no-result-text {
        margin-top: 30px;
        font-size: 14px;
        color: $color-text-d;
    }
}
</style>
