<template>
<div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="currentComment.reply_count===0?`暂无回复`:`${currentComment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('closeReply')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
       <cmt-item
       :comment="currentComment"
       @reply-show="isCmtPopShow=true"
       ></cmt-item>
       <!-- /当前评论项 -->
       <van-cell title="全部回复" />
       <!-- 评论的回复列表 -->
       <cmt-list
       :source="currentComment.com_id"
       type="c"
       :list="replyList"
       ></cmt-list>
       <!-- /评论的回复列表 -->
    </div>

    <!-- 底部 -->
    <div class="post-wrap">
      <van-button size="small" round @click="isCmtPopShow=true">写评论</van-button>
      <!-- 留言板弹出层 -->
        <van-popup v-model="isCmtPopShow" position="bottom">
         <cmt-post
         :target_id="currentComment.com_id"
         :art_id="currentComment.art_id"
         @update-cmtList="onPostCmt"
         ></cmt-post>
        </van-popup>
        <!-- /留言板弹出层 -->
    </div>
    <!-- /底部 -->
  </div>
</template>

<script>
import CmtItem from './CmtItem.vue'
import CmtList from './comments-list'
import CmtPost from './CmtPost.vue'
export default {
  name: 'CommentReply',
  props: {
    currentComment: {
      type: Object,
      required: true
    }
  },
  components: {
    CmtItem,
    CmtList,
    CmtPost
  },
  data () {
    return {
      isCmtPopShow: false,
      replyList: []
    }
  },
  methods: {
    onPostCmt (e) {
      this.isCmtPopShow = false
      console.log(e)
      this.replyList.unshift(e.new_obj)
      // eslint-disable-next-line vue/no-mutating-props
      this.currentComment.reply_count++
    }
  }
}
</script>

<style lang="less" scoped>
.comment-reply{
  .scroll-wrap{
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
  .post-wrap{
  position:fixed;
  height: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top:1px solid #d8d8d8;
  .van-button{
    width: 60%;
  }
}
}

</style>
