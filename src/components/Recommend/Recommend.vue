<template lang="html">
  <p>我是推荐</p>
</template>

<script>
import {
  getRecommend
} from '@/api/recommend'
import {
  ERR_OK
} from '@/api/config'

export default {
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
