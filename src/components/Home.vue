<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/home_logo.png" alt="" width="60px" height="60px">
        <span>无人机影像目标检测系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
      <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 导航菜单 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">
          <!-- 一级菜单 -->
          <!-- 动态添加菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
          <template slot="title">
            <!-- 图标文本 -->
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.name}}</span>
          </template>

              <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
        <div class="toggle-button"  @click="toggleCollapse">|||</div>
      </el-aside>
      <!-- 主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      //折叠判断标志
      isCollapse:false,
      //菜单栏数据
      menulist:[
        //要添加菜单在这里加
        {
          id:101,
          name:'图像识别',
          children:[
          {id:201,name:'功能一',path:"/f1"},
          {id:202,name:'功能二',path:"/f2"}]
        },
        /* path指定菜单栏路由跳转地址 router开启路由menu */
        {id:102,name:'目标检测',children:[{id:203,name:'图片检测',path:'/ImageDetection'}]},
        {id:103,name:'变化监测',children:[{id:204,name:'目标查询',path:'/Canvas'}]},
        {id:104,name:'功能模块',children:[{id:205,name:'功能五',path:'/f5'}]}
      ],
      iconsObj:{
        //需要什么样的图标自己找对应菜单栏id即可
        101:'el-icon-picture',
        102:'el-icon-camera-solid',
        103:'el-icon-time',
        104:'el-icon-discover'
      }
    }
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    /* 点击按钮折叠菜单 */
    toggleCollapse(){
      this.isCollapse=!this.isCollapse; 
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #333744;
    display: flex;
    justify-content:space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
      display: flex; 
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
    position: relative;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>