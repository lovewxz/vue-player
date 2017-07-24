<template>
<transition name="moveUp">
  <div class="add-song" v-show="showFlag" @click.stop>
    <div class="header">
      <h1 class="title">添加歌曲到列表</h1>
      <div class="close" @click="hide">
        <i class="icon-close"></i>
      </div>
    </div>
    <div class="search-box-wrapper">
      <search-box placeholder="搜索歌曲" @query="getQuery" ref="searchBox"></search-box>
    </div>
    <div class="shortcut" v-show="!query"></div>
    <div class="search-result" v-show="query">
      <suggest :query="query" :zhida="zhida" @listScroll="blurInput" @select="save"></suggest>
    </div>
  </div>
</transition>
</template>
<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import { searchMixin } from '@/common/js/mixin'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      query: '',
      zhida: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    }
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    &.moveUp-enter-active,
    &.moveUp-leave-active {
        transition: all 0.4s;
    }
    &.moveUp-enter,
    &.moveUp-leave-to {
        transform: translate3d(0,100%,0);
    }
    background: $color-background;
    .header {
        position: relative;
        height: 44px;
        text-align: center;
        .title {
            line-height: 44px;
            font-size: 18px;
            color: #fff;
        }
        .close {
            position: absolute;
            top: 0;
            right: 8px;
            .icon-close {
                display: block;
                padding: 12px;
                font-size: 20px;
                color: $color-theme;
            }
        }
    }
    .search-box-wrapper {
        margin: 20px;
    }
    .search-result {
        position: fixed;
        top: 124px;
        bottom: 0;
        width: 100%;
    }
}
</style>
