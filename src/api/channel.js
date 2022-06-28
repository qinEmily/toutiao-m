import request from '@/utils/request'
/**
 * 获取全部频道列表
 **/
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
/**
 * 添加用户频道列表
 **/
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: { channels }
  })
}
/**
 * 删除用户频道列表
 **/
export const deleteUserChannel = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${target}`
  })
}
