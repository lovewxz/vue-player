<template>
<transition name="playlist-fade">
  <div class="playlist" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="modeIcon" @click="changeMode"></i>
          <span class="text">{{getModeText}}</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
      </div>
      <scroll class="list-content" ref="listContent">
        <transition-group tag="ul" name="list-content-fade">
          <li :key="item.id" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)" ref="listContentItem">
            <i class="current" :class="getCurrentIconCls(item)"></i>
            <span class="text" v-html="item.name"></span>
            <span class="like">
              <i class="icon-not-favourite"></i>
            </span>
            <span class="delete" @click.stop="deleteOne(item)">
              <i class="icon-delete"></i>
            </span>
          </li>
        </transition-group>
      </scroll>
      <div class="list-operate">
        <div class="add">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span>关闭</span>
      </div>
    </div>
    <confirm text="是否清空列表" confirmBtnText="清空" @confirm="confirmClear" ref="confirm"></confirm>
  </div>
</transition>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from '@/base/scroll/scroll'
import { playMode } from '@/common/js/config'
import Confirm from '@/base/confirm/confirm'
import { playerMixin } from '@/common/js/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    getModeText() {
      return this.mode === playMode.random ? '随机播放' : this.mode === playMode.sequence ? '顺序播放' : '单曲循环'
    },
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrentElement(this.currentSong)
      }, 20)
    },
    getCurrentIconCls(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    deleteOne(item) {
      this.deleteOneSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    scrollToCurrentElement(current) {
      let index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listContentItem[index], 300)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING'
    }),
    ...mapActions([
      'deleteOneSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrentElement(newSong)
    }
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.playlist {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 200;
    background: $color-background-d;
    &.playlist-fade-enter-active,
    &.playlist-fade-leave-active {
        transition: opacity 0.3s;
        .list-wrapper {
            transition: all 0.3s;
        }
    }
    &.playlist-fade-enter,
    &.playlist-fade-leave-to {
        opacity: 0;
        .list-wrapper {
            transform: translate3d(0,100%,0);
        }
    }
    .list-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $color-highlight-background;
        .list-header {
            position: relative;
            padding: 20px 30px 10px 20px;
            .title {
                display: flex;
                align-items: center;
                .icon {
                    margin-right: 10px;
                    font-size: 30px;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    font-size: 14px;
                    color: $color-text-l;
                }
                .clear {
                    @include extend-click() .icon-clear {
                        font-size: 14px;
                        color: $color-text-d;
                    }
                }
            }
        }
        .list-content {
            max-height: 240px;
            overflow: hidden;
            .item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;
                &.list-content-fade-enter-active,
                &.list-content-fade-leave-active {
                    transition: all 0.1s;
                }
                &.list-content-fade-enter,
                &.list-content-fade-leave-to {
                    height: 0;
                }
                .current {
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: 12px;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    @include no-wrap();
                    font-size: 14px;
                    color: $color-text-d;
                }
                .like {
                    position: relative;
                    margin-right: 15px;
                    font-size: 12px;
                    color: $color-theme;
                }
                .delete {
                    position: relative;
                    font-size: 12px;
                    color: $color-theme;
                }
            }
        }
        .list-operate {
            width: 140px;
            margin: 20px auto 30px;
            .add {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid $color-text-l;
                border-radius: 100px;
                color: $color-text-l;
                .icon-add {
                    margin-right: 5px;
                    font-size: 10px;
                }
                .text {
                    font-size: 12px;
                }
            }
        }
        .list-close {
            text-align: center;
            line-height: 50px;
            background: $color-background;
            font-size: 16px;
            color: $color-text-l;
        }
    }
}
</style>
