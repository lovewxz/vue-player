import { playMode } from '@/common/js/config'
import { loadStorage, loadPlayHistory, loadFavouriteList } from '@/common/js/cache'

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
  playHistory: loadPlayHistory(),
  favouriteList: loadFavouriteList()
}

export default state
