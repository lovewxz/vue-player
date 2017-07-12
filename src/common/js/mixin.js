import { mapGetters } from 'vuex'

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
