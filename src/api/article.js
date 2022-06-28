import request from '@/utils/request'
export const getArticleList = params => {
  return request({
    type: 'GET',
    url: '/v1_0/articles',
    params
  })
}
