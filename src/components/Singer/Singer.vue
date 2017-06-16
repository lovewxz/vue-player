<template lang="html">
  <div class="singer">
    <listview :data="singerList" @select="select"></listview>
    <transition name="moveInLeft">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Singer from '@/common/js/singer'
import Listview from '@/base/listview/listview'
import {
  getSingerList
} from '@/api/singer'
import {
  ERR_OK
} from '@/api/config'

const HOST_NAME = '热门'
const HOST_NAME_LENGTH = 10

export default {
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    select(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeList(res.data.list)
        }
      })
    },
    _normalizeList(list) {
      let map = {
        hot: {
          title: HOST_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOST_NAME_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 因为遍历是无需的，所以我们需要自己排序
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOST_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  components: {
    Listview
  }
}
</script>

<style lang="scss">
@import '../../components/Singer/Singer';
</style>
