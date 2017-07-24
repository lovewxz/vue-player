<template>
<div class="suggest">
  <scroll class="suggest-list" :data="searchResult" :pullUp="pullUp" :beforeScroll="beforeScroll" @scrollToEnd="scrollToEnd" ref="scroll" @beforeScroll="listScroll">
    <ul>
      <li class="suggest-item" v-for="item in searchResult" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getSongDetail(item)"></p>
        </div>
      </li>
      <loading title="" v-show="hasMore"></loading>
    </ul>
  </scroll>
  <div class="no-result-wrapper">
    <no-result title="抱歉,无搜索结果" v-if="!hasMore && !searchResult.length"></no-result>
  </div>
</div>
</template>
<script>
import { getSuggestResult } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import Singer from '@/common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from '@/base/no-result/no-result'

const perpage = 20
const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    zhida: {
      type: Boolean,
      default: true
    },
    beforeScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      searchResult: [],
      pullUp: true,
      hasMore: true
    }
  },
  methods: {
    listScroll() {
      this.$emit('listScroll')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push(`/search/${singer.id}`)
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.scroll.refresh()
    },
    scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      getSuggestResult(this.query, this.zhida, this.page, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.searchResult = this.searchResult.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    getSongDetail(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    search() {
      this.hasMore = true
      this.page = 1
      this.$refs.scroll.scrollTo(0, 0)
      getSuggestResult(this.query, this.zhida, this.page, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.searchResult = this._genResult(res.data)
          this._checkMore(res.data)
          console.log(this.searchResult)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizelist(data.song.list))
      }
      return ret
    },
    _normalizelist(list) {
      let ret = []
      list.forEach((item) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newquery) {
      if (!newquery) {
        return
      }
      this.search(newquery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.suggest {
    height: 100%;
    overflow: hidden;
    z-index: 200;
    .suggest-list {
        padding: 0 30px;
        height: 100%;
        overflow: hidden;
        .suggest-item {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            .icon {
                flex: 0 0 30px;
                width: 30px;
                i {
                    font-size: 14px;
                    color: $color-text-d;
                }
            }
            .name {
                flex: 1;
                font-size: 14px;
                color: $color-text-d;
                overflow: hidden;
                .text {
                    @include no-wrap();
                }
            }
        }
    }
    .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
