<template>
  <music-list :songs="songs" :bg-img="bgImg" :title="title"></music-list>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  getSingerDetail
} from '@/api/singer'
import {
  ERR_OK
} from '@/api/config'

import {
  createSong
} from '@/common/js/song'
import MusicList from '@/components/MusicList/MusicList'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    bgImg() {
      return this.singer.avatar
    },
    title() {
      return this.singer.name
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.data.list)
          console.log(this.songs)
          console.log(res.data.list)
        }
      })
    },
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        let {
          musicData
        } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss">
@import "SingerDetail";
</style>
