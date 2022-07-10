<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="userProfile.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="userProfile.name" is-link @click="isEditNameShow = true"/>
    <van-cell title="性别" :value="userProfile.gender===0?'男':'女'" is-link @click="isEditGenderShow = true"/>
    <van-cell title="生日" :value="userProfile.birthday" is-link @click="isEditBirShow = true"/>
    <!-- /个人信息 -->
    <!-- 编辑资料 -->
    <!-- 昵称 -->
    <van-popup v-model="isEditNameShow" position="bottom" style="height:100%">
      <update-name
      @close="isEditNameShow = false"
      v-model="userProfile.name"
      v-if="isEditNameShow"
      ></update-name>
    </van-popup>
    <!-- /昵称 -->
    <!-- 性别 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <update-gender
      v-model="userProfile.gender"
      v-if="isEditGenderShow"
      @close="isEditGenderShow= false"
      ></update-gender>
    </van-popup>
    <!-- /性别 -->
    <!-- 生日 -->
    <van-popup v-model="isEditBirShow" position="bottom">
      <update-birthday
      v-model="userProfile.birthday"
      v-if="isEditBirShow"
      @close="isEditBirShow= false"
      ></update-birthday>
    </van-popup>
    <!-- /生日 -->
    <!-- 头像图片 -->
    <!-- 思路是写一个隐藏起来的input文件框，再通过在正确位置的点击事件通过ref调用input框的点击事件，调用文件选择的功能,最后通过input框的change事件调用弹出层 -->
    <input type="file" hidden ref="file" @change="onChangeImg">
    <van-popup v-model="isEditAvatarShow" position="bottom" style="height:100%">
      <update-avatar
      :img="avatarImg"
      v-if="isEditAvatarShow"
      @close="isEditAvatarShow=false"
      @update-avatar="userProfile.photo=$event"
      ></update-avatar>
    </van-popup>
    <!-- /头像图片 -->
    <!-- /编辑资料 -->
  </div>
</template>

<script>
import UpdateName from './commponents/update-name.vue'
import UpdateGender from './commponents/update-gender.vue'
import UpdateBirthday from './commponents/update-birthday.vue'
import UpdateAvatar from './commponents/update-avatar.vue'
import { getUserProfile } from '@/api/user'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar
  },
  props: {},
  data () {
    return {
      isEditNameShow: false,
      isEditGenderShow: false,
      isEditBirShow: false,
      isEditAvatarShow: false,
      avatarImg: null,
      userProfile: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.userProfile = data.data
    },
    onChangeImg () {
      // console.log(this.$refs.file, 999)
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // console.log(file)
      // 基于文件对象获取blob数据
      this.avatarImg = window.URL.createObjectURL(file)
      // 展示图片预览弹出层
      this.isEditAvatarShow = true
      // file-input 如果两次选择同一个文件，第二次不会触发change事件。
      // 解决办法是每次使用完毕将其value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
    /deep/.van-popup{
    background-color:#f5f7f9;
  }
}
</style>
