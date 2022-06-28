// 封装本地储存操作
// 存数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    // 如果数据格式是数组或者对象就转成JSON格式的字符串再存储
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
// 取数据
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    // 返回正确格式的数据
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}
// 删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
