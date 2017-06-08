<template>
<div id="app">
  <m-header></m-header>
  <tab></tab>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</div>
</template>

<script>
import MHeader from '@/components/MHeader/MHeader'
import Tab from '@/components/Tab/Tab'

export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="scss">
@import "./common/scss/variable";

#app {
    color: $color-theme;
}
</style>
