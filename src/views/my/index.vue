<template>
  <div class="my-container">
    <!-- 已登录页面 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image :src="userInfo.photo" round fit="cover" class="avatar" />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-info">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录页面 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img src="~@/assets/mobile.png" alt="">
        <span>登录/注册</span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知,小志同学,退出登录 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link/>
      <van-cell title="小智同学" is-link class="xiaozhi"/>
    </van-cell-group>
    <van-cell-group v-if="user">
      <van-cell title="退出登录" class="logout" clickable @click="onLogout"/>
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  created () {
    // 如果用户登陆了再加载
    if (this.user) {
      this.onloadUserInfo()
    }
  },
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onloadUserInfo () {
      try {
        const { data } = await getUserInfo()
        // console.log(data)
        this.userInfo = data.data
      } catch (error) {
        this.$toast('加载用户数据失败')
      }
    },
    onLogout () {
      this.$dialog.confirm({
        title: '确认退出?'
      })
        .then(() => {
          // 确认退出
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消退出
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-info {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span {
        font-size: 28px;
      }
    }
  }
  .logout{
    text-align: center;
    color: #d86262;
  }
  .xiaozhi{
    margin-bottom: 9px;
  }
}
</style>
