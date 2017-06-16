<template>
<scroll class="listview" :data="data" ref="listview" @scroll="scroll" :probeType="probeType" :listen-scroll="listenScroll">
  <ul>
    <li class="list-group" v-for="group in data" ref="listgroup">
      <h2 class="list-group-title">{{group.title}}</h2>
      <ul>
        <li class="list-group-item" v-for="(singer,index) in group.items" :key="index" @click="selectItem(singer)">
          <img v-lazy="singer.avatar" :alt="singer.name" class="avatar">
          <span class="text">{{singer.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="list-shortcut">
    <ul>
      <li class="list-shortcut-item" v-for="(item,index) in listShortcut" :data-index="index" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" :class="{current: currentIndex === index}">
        {{item}}
      </li>
    </ul>
  </div>
  <div class="list-fixed" v-show="fixedTitle">
    <h2 class="list-fixed-title" ref="fixed">{{fixedTitle}}</h2>
  </div>
  <div class="loading-wrapper" v-show="!data.length">
    <loading></loading>
  </div>
</scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {
  getData
} from '@/common/js/dom'

const ANCHOR_HEIGHT = 18
const FIX_TITLE_HEIGHT = 30

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    this.firstTouch = {}
    this.probeType = 3
    this.listHeight = []
    this.listenScroll = true
  },
  computed: {
    listShortcut() {
      return this.data.map((item) => {
        return item.title.substring(0, 1)
      })
    },
    fixedTitle() {
      // 当往上滑动的时候，fix布局的DOM消失，不然会重复
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
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
      let delta = Math.floor((this.firstTouch.y2 - this.firstTouch.y1) / ANCHOR_HEIGHT) // 计算第一次和滑动到最后之间的差值
      let anchorIndex = parseInt(this.anchorIndex) + delta // 获取到最后的索引位置
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    _scrollTo(index) {
      if (index !== 0 && !index) {
        return
      }
      if (index < 0) {
        index = 0
      }
      if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0) // 滚动到指定element的位置
    },
    _calculateHeight() {
      this.listHeight = []
      let list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      let listHeight = this.listHeight
      // 顶部滑动，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 中间滑动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 这里实际为height2 - (-newY),因为newY是负值，所以是+，这边可以算出上限值减去当前滚动位置之间的差值
        this.diff = height2 + newY
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      // 底部滑动
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixTop = (newVal > 0 && newVal < FIX_TITLE_HEIGHT) ? newVal - FIX_TITLE_HEIGHT : 0
      if (this.fixTop === fixTop) {
        return
      }
      this.fixTop = fixTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss">
@import 'listview';
</style>
