function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice() // 不改变原数组
  for (let i = 0; i < _arr.length; i++) {
    let j = _getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/**
 * 截流函数
 * @param  {[func]} func  [传入函数]
 * @param  {[number]} delay [延迟时间]
 * @return {[func]}
 */
export function debounce(func, delay) {
  let timer
  // 传入一个函数，返回一个函数就是函数的柯里化
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
