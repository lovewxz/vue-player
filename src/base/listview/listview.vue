<template>
<scroll class="listview" :data="data" ref="listview">
  <ul>
    <li class="list-group" v-for="group in data" ref="listgroup">
      <h2 class="list-group-title">{{group.title}}</h2>
      <ul>
        <li class="list-group-item" v-for="(singer,index) in group.items" :key="index">
          <img v-lazy="singer.avatar" :alt="singer.name" class="avatar">
          <span class="text">{{singer.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="list-shortcut">
    <ul>
      <li class="list-shortcut-item" v-for="(item,index) in listShortcut" :data-index="index" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove">
        {{item}}
      </li>
    </ul>
  </div>
</scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import {
  getData
} from '@/common/js/dom'

const ANCHOR_HEIGHT = 18
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    this.firstTouch = {}
  },
  computed: {
    listShortcut() {
      return this.data.map((item) => {
        return item.title.substring(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index') // 获取锚点的索引
      let firstTouch = e.touches[0] // 获取第一次点击的X和Y轴
      this.firstTouch.y1 = firstTouch.pageY // 获取第一次点击的Y轴
      this.anchorIndex = anchorIndex // 存储第一次点击的锚点的索引
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.firstTouch.y2 = firstTouch.pageY
      let delta = Math.floor((this.firstTouch.y2 - this.firstTouch.y1) / ANCHOR_HEIGHT)  // 计算第一次和滑动到最后之间的差值
      let anchorIndex = parseInt(this.anchorIndex) + delta // 获取到最后的索引位置
      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0) // 滚动到指定element的位置
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss">
@import '../../base/listview/listview';
</style>
