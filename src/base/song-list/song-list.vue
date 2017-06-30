<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="song in songs">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{songDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    songDesc(song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 14px;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: $color-text;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
