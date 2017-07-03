<template>
<div class="player" v-show="playList.length > 0">
  <div class="normal-player" v-show="fullScreen">
    <div class="background">
      <img :src="currentSong.img" width="100%" height="100%">
    </div>
    <div class="top">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="title" v-html="currentSong.name"></div>
      <div class="subtitle" v-html="currentSong.singer"></div>
    </div>
    <div class="middle">
      <div class="middle-l">
        <div class="cd-wrapper">
          <div class="cd">
            <img :src="currentSong.img" class="image">
          </div>
        </div>
        <div class="playing-lyric-wrapper">
          <div class="playing-lyric"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="operators">
        <div class="icon i-left">
          <i class="icon-sequence"></i>
        </div>
        <div class="icon i-left">
          <i class="icon-prev"></i>
        </div>
        <div class="icon i-center">
          <i class="icon-play"></i>
        </div>
        <div class="icon i-right">
          <i class="icon-next"></i>
        </div>
        <div class="icon i-right">
          <i class="icon-favorite"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="mini-player" v-show="!fullScreen">
    <div class="icon">
      <img :src="currentSong.img" alt="" width="40" height="40">
    </div>
    <div class="text">
      <h2 class="name" v-html="currentSong.name"></h2>
      <p class="desc" v-html="currentSong.singer"></p>
    </div>
    <div class="control">
      <i class="icon-mini"></i>
    </div>
    <div class="control">
      <i class="icon-playlist"></i>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong'
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN'
    })
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";
@import "../../common/scss/mixin";

.player {
    .normal-player {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;
        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }
        .top {
            position: relative;
            margin-bottom: 25px;
            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: 22px;
                    color: $color-theme;
                    transform: rotate(-90deg);
                }
            }
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 18px;
                color: $color-text;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                color: $color-text;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        position: relative;
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .operators {
                display: flex;
                align-items: center;
                justify-content: center;
                .icon {
                    flex: 1;
                    color: $color-theme;
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-favorite {
                    color: $color-theme;
                }
            }
        }
    }
    .mini-player {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-highlight-background;
        .icon {
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;
            img {
                border-radius: 50%;
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name {
                margin-bottom: 2px;
                @include no-wrap();
                font-size: 14px;
                color: $color-text;
            }
            .desc {
                @include no-wrap();
                font-size: 12px;
                color: $color-text-d;
            }
        }
        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-pause-mini,
            .icon-play-mini,
            .icon-playlist {
                font-size: 30px;
                color: $color-theme-d;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
</style>
