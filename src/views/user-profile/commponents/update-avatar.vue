<template>
  <div class="update-avatar">
    <img
     :src="img"
     ref="preAvatar"
   />
   <div class="tool-bar">
    <div class="cancel" @click="$emit('close')">取消</div>
    <div class="confirm" @click="onConfirm">完成</div>
   </div>
  </div>
</template>

<script>
// 引入裁剪图片的包
import 'cropperjs/dist/cropper.css' // 加载 css 脚本
import Cropper from 'cropperjs'
import { editUserPhoto } from '@/api/user'
export default {
  name: 'UpdateAvatar',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: {
        type: String,
        default: null
      }
    }
  },
  mounted () {
    const image = this.$refs.preAvatar
    // 生成 cropper  实例对象
    this.cropper = new Cropper(image, {
      // cropper 使用说明文档：https://github.com/fengyuanchen/cropperjs
      // aspectRatio: 16 / 9,
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    // 裁剪图片的保存更新：
    // 1、(将参数传给后端进行处理，常用于 PC 端处理图片的方式)如果是基于服务端的裁切，
    //    则使用：getData 方法，该方法得到裁切的区域参数。this.cropper.getData()
    // 2、(前端处理，不同PC端浏览器有兼容性问题；移动端无兼容性问题)如果是纯客户端的图片裁切，
    //    则使用：getCroppedCanvas 方法，
    //    该方法得到裁切之后的图片对象（类似于URL.createObjectURL 方法得到的文件对象）。
  },
  methods: {
    onConfirm () {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '修改中',
        forbidClick: true,
        duration: 0 // 持续开启
      })
      // 如果 Content-Type 要求是application/json，则 data 传普通对象 {}
      // 如果 Content-Type 要求是multipart/form-data，则 data 传 FormData 对象
      // 纵观所有数据接口，你会发现大多数的接口都要求 Content-Type 要求是application/json
      // 一般只有涉及到文件上传的数据接口才要求Content-Type 要求是multipart/form-data
      // 这个时候传递一个 FormData 对象
      const formData = new FormData()
      formData.append('photo', blob) // 这个photo是后端要求的名称
      try {
        const { data } = await editUserPhoto(formData)
        console.log(data)
        this.$toast.success('修改成功')
        // 更新视图
        this.$emit('update-avatar', data.data.photo)
        this.$emit('close')
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-avatar{
  background-color: #000;
  height: 100%;
  img{
    max-width: 100%;
    display: block;
  }
  .tool-bar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm{
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
