<template lang="html">
  <div class="head-top">
     <span class="head-icon"></span>
     <span class="head-text">Chicken Music</span>
     <router-link to="/user" tag="div" class="mine">
       <i class="icon-mine"></i>
     </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '../../common/scss/mixin';
@import '../../common/scss/variable';

.head-top {
    position: relative;
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;
    .head-icon {
        display: inline-block;
        vertical-align: top;
        @include bg-image( 'logo');
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
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
}
</style>
