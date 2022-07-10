<template>
<van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <cmt-item
  v-for="(item,index) in list"
  :key="index"
  :comment="item"
  @reply-show="$emit('reply-show',$event)"
   />
</van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CmtItem from '../CmtItem.vue'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'a',
      // 校验一下传进来的字符串必须是a或者c，a是文章评论，c是评论互评
      validator (value) {
        return ['a', 'c'].includes(value)
      }
    }
  },
  components: {
    CmtItem
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        const { data } = await getComments({
          type: this.type,
          source: this.source,
          offset: this.offset,
          limit: 10
        })
        const { results } = data.data
        // 更新到列表
        // eslint-disable-next-line vue/no-mutating-props
        this.list.push(...results)
        // 加载状态结束
        this.loading = false
        // console.log(data)
        // 判断数据是否全部加载完
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (error) {
        this.$toast('获取评论列表失败')
      }
    }
  }
}
</script>

<style>

</style>
