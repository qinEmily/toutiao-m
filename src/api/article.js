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
