import { playMode } from '@/common/js/config'
import { loadStorage } from '@/common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: [],
  rankdetail: [],
  searchHistory: loadStorage()
}

export default state
