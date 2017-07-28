import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_SEARCH_KEY_LEN = 15

const PLAY_KEY = '__play__'
const MAX_PLAY_KEY_LEN = 200

const FAVOURITE_KEY = '__favourite__'
const MAX_FAVOURITE_KEY_LEN = 200

/**
 * 使用storage库处理历史记录
 * @param  {Array} arr     [存储数组]
 * @param  {String} val     [存储的值]
 * @param  {Function} compare [获取索引函数]
 * @param  {Number} maxlen  [最大长度]
 * @return
 */
function _insert(arr, val, compare, maxlen) {
  let index = arr.findIndex(compare)
  // 如果索引为0
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function _delete(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function setStorage(query) {
  let searches = storage.get(SEARCH_KEY, [])
  _insert(searches, query, (item) => {
    return item === query
  }, MAX_SEARCH_KEY_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadStorage() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteOne(query) {
  let searches = storage.get(SEARCH_KEY, [])
  _delete(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearHistory() {
  storage.clear()
  return []
}

export function setPlayHistory(song) {
  let play = storage.get(PLAY_KEY, [])
  _insert(play, song, (item) => {
    return item.id === song.id
  }, MAX_PLAY_KEY_LEN)
  storage.set(PLAY_KEY, play)
  return play
}

export function loadPlayHistory() {
  return storage.get(PLAY_KEY, [])
}

export function setFavouriteList(song) {
  let list = storage.get(FAVOURITE_KEY, [])
  _insert(list, song, (item) => {
    return item.id === song.id
  }, MAX_FAVOURITE_KEY_LEN)
  storage.set(FAVOURITE_KEY, list)
  return list
}

export function loadFavouriteList() {
  return storage.get(FAVOURITE_KEY, [])
}

export function cancelFavouriteList(song) {
  let list = storage.get(FAVOURITE_KEY, [])
  _delete(list, (item) => {
    return item.id === song.id
  })
  storage.set(FAVOURITE_KEY, list)
  return list
}
