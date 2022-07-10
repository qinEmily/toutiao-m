<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="updateName"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
   <div class="field-wrap">
      <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入昵称"
      show-word-limit
    />
   </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  data () {
    return {
      message: this.userName
    }
  },
  model: {
    // 这里prop没有s
    prop: 'userName',
    event: 'reEditName'
  },
  props: {
    userName: {
      type: String,
      required: true
    }
  },
  methods: {
    async updateName () {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true,
        duration: 0 // 持续开启
      })
      try {
        if (!this.message.length) {
          this.$toast('昵称不能为空')
          return
        }
        await editUserProfile({
          name: this.message
        })
        // console.log(data)
        // 更新视图
        this.$emit('reEditName', this.message)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-name{
  /deep/.van-nav-bar__text{
    color: rgb(230, 172, 207);
  }
  .field-wrap{
    padding: 10px;
  }
}
</style>
