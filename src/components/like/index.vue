<template>
  <van-icon
    :color="is_liked === 1 ? 'pink':'#777'"
    :name="is_liked === 1 ? 'good-job':'good-job-o'"
    @click="onLiked"
    :loading="isLoading"
      />
</template>

<script>
import { cancelLike, addLike } from '@/api/article'
export default {
  data () {
    return {
      isLoading: false
    }
  },
  name: 'Like',
  // v-model重命名
  model: {
    prop: 'is_liked',
    event: 'update-like-status'
  },
  props: {
    is_liked: {
      type: Number,
      required: true
    },
    art_id: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async onLiked () {
      this.isLoading = true
      try {
        let status = 0
        if (this.is_liked === 1) {
          // 取消点赞
          await cancelLike(this.art_id)
          status = -1
        } else {
          // 点赞
          await addLike(this.art_id)
          status = 1
        }
        this.$emit('update-like-status', status)
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    }
  }
}
</script>

<style>

</style>
