<template lang="html">
  <div class="recommend">
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
    </div>
  </div>
</template>

<script>
import {
  getRecommend
} from '@/api/recommend'
import {
  ERR_OK
} from '@/api/config'
import slider from '@/base/slider/slider'

export default {
  data() {
    return {
      recommends: []
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    }
  },
  components: {
    slider
  }
}
</script>

<style lang="scss">
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .slider-wrapper {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
}
</style>
