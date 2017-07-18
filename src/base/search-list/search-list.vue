<template>
<div class="search-list">
  <ul>
    <li class="search-item" v-for="item in searches" @click="selectItem(item)" :key="item">
      <span class="text">{{item}}</span>
      <span class="icon" @click.stop="deleteOne(item)">
        <i class="icon-delete"></i>
      </span>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('deleteOne', item)
    }
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";

.search-list {
    ul {
        .search-item {
            display: flex;
            align-items: center;
            height: 40px;
            overflow: hidden;
            .text {
                flex: 1;
                color: $color-text-l;
            }
            .icon {
                position: relative;
                .icon-delete {
                    font-size: 12px;
                    color: $color-text-d;
                }
            }
        }
    }
}
</style>
