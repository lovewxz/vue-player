<template lang="html">
  <div class="head-top">
     <span class="head-icon"></span>
     <span class="head-text">Chicken Music</span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import '../../common/scss/mixin';

.head-top {
    position: relative;
    height: 44px;
    text-align: center;
    color: #ffcd32;
    font-size: 0;
    .head-icon {
        display: inline-block;
        vertical-align: top;
        @include bg-image('logo');
        background-size: 30px 32px;
        margin-right: 9px;
        width: 30px;
        height: 32px;
        margin-top: 6px;
    }
    .head-text {
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: 18px;
    }
}
</style>
