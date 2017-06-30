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
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.albumid,
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
