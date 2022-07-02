<template>
  <div class="home-container">
     <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
 <van-tabs v-model="active" swipeable class="channel-tabs">
  <van-tab :title="channel.name"
  v-for="channel in channels"
  :key="channel.id">
  <article-list :channel="channel"></article-list>
  </van-tab>
  <div class="placeholder" slot="nav-right"></div>
  <div class="hamburger-btn" slot="nav-right" @click="isChannelEditShow = true">
    <i class="toutiao toutiao-gengduo"></i>
  </div>
 </van-tabs>
<!-- 频道列表 -->
<!-- 弹出层 -->
<van-popup
  v-model="isChannelEditShow"
  closeable
  close-icon-position="top-left"
  position="bottom"
  :style="{ height: '100%' }"
>
<channel-edit
:my-channels="channels"
:active = "active"
@update-active = "onUpdateActive"
></channel-edit>
</van-popup>
<!-- /弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      // 思路:1.已登录 2.未登录 a.有本地储存 b.没有本地储存
      if (this.user) {
        // 1.已登录
        try {
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } catch (error) {
          this.$toast('获取频道数据失败')
        }
      } else {
        // 2.未登录
        const localChannels = getItem('TOUTIAO_PINDAO')
        if (localChannels) {
          // a.有本地储存
          this.channels = localChannels
        } else {
          // b.没有本地储存
          try {
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          } catch (error) {
            this.$toast('获取频道数据失败')
          }
        }
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // 修改active,控制显示页面
      this.active = index
      // 关闭弹出层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
 /deep/  .van-nav-bar__title {
  // 取消max-width的设置
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
 /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3
    }
    .van-tab--active {
      color: #333
    }
    .van-tabs__nav{
      padding-bottom: 0
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
      // 0 不参与flex布局, 1 参与
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
