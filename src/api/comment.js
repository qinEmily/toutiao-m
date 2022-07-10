import request from '@/utils/request'
/**
 * 获取文章评论和评论回复
 **/
export const getComments = params => {
  return request({
    type: 'GET',
    url: '/v1_0/comments',
    params
  })
}
/**
 * 给文章评论点赞
 **/
export const addCmtsLike = commentId => {
  return request({
    method: 'post',
    url: '/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}
/**
 * 取消评论或文章点赞
 **/
export const cancelCmtsLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}
