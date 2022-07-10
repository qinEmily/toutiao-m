<template>
  <van-button
  class="follow-btn"
  type="info"
  color="#3296fa"
  round size="small"
  icon="plus"
  v-if="!is_followed"
  @click="onFollow"
  :loading="isFollowLoading"
  >关注</van-button>
  <van-button
  class="follow-btn"
  round size="small"
  v-else
  @click="onFollow"
  :loading="isFollowLoading"
  >已关注</van-button>
</template>

<script>
import { addUser, deleteUser } from '@/api/user'
export default {
  name: 'FollowUser',
  data () {
    return {
      isFollowLoading: false
    }
  },
  props: {
    is_followed: {
      type: Boolean,
      required: true
    },
    aut_id: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    async onFollow () {
      // 点击后显示加载中
      this.isFollowLoading = true
      // 用户点击关注或者取消关注
      try {
        if (this.is_followed) {
        // 已关注状态，点击取消
          await deleteUser(this.aut_id)
        } else {
        // 未关注状态，点击添加关注
          await addUser(this.aut_id)
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-follow-user', !this.is_followed)
      } catch (error) {
        let message = '操作失败，请重试'
        if (error.response && error.response.status === 400) {
          message = '你不能关注你自己哦！'
        }
        this.$toast(message)
      }
      // 数据请求完成后关闭加载中
      this.isFollowLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
