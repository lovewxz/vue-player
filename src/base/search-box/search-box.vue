<template>
<div class="search-box">
  <i class="icon-search"></i>
  <input type="text" class="box" :placeholder="placeholder" v-model="query">
  <i class="icon-dismiss" v-show="query" @click="clear"></i>
</div>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(hotKey) {
      this.query = hotKey
    }
  },
  created() {
    this.$watch('query', (newVal) => {
      this.$emit('query', newVal)
    })
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-highlight-background;
    .icon-search {
        font-size: 24px;
        color: $color-background;
    }
    .icon-dismiss {
        font-size: 16px;
        color: $color-background;
    }
    .box {
        flex: 1;
        margin: 0 5px;
        line-height: 18px;
        background: $color-highlight-background;
        color: #fff;
        font-size: 14px;
        outline: 0;
    }
}
</style>
