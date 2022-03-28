import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/User.vue'
import ImageDetection from '../components/detection/ImageDetection.vue'

Vue.use(Router)
axios.defaults.headers.post['Content-Type']='text/plain'
Vue.prototype.$http = axios

const router= new Router({
  mode: 'history',  //去掉url中的#
  routes: [
      //重定向到登陆界面
      {path:'/',redirect:'/login'},
      {path:'/login',component:Login},
      {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        children:[
        {path:'/welcome',component:Welcome},
        {path:'/f1',component:Users},
        {path:'/f2',component:Users},
        {path:'/f4',component:Users},
        {path:'/f5',component:Users},
        {path:'/ImageDetection',component:ImageDetection}
      ]}
  ]
})
  router.beforeEach((to,from,next) =>{
    if(to.path==='/login') return next()
    //获取密钥
    const tokenStr=window.sessionStorage.getItem('token')
    //没有密钥则返回登录页
    if(!tokenStr) return next('/login')
    next()
})

export default router;
