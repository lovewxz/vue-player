<template lang="html">
  <div class="singer">
    <scroll class="listview">
      <ul>
      </ul>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import {
  getSingerList
} from '@/api/singer'
import {
  ERR_OK
} from '@/api/config'

export default {
  data() {
    return {
      singerList: {
        type: Array,
        default: []
      }
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = res.data.list
        }
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss">
@import '../../components/Singer/Singer';
</style>
