<template lang="html">
  <div class="rank" ref="rank">
    <scroll class="top-list" :data="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in toplist" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <transition name="moveInLeft">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getToplist } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import Scroll from '@/base/scroll/scroll'
import { playListMixin } from '@/common/js/mixin'
import { miniPlayerHeight } from '@/common/js/config'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      toplist: []
    }
  },
  methods: {
    selectItem(toplist) {
      this.$router.push(`/rank/${toplist.id}`)
      this.setRankDetail(toplist)
    },
    handlerPlayList(playlist) {
      const bottom = playlist.length > 0 ? miniPlayerHeight : '0px'
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getToplist() {
      getToplist().then(res => {
        if (res.code === ERR_OK) {
          this.toplist = res.data.topList
        }
      })
    },
    ...mapMutations({
      setRankDetail: 'SET_RANKDETAIL'
    })
  },
  created() {
    this._getToplist()
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .top-list {
        height: 100%;
        overflow: hidden;
        .item {
            display: flex;
            margin: 0 20px;
            padding-top: 20px;
            height: 100px;
            .icon {
                flex: 0 0 100px;
                width: 100px;
                height: 100px;
            }
            .songlist {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 20px;
                height: 100px;
                overflow: hidden;
                background: $color-highlight-background;
                color: $color-text-d;
                font-size: 12px;
                .song {
                    line-height: 26px;
                    @include no-wrap();
                }
            }
        }
    }
}
.moveInLeft-enter-active,
.moveInLeft-leave-active {
    transition: all .3s linear;
}
.moveInLeft-enter,
.moveInLeft-leave-to {
    transform: translate3d(100%,0,0);
}
</style>
