<template>
<div class="song-list">
  <ul>
    <li class="item" v-for="(song,index) in songs" @click="selectItem(song,index)">
      <div class="rank-icon" v-if="rank">
        <span class="icon" :class="rankCls(index)">{{rankText(index)}}</span>
      </div>
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
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    songDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
    },
    rankCls(index) {
      if (index <= 2) {
        return `icon${index}`
      } else {
        return 'text'
      }
    },
    rankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable';
@import '../../common/scss/mixin';

.song-list {
    .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: 14px;
        .rank-icon {
            flex: 0 0 25px;
            width: 25px;
            margin-right: 30px;
            text-align: center;
            .icon {
                display: inline-block;
                width: 25px;
                height: 24px;
                background-size: 25px 24px;
                &.icon0 {
                    @include bg-image( 'first');
                }
                &.icon1 {
                    @include bg-image( 'second');
                }
                &.icon2 {
                    @include bg-image( 'third');
                }
            }
            .text {
                color: $color-theme;
                font-size: 18px;
            }
        }
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
