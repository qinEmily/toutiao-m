<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- +关注or已关注 -->
          <follow-user
          :is_followed="article.is_followed"
          :aut_id="article.aut_id"
          @update-follow-user="article.is_followed = $event"
          ></follow-user>
          <!-- <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            v-if="!article.is_followed"
            @click="onFollow"
            :loading="isFollowLoading"
          >关注</van-button>
          <van-button
            class="follow-btn"
            round
            size="small"
            v-else
            @click="onFollow"
            :loading="isFollowLoading"
          >已关注</van-button> -->
          <!--/+关注or已关注(已封装到单独组件) -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论区 -->
        <CommentList
        :source="article.art_id"
        :list ="commentList"
        @reply-show="onReplyClick"
        ></CommentList>
        <!-- 评论区 -->
        <!-- 留言板弹出层 -->
        <van-popup v-model="isPopShow" position="bottom">
          <comment-post
          :target_id="article.art_id"
          @update-cmtList="postCmt"
          ></comment-post>
        </van-popup>
        <!-- /留言板弹出层 -->
        <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="showPopup"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        :badge="article.comm_count"
        color="#777"
      />
      <Collect-Star
      v-model="article.is_collected"
      :art_id="article.art_id"
      />
      <!-- <van-icon
        color="#777"
        name="star-o"
      /> -->
      <Like
      v-model="article.attitude"
      :art_id="article.art_id"
      ></Like>
      <!-- <van-icon
        color="#777"
        name="good-job-o"
      /> -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="onloadArticleItem">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论de回复 -->
    <!-- popup弹出层是懒渲染，只有第一次打开时会更新里面的内容，以后只有关闭和弹出功能 -->
        <van-popup
          v-model="isReplyShow"
          position="bottom"
          style="height: 100%"
        >
        <!-- 用v-if解决pop弹出层懒加载的问题,随着pop弹层的出现重新渲染一次内部组件 -->
          <comment-reply
          v-if="isReplyShow"
          :currentComment = "currentComment"
          @closeReply="isReplyShow=false"
          ></comment-reply>
        </van-popup>
        <!-- /评论de回复    -->
  </div>
</template>

<script>
import { getArticleItem } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user-btn'
import CollectStar from '@/components/collect-star'
import Like from '@/components/like'
import CommentList from './components/comments-list'
import CommentPost from './components/CmtPost.vue'
import CommentReply from './components/CmtReply.vue'
export default {
  name: 'ArticleIndex',
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
    FollowUser,
    CollectStar,
    Like,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      // 接收每篇文章的id数据，提高复用性，需要在router中设置props ：true，开启路由传参
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {},
      isLoading: true, // 控制加载中是否出现
      errorStatus: 0, // 控制错误类型
      isPopShow: false, // 文章评论弹层
      commentList: [], // 文章评论列表
      isReplyShow: false, // 回复评论弹层
      currentComment: {} // 当前评论项
    }
  },
  computed: {},
  watch: {},
  created () {
    this.onloadArticleItem()
  },
  mounted () {},
  methods: {
    async onloadArticleItem () {
      this.isLoading = true
      try {
        // 模拟随机加载失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('dscghdsrg')
        // }
        const { data } = await getArticleItem(this.articleId)
        // console.log(data)
        this.article = data.data
        this.isLoading = false
        // 加载文章数据成功后，获取article.content中的image节点
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response && error.response.status === 404) {
          this.errorStatus = 404
        }
      }
    },
    previewImage () {
      // 拿到article.content内容
      const articleContent = this.$refs['article-content']
      // 获取所有的img节点
      const imgs = articleContent.querySelectorAll('img')
      // 获取每张图片地址并给图片添加点击事件
      const imgUrl = []
      imgs.forEach((img, index) => {
        imgUrl.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images: imgUrl,
            // 图片起始位置
            startPosition: index
          })
        }
      })
      // console.log(imgUrl)
    },
    showPopup () {
      // 控制留言板的弹出
      this.isPopShow = true
    },
    postCmt (e) {
      // 添加新评论
      this.commentList.unshift(e.new_obj)
      // 关闭弹出层
      this.isPopShow = false
      // 更新视图
      this.article.comm_count++
    },
    onReplyClick (comment) {
      // 关于互评弹出层
      this.isReplyShow = true
      // console.log(comment) comment是子组件CmtItem发送过来的当前评论项的数据
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  /deep/ .van-nav-bar .van-icon{
    color:#fff;
  }
}
</style>
