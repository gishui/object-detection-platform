<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
        <!-- 卡片视图区域 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>
       <!-- 用户列表区域 -->
        <el-table :data="userlist" border stripe>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="年龄" prop="age"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="状态" >
                <!-- 作用域插槽语法 -->
                <template slot-scope="scope">
                   <el-switch v-model="scope.row.state"></el-switch>
                </template>
            </el-table-column> 
            <el-table-column label="操作" width="180px">
  <!--               <template slot-scope="scope">  -->
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                     <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                     </el-tooltip>
         <!--        </template> -->
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum" :page-sizes="[1, 5, 10]" :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="userlist.length">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
    data () {
        return {
            userlist:[
                {username:'唐一',age:20,mobile:13012345678,email:'tangyi@163.com',state:false},
                {username:'唐二',age:19,mobile:13012345678,email:'tanger@163.com',state:false},
                {username:'唐三',age:21,mobile:13012345678,email:'tangsan@163.com',state:true}
            ] ,
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:2
            }
        }
    },
    methods: {
        /* 需要定义接口获取数据 */
       async getUserList(){
            const{data:res}=await this.$http.get('users',{params:this.queryinfo})
            if (res.meta.status !== 200) {
                return this.$message.error( '获取用户列表失败! ')
                this.userlist = res.data.users
                this.total = res.data. total
            }
        },
        handleSizeChange(newSize){
            this.queryinfo.pagesize=newSize
            this.getUserList()
        },
        handleCurrentChange(newSize){
            this.queryinfo.pagenum=newSize
            this.getUserList()
        }
    }
}
</script>

<style lang="less" scoped>

</style>