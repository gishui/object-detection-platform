import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import $ from 'jquery'

//引入全局样式表
import './assets/css/global.css'

import axios from 'axios'

Vue.prototype.$http=axios

/* 关闭生产提示 */
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
