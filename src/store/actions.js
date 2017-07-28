import * as types from './mutation-types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
import { setStorage, deleteOne, clearHistory, setPlayHistory, setFavouriteList, cancelFavouriteList } from '@/common/js/cache'

function _findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    index = _findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENTINDEX, index)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_MODE, playMode.random)
}

export const insertSong = function ({ commit, state }, song) {
  let currentIndex = state.currentIndex
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentSong = playList[currentIndex]
  let fpIndex = _findIndex(playList, song) // 查找插入的歌曲在列表中的位置
  currentIndex++ // 插入到当前索引+1的位置
  playList.splice(currentIndex, 0, song)
  // 如果当前列表中存在插入的歌曲
  if (fpIndex > -1) {
    // 如果当前的索引大于原先的位置
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let fsIndex = _findIndex(sequenceList, song)
  let currentSIndex = _findIndex(sequenceList, currentSong) + 1
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENTINDEX, currentIndex)
}

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, setStorage(query))
}

export const deleteOneSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteOne(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearHistory())
}

export const deleteOneSong = function ({ commit, state }, song) {
  let currentIndex = state.currentIndex
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let fpIndex = _findIndex(playList, song)
  playList.splice(fpIndex, 1)
  let fsIndex = _findIndex(sequenceList, song)
  sequenceList.splice(fsIndex, 1)
  if (currentIndex > fpIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_CURRENTINDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  let playstate = playList.length > 0
  commit(types.SET_PLAYING, playstate)
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_CURRENTINDEX, -1)
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_PLAYING, false)
}

export const savePlayHistory = function ({ commit }, song) {
  commit(types.SET_PLAYHISTORY, setPlayHistory(song))
}

export const saveFavourite = function ({ commit }, song) {
  commit(types.SET_FAVOURITELIST, setFavouriteList(song))
}

export const cancelFavourite = function ({ commit }, song) {
  commit(types.SET_FAVOURITELIST, cancelFavouriteList(song))
}
