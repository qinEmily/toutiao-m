import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 全局样式
import './styles/index.less'

// 引入动态设置rem基准值
import 'amfe-flexible'
// 引入dayjs
import './utils/dayjs'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
