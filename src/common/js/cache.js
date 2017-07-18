import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_SEARCH_KEY_LEN = 15

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
  let index = searches.findIndex((item) => {
    return item === query
  })
  if (index > -1) {
    searches.splice(index, 1)
  }
  storage.set(SEARCH_KEY, searches)
  return searches
}
