<template>
<div id="app">
  <m-header></m-header>
  <tab></tab>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <Player></Player>
</div>
</template>

<script>
import MHeader from '@/components/MHeader/MHeader'
import Tab from '@/components/Tab/Tab'
import Player from '@/components/Player/Player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="scss">
@import "./common/scss/variable";

#app {
    color: $color-theme;
}
</style>
