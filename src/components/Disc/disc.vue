<template>
<div class="disc">
  <music-list :title="title" :bg-img="bgImg" :songs="discSongs"></music-list>
</div>
</template>
<script>
import MusicList from '@/components/MusicList/MusicList'
import { mapGetters } from 'vuex'
import { getDiscSong } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImg() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() {
    return {
      discSongs: []
    }
  },
  methods: {
    _getDiscSong(dissid) {
      if (!dissid) {
        this.$router.push('/recommend')
      }
      getDiscSong(dissid).then(res => {
        if (res.code === ERR_OK) {
          this.discSongs = this._normalizeList(res.cdlist[0].songlist)
          console.log(this.discSongs)
        }
      })
    },
    _normalizeList(discSongs) {
      let ret = []
      discSongs.forEach((item) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  },
  created() {
    this._getDiscSong(this.disc.dissid)
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.disc {
    background: $color-background;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
