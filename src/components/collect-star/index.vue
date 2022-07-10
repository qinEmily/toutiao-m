<template>
  <van-icon
    :color="is_collected ? 'yellow':'#777'"
    :name="is_collected ? 'star':'star-o'"
    @click="onCollected"
    :loading="isLoading"
      />
</template>

<script>
import { addCollect, cancelCollect } from '@/api/article'
export default {
  data () {
    return {
      isLoading: false
    }
  },
  name: 'CollectStar',
  // v-model重命名
  model: {
    prop: 'is_collected',
    event: 'update-collect-status'
  },
  props: {
    is_collected: {
      type: Boolean,
      required: true
    },
    art_id: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    async onCollected () {
      this.isLoading = true
      try {
        if (this.is_collected) {
          await cancelCollect(this.art_id)
        } else {
          await addCollect(this.art_id)
        }
        this.$toast.success(this.is_collected ? '取消收藏成功' : '收藏成功')
        // 更新视图
        this.$emit('update-collect-status', !this.is_collected)
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败，请重试')
      }
      this.isLoading = false
    }
  }
}
</script>

<style>

</style>
