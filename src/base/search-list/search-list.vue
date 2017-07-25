<template>
<div class="search-list">
  <transition-group tag="ul" name="list-content-fade">
    <li class="search-item" v-for="item in searches" @click="selectItem(item)" :key="item">
      <span class="text">{{item}}</span>
      <span class="icon" @click.stop="deleteOne(item)">
        <i class="icon-delete"></i>
      </span>
    </li>
  </transition-group>
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
            &.list-content-fade-enter-active,
            &.list-content-fade-leave-active {
                transition: all 0.1s;
            }
            &.list-content-fade-enter,
            &.list-content-fade-leave-to {
                height: 0;
            }
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
