<template lang="html">
  <div class="recommend">
    <scroll :data="discList">
      <div class="recommend-content">
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList">
              <div class="icon">
                <img :src="item.imgurl" alt="" width="60" height="60">
              </div>
              <div class="text">
                <div class="name" v-html="item.creator.name"></div>
                <div class="desc" v-html="item.dissname"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from '@/base/scroll/scroll'
import {
  getRecommend,
  getDiscList
} from '@/api/recommend'
import {
  ERR_OK
} from '@/api/config'
import slider from '@/base/slider/slider'

export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    }
  },
  components: {
    slider,
    scroll
  }
}
</script>

<style lang="scss">
@import '../../components/Recommend/Recommend.scss';
</style>
