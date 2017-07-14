<template lang="html">
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKeys" @click="query(item)">{{item.k}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'

export default {
  data() {
    return {
      hotKeys: []
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
    query(hotKey) {
      this.$refs.searchBox.setQuery(hotKey.k)
    }
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox
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
}
</style>
