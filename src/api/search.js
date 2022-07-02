import request from '@/utils/request'
/**
 *请求搜索时的联想建议
 **/
export const getSearchSuggestion = q => {
  return request({
    type: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 *请求搜索结果
 **/
export const getSearchResult = params => {
  return request({
    type: 'GET',
    url: '/v1_0/search',
    params
  })
}
