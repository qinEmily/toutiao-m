<template>
  <div class="login-container">
  <!-- 导航栏 -->
  <van-nav-bar
  title="登录"
  class="page-nav-bar"
  left-arrow
  @click-left="onClickLeft"/>
  <!-- 表单 -->
  <van-form @submit="onSubmit" ref="loginForm">
  <van-field
    v-model="user.mobile"
    name="mobile"
    placeholder="请输入手机号"
    :rules="userFormRules.mobile"
    type="number"
    maxlength="11"
  >
  <i slot="left-icon" class="toutiao toutiao-shouji"></i>
  </van-field>
  <van-field
    v-model="user.code"
    name="code"
    placeholder="请输入验证码"
    :rules="userFormRules.code"
    type="number"
    maxlength="6"
  >
  <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
  <template #button>
    <!-- 倒计时效果 -->
    <van-count-down
    :time="1000 * 5"
    format="ss s"
    v-if="isCountdownShow"
    @finish="isCountdownShow = false"
    />
    <van-button
    v-else
    size="small"
    type="default"
    round
    class="send-msg-btn"
    @click="sendMsg"
    native-type="button"
    >获取验证码</van-button>
  </template>
  </van-field>
  <div class="login-btn-wrap">
    <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import { login, sendSmsg } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      isCountdownShow: false,
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      userFormRules: {
        mobile: [{ required: true, message: '请输入手机号' },
          {
            pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误'
          }
        ],
        code: [{ required: true, message: '请输入验证码' },
          {
            pattern: /^\d{6}$/, message: '验证码格式错误'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      const user = this.user
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0 // 默认为两秒,如果为0则持续展示
        // 禁用背景点击
      })
      try {
        const { data } = await login(user)
        // console.log(data.data)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功后跳转回上一个页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号码或者验证码错误')
        } else {
          this.$toast.fail('登陆失败', err)
        }
      }
    },
    async sendMsg () {
      // 1.检验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return console.log('获取验证码失败', error)
      }
      // 2.倒计时效果
      this.isCountdownShow = true
      // 3.发送验证码
      try {
        await sendSmsg(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        this.isCountdownShow = false
        if (error.response.status === 429) {
          this.$toast('操作频繁,请稍后再试')
        } else {
          this.$toast('发送失败 ')
        }
      }
    },
    onClickLeft () {
      // 点击返回上一页
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">

.login-container {
  .toutiao {
   font-size: 37px;
  }

 /deep/.send-msg-btn{
   background-color: #ededed;
   width: 153px;
   height: 46px;
   line-height: 46px;
   color: #666;
   font-size: 22px;
  }
  .login-btn-wrap{
    padding: 53px 33px;
    .login-btn{
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
