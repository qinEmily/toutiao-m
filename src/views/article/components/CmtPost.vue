<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="postComment"
      :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
import { addComments } from '@/api/article'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target_id: {
      type: [String, Number],
      required: true
    },
    art_id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async postComment () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const { data } = await addComments({
          target: this.target_id,
          content: this.message,
          art_id: this.art_id
        })
        // console.log(data)
        this.$emit('update-cmtList', data.data)
        // 发送成功后，清空留言板
        this.message = ''
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
