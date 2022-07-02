<template>
  <div class="search-container">
    <form action="/" class="search-box">
      <van-search
      v-model="searchText"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
      background="#3d9dfc"
      @focus="isResultsShow = false"
      />
      <!-- 这里的@focus是希望再次获取焦点的时候搜索结果消失跳转到联想提示页面 -->
    </form>
    <!-- 首先留下历史记录，用户输入内容显示联想建议，提交后显示结果，再次获取焦点切换到联想建议 -->
    <result
    v-if="isResultsShow"
    :searchText = "searchText"
    ></result>
    <suggestion
    v-else-if="searchText"
    :searchText="searchText"
    @sugSearch="onSearch"
    ></suggestion>
    <history
    :search-histories="searchHistories"
    @resSearch="onSearch"
    @deleteItemsAll="searchHistories=[]"
    v-else
    ></history>
  </div>
</template>

<script>
import Suggestion from './components/search-suggestion.vue'
import History from './components/search-history.vue'
import Result from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    Suggestion,
    History,
    Result
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultsShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onSearch (val) {
      // console.log(val)
      // 更新搜索框的文本，比如点击联想建议时更新为联想建议
      this.searchText = val
      // 提交搜索键之后显示result
      this.isResultsShow = true
      // 搜索后添加到历史记录(1.不可重复2.最新的在前)
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 说明该搜索记录在历史记录中已经出现过了
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 将数据同步到本地
      setItem('TOUTIAO_SEARCH_HISTORIES', this.searchHistories)
    },
    onCancel () {
      // console.log('取消')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container{
  padding-top: 108px;
  /deep/.search-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
   .van-search__action{
    color: #fff;
}
}
</style>
