import { playMode } from '@/common/js/config'
import { loadStorage, loadPlayHistory } from '@/common/js/cache'

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
  searchHistory: loadStorage(),
  playHistory: loadPlayHistory()
}

export default state
