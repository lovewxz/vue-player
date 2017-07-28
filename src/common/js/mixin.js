import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlerPlayList(this.playList)
  },
  activated() {
    this.handlerPlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlerPlayList(newVal)
    }
  },
  methods: {
    handlerPlayList() {
      throw new Error('component must be im handlerPlayList method')
    }
  }
}

export const playerMixin = {
  computed: {
    modeIcon() {
      return this.mode === playMode.random ? 'icon-random' : this.mode === playMode.sequence ? 'icon-sequence' : 'icon-loop'
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'favouriteList'
    ])
  },
  methods: {
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavouriteIcon(song) {
      if (this.isFavourite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavourite(song) {
      if (this.isFavourite(song)) {
        this.cancelFavourite(song)
      } else {
        this.saveFavourite(song)
      }
    },
    isFavourite(song) {
      let index = this.favouriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENTINDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavourite',
      'cancelFavourite'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      delayRefresh: 200,
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    setQuery(item) {
      this.$refs.searchBox.setQuery(item)
    },
    getQuery(query) {
      this.query = query
    },
    save() {
      this.saveSearchHistory(this.query)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteOneSearchHistory'
    ])
  }
}
