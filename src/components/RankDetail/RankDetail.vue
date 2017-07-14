<template>
<div class="rank-detail">
  <music-list :title="title" :bg-img="bgImg" :songs="rankSongs" :rank="rank"></music-list>
</div>
</template>
<script>
import MusicList from '@/components/MusicList/MusicList'
import { mapGetters } from 'vuex'
import { getRankDetail } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  computed: {
    title() {
      return this.rankdetail.topTitle
    },
    bgImg() {
      if (this.rankSongs.length) {
        return this.rankSongs[0].img
      }
      return ''
    },
    ...mapGetters([
      'rankdetail'
    ])
  },
  data() {
    return {
      rankSongs: [],
      rank: true
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getRankDetail(id) {
      if (!id) {
        this.$router.push('/rank')
      }
      getRankDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.rankSongs = this._normalizelist(res.songlist)
          console.log(this.rankSongs)
        }
      })
    },
    _normalizelist(songs) {
      let ret = []
      songs.forEach((item) => {
        if (item.data.albumid && item.data.songid) {
          ret.push(createSong(item.data))
        }
      })
      return ret
    }
  },
  created() {
    this._getRankDetail(this.rankdetail.id)
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.rank-detail {
    background: $color-background;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
