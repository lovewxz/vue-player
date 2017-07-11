import { getLyricApi } from '@/api/song'
import { ERR_OK } from '@/api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    img,
    url,
    duration,
    albummid
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.img = img
    this.url = url
    this.duration = duration
    this.albummid = albummid
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyricApi(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: _filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
    duration: musicData.interval,
    albummid: musicData.albummid
  })
}

function _filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
