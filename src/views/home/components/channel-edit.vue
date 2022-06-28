<template>
  <div class="channel-edit">
    <!-- 编辑频道 -->
    <van-cell title="我的频道" :border=false>
    <van-button type="danger" size="mini" plain round @click="isEdit = !isEdit">{{isEdit ? '完成':'编辑'}}</van-button>
    </van-cell>
   <van-grid :gutter="10" class="my-grid">
    <van-grid-item
    v-for="(channel,index) in myChannels"
    :key="index"
    @click="onMyChannelClick(channel,index)"
     >
     <span
     slot="text"
     class="text"
     :class="{active:index===active}"
     >
      {{channel.name}}
     </span>
     <van-icon slot="icon" name="clear" v-show="isEdit && !fixedChannels.includes(channel.id)"></van-icon>
     </van-grid-item>
   </van-grid>
    <!-- /编辑频道 -->
    <!-- 频道展示 -->
    <van-cell title="频道推荐" :border=false>
    </van-cell>
   <van-grid :gutter="10" class="recommend-grid">
    <van-grid-item
    v-for="(item,index) in recommendChannels"
    :key="index"
    :text="item.name"
    icon="plus"
    @click="addChannels(item)"
     />
   </van-grid>
    <!-- /频道展示 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制是否可编辑
      fixedChannels: [0] // 固定第一个频道,不允许被删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // 思路: 频道推荐内容 = 全部频道内容 - 我的频道内容
      // 方法二:
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
      // 方法一:
      // const channels = []
      // this.allChannels.forEach(channel => {
      //   const ret = this.myChannels.find(myChannel => {
      //     return myChannel.id === channel.id
      //   })
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async addChannels (channel) {
      // 将频道从推荐频道中添加到我的频道中
      // eslint-disable-next-line vue/no-mutating-props
      this.myChannels.push(channel)
      // 频道数据持久化(登录状态下/未登录状态下)
      if (this.user) {
        // 已登录状态下
        try {
          await addUserChannel([{
            id: channel.id,
            seq: this.myChannels.length
          }])
        } catch (error) {
          this.$toast('操作失败,请重试')
          console.log(error)
        }
      } else {
        // 未登录状态下
        setItem('TOUTIAO_PINDAO', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态下:点击删除
        if (this.fixedChannels.includes(channel.id)) {
          // 意思就是说,固定频道不让删(index是变化的,id是不变的),
          // 写死的要对应写死的,活的要对应活的,所以这里用id对应fixed里面的内容
          return
        }
        // eslint-disable-next-line vue/no-mutating-props
        this.myChannels.splice(index, 1)
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态下:点击跳转
        // 向父组件发送事件和参数
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      if (this.user) {
        // 已登录状态
        try {
          await deleteUserChannel(channel.id)
        } catch (error) {
          this.$toast('删除频道失败,请重试')
        }
      } else {
        // 未登录状态
        setItem('TOUTIAO_PINDAO', this.myChannels)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit{
  padding: 85px 0;
  .van-cell__title{
    font-size: 32px;
    color: #333333;
  }
  .van-button--mini{
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .van-grid-item{
    width: 160px;
    height: 86px;
    .van-grid-item__content{
      // 不允许折行
      white-space: nowrap;
       background-color: #f4f5f6;
       .van-grid-item__text,.text{
        font-size: 28px;
        color: #222;
        margin-top: 0;
       }
       .active{
        color: #f85959;
       }
       .van-grid-item__icon-wrapper{
        position: unset;
       }
    }
  }
  /deep/ .my-grid{
    .van-grid-item{
      .van-grid-item__content{
.van-icon-clear {
    font-size: 30px;
    position: absolute;
    top: -10px;
    right: -10px;
    color: #cacaca;
    z-index: 2;
      }
    }
   }
  }
  /deep/ .recommend-grid{
    .van-grid-item{
      .van-grid-item__content{
        flex-direction: row;
        .van-icon-plus{
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
