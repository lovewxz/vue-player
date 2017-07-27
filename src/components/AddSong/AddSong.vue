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
    <div class="shortcut" v-show="!query">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="seletSwitch"></switches>
      <div class="list-wrapper">
        <scroll class="list-scroll" v-if="currentIndex === 0" :data="playHistory" ref="songHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @selectItem="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="currentIndex === 1" :data="searchHistory" ref="searchHistory" :delayRefresh="delayRefresh">
          <div class="list-inner">
            <search-list :searches="searchHistory" @deleteOne="deleteOneSearchHistory" @select="setQuery"></search-list>
          </div>
        </scroll>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" :zhida="zhida" @listScroll="blurInput" @select="selectSuggest"></suggest>
    </div>
    <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">1首歌曲已经添加到播放列表</span>
      </div>
    </top-tip>
  </div>
</transition>
</template>
<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import Switches from '@/base/switches/switches'
import SongList from '@/base/song-list/song-list'
import Song from '@/common/js/song'
import { searchMixin } from '@/common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import Scroll from '@/base/scroll/scroll'
import SearchList from '@/base/search-list/search-list'
import TopTip from '@/base/top-tip/top-tip'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      zhida: false,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      if (this.currentIndex === 0) {
        setTimeout(() => {
          this.$refs.songHistory.refresh()
        }, 20)
      } else {
        setTimeout(() => {
          this.$refs.searchHistory.refresh()
        }, 20)
      }
    },
    hide() {
      this.showFlag = false
    },
    seletSwitch(index) {
      this.currentIndex = index
    },
    selectSuggest() {
      this.save()
      this.$refs.topTip.show()
    },
    selectSong(item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
        this.$refs.topTip.show()
      }
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    SongList,
    Scroll,
    SearchList,
    TopTip
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
    .shortcut {
        .list-wrapper {
            position: absolute;
            top: 165px;
            bottom: 0;
            width: 100%;
            .list-scroll {
                height: 100%;
                overflow: hidden;
                .list-inner {
                    padding: 20px 30px;
                }
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
    .top-tip {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: 14px;
        color: $color-theme;
        margin-right: 4px;
      }
      .text {
        font-size: 14px;
        color: #fff;
      }
    }
}
</style>
