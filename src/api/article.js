import request from '@/utils/request'
/**
 * 获取文章列表
 **/
export const getArticleList = params => {
  return request({
    type: 'GET',
    url: '/v1_0/articles',
    params
  })
}
/**
 * 获取文章详情
 **/
// eslint-disable-next-line camelcase
export const getArticleItem = article_id => {
  return request({
    type: 'GET',
    // eslint-disable-next-line camelcase
    url: `/v1_0/articles/${article_id}`
  })
}
/**
 * 收藏文章
 **/
export const addCollect = artId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: artId
    }
  })
}
/**
 * 取消收藏文章
 **/
export const cancelCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
/**
 * 点赞文章
 **/
export const addLike = artId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: artId
    }
  })
}
/**
 * 取消点赞文章
 **/
export const cancelLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
/**
 * 回复评论
 **/
export const addComments = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
