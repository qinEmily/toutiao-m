<template>
  <div class="update-gender">
    <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    :default-index="this.value"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女']
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm (value, index) {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true,
        duration: 0 // 持续开启
      })
      // index 0男 1女
      try {
        await editUserProfile({
          gender: index
        })
        // 更新视图
        this.$emit('input', index)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    },
    onCancel () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.update-gender{

}
</style>
