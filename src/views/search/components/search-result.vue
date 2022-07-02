<template>
  <div class="result-container">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
     error-text="请求失败，点击重新加载"
    @load="onLoad">
      <van-cell
      v-for="(item,index) in list"
      :key="index"
      :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'ResultPage',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: 20,
          q: this.searchText
        })
        // console.log(data)
        const { results } = data.data
        // 注意这里要用展开运算符
        this.list.push(...results)
        // 加载状态结束
        this.loading = false
        // 判断是否还有剩余内容
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
      // 数据全部加载完成
    }
  }
}
</script>

<style scoped></style>
