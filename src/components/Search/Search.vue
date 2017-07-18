<template lang="html">
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @deleteOne="deleteOneSearchHistory" @select="setQuery"></search-list>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="save"></suggest>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import Suggest from '@/components/suggest/suggest'
import SearchList from '@/base/search-list/search-list'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      hotKeys: [],
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    save() {
      this.saveSearchHistory(this.query)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    setQuery(item) {
      this.$refs.searchBox.setQuery(item)
    },
    getQuery(query) {
      this.query = query
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteOneSearchHistory'
    ])
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList
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
}
</style>
