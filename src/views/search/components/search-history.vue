<template>
  <div class="history-container">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
      <span @click="$emit('deleteItemsAll')">全部删除</span>
      &nbsp;&nbsp;
      <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
      name="delete"
      class="delete-icon"
      v-else
      @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
    :title="item"
    v-for="(item,index) in searchHistories"
    :key="index"
    @click="onClickItem(item,index)"
    >
      <van-icon name="close" class="close-icon" v-show="isDeleteShow"/>
    </van-cell>
  </div>
</template>

<script>
import { removeItem } from '@/utils/storage'
export default {
  name: 'HistoryPage',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onClickItem (item, index) {
      if (this.isDeleteShow) {
        // 删除状态下，则点击删除
        // eslint-disable-next-line vue/no-mutating-props
        this.searchHistories.splice(index, 1)
        // 将数据同步到本地
        removeItem('TOUTIAO_SEARCH_HISTORIES', this.searchHistories)
      } else {
        // 非删除状态下则点击跳转
        this.$emit('resSearch', item)
      }
    }
  }
}
</script>

<style scoped></style>
