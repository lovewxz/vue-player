<template lang="html">
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcutData" ref="shortcut" :delayRefresh="delayRefresh">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKeys" @click="setQuery(item.k)">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-if="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @deleteOne="deleteOneSearchHistory" @select="setQuery"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="save" ref="suggest"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" @confirm="clearSearchHistory" confirmBtnText="清空" ref="confirm"></confirm>
    <transition name="moveInLeft">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import Suggest from '@/components/suggest/suggest'
import SearchList from '@/base/search-list/search-list'
import { mapActions } from 'vuex'
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import { playListMixin, searchMixin } from '@/common/js/mixin'
import { miniPlayerHeight } from '@/common/js/config'

export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotKeys: []
    }
  },
  computed: {
    shortcutData() {
      return this.hotKeys.concat(this.searchHistory)
    }
  },
  methods: {
    handlerPlayList(playlist) {
      const bottom = playlist.length > 0 ? miniPlayerHeight : '0px'
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  created() {
    this._getHotKey()
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Scroll,
    Confirm
  }
}
</script>

<style lang="scss">
@import "../../common/scss/variable";

.search {
    .search-box-wrapper {
        margin: 20px;
    }
    .shortcut-wrapper {
        position: fixed;
        top: 178px;
        bottom: 0;
        width: 100%;
        .shortcut {
            height: 100%;
            overflow: hidden;
            .hot-key {
                margin: 0 20px 20px;
                .title {
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: $color-text-l;
                }
                .item {
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 20px 10px 0;
                    border-radius: 6px;
                    background: $color-highlight-background;
                    font-size: 14px;
                    color: $color-text-l;
                }
            }
            .search-history {
                position: relative;
                margin: 0 20px;
                .title {
                    display: flex;
                    height: 40px;
                    align-items: center;
                    font-size: 14px;
                    color: $color-text-l;
                    .text {
                        flex: 1;
                    }
                    .clear {
                        position: relative;
                        .icon-clear {
                            font-size: 14px;
                            color: $color-text-d;
                        }
                    }
                }
            }
        }
    }
    .search-result {
        position: fixed;
        top: 178px;
        bottom: 0;
        width: 100%;
    }
    .moveInLeft-enter-active,
    .moveInLeft-leave-active {
        transition: all 0.4s linear;
    }
    .moveInLeft-enter,
    .moveInLeft-leave-to {
        transform: translate3d(100%,0,0);
    }
}
</style>
