import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/User.vue'

Vue.use(Router)

const router= new Router({
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
        {path:'/f5',component:Users},
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
