<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true,
        duration: 0 // 持续开启
      })
      try {
        // 日期格式需要修改一下
        const crtDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await editUserProfile({
          birthday: crtDate
        })
        // 更新视图
        this.$emit('input', crtDate)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
