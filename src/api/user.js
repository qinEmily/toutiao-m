import request from '@/utils/request'
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}
/**
 *获取登录验证码
 **/
export const sendSmsg = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
/**
 *获取用户个人信息
 **/
export const getUserInfo = token => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    // Bearer后面必须有一个空格
    // Authorization: `Bearer ${token}`
    // }
  })
}
/**
 * 获取用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
/**
 * 取消关注
 */
export const deleteUser = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
/**
 * 添加关注
 */
export const addUser = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}
/**
 * 获取用户资料
 */
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}
/**
 * 编辑用户资料
 */
export const editUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
/**
 * 编辑用户头像
 */
export const editUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
