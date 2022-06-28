<template>
  <div class="article-list">
  <van-pull-refresh
  v-model="refreshing"
  @refresh="onRefresh"
  :success-text="refreshText"
  success-duration="1000"
  >
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :error.sync="error"
  error-text="请求失败，点击重新加载"
>
  <article-item v-for="(item,index) in list" :key="index" :article="item"></article-item>
  </van-list>
  </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      refreshing: false,
      refreshText: '刷新成功'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1.异步更新数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 2.加载状态结束
        this.loading = false
        // 3.判断数据是否全部加载完成
        if (results.length) {
          // 未全部加载完成则请求下一页
          this.timestamp = data.data.pre_timestamp
        } else {
          // 数据全部加载完成
          this.finished = true
        }
      } catch (error) {
        // 请求失败了展示错误信息
        this.error = true
        // 请求失败了loading也需要关闭
        this.loading = false
      }
    },
    async onRefresh () {
      try {
        // 1.异步更新数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新每次都要的是最新数据,所以是Date.now()
          with_top: 1
        })
        const { results } = data.data
        // 2.从上面追加更新的文章
        this.list.unshift(...results)
        // 3.加载状态结束,关闭下拉刷新
        this.refreshing = false
        // 提示成功信息
        this.refreshText = `成功加载出${results.length}条数据`
      } catch (error) {
        // 加载失败关闭下拉刷新
        this.refreshing = false
        // 提示失败信息
        this.refreshText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list{
  height: 79vh;
  overflow: auto;
}
</style>
