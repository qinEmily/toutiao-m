module.exports = {
  plugins: {
    // vue/cli内部已经配置了autoprefixer
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // 根元素字体大小
      // 如果你使用的是基于 lib-flexable 的 REM 适配方案，则应该设置为你的设计稿的十分之一。
      // 例如设计稿是 750 宽，则应该设置为 75。
      // rootValue: 37.5,
      // 配置要转换的css属性 *表示所有
      // 动态处理：(因为vant是按照37.5写的)如果文件名中包含vant就用37.5为基准
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
