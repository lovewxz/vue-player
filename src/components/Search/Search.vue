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
              <li class="item" v-for="item in hotKeys" @click="setQuery(item)">{{item.k}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import Suggest from '@/base/suggest/suggest'

export default {
  data() {
    return {
      hotKeys: [],
      query: ''
    }
  },
  methods: {
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    setQuery(hotKey) {
      this.$refs.searchBox.setQuery(hotKey.k)
    },
    getQuery(query) {
      this.query = query
    }
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest
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
