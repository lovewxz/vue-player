<template>
<transition name="moveInLeft">
  <div class="user-center">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="selectCurrentIndex"></switches>
    </div>
    <div class="play-btn" @click="random">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper" ref="listWrapper">
      <scroll class="list-scroll" v-if="currentIndex === 0" :data="favouriteList" ref="favouriteList">
        <div class="list-inner">
          <song-list :songs="favouriteList" @selectItem="selectSong"></song-list>
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex === 1" :data="playHistory" ref="playHistory">
        <div class="list-inner">
          <song-list :songs="playHistory" @selectItem="selectSong"></song-list>
        </div>
      </scroll>
    </div>
    <div class="no-result-wrapper" v-show="noResultShow">
      <no-result :title="noResultTit"></no-result>
    </div>
  </div>
</transition>
</template>
<script>
import Switches from '@/base/switches/switches'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/song-list/song-list'
import Song from '@/common/js/song'
import { mapGetters, mapActions } from 'vuex'
import NoResult from '@/base/no-result/no-result'
import { playListMixin } from '@/common/js/mixin'
import { miniPlayerHeight } from '@/common/js/config'

export default {
  mixins: [playListMixin],
  data() {
    return {
      switches: [{ name: '我喜欢的' }, { name: '最近听的' }],
      currentIndex: 0
    }
  },
  computed: {
    noResultShow() {
      if (this.currentIndex === 0) {
        return !this.favouriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultTit() {
      if (this.currentIndex === 0) {
        return '最近没收藏歌曲'
      } else {
        return '您还没收听过歌曲哦！'
      }
    },
    ...mapGetters([
      'favouriteList',
      'playHistory'
    ])
  },
  methods: {
    handlerPlayList(playlist) {
      const bottom = playlist.length > 0 ? miniPlayerHeight : '0px'
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.favouriteList && this.$refs.favouriteList.refresh()
      this.$refs.playHistory && this.$refs.playHistory.refresh()
    },
    back() {
      this.$router.back()
    },
    selectCurrentIndex(index) {
      this.currentIndex = index
    },
    selectSong(song) {
      this.insertSong(new Song(song))
    },
    random() {
      let list = this.currentIndex === 0 ? this.favouriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list.map((item) => {
        return new Song(item)
      })
      this.randomPlay({
        list
      })
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
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
        .list-scroll {
            height: 100%;
            overflow: hidden;
            .list-inner {
                padding: 20px 30px;
            }
        }
    }
    .no-result-wrapper {
        position: absolute;
        transform: translateY(-50%);
        width: 100%;
        top: 50%;
    }
}
</style>
