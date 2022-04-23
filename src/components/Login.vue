<template>
  <div class='login_container'>
      <div class="login_box">
         <!--  头像区域 -->
          <div class="avatar_box">
              <img src="../assets/home_logo.png" alt="">
          </div>
         <!--  登陆表单区域 -->
         <el-form ref="LoginRef" :model="Login" :rules="LoginRules" class="login_form">
             <!-- 用户名 -->
            <el-form-item prop="account" >
                <el-input v-model="Login.account" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password" >
                <el-input v-model="Login.password" prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" class="enter" @click="login" >登录</el-button>
            </el-form-item>
         </el-form>
      </div>
  </div>
</template>

<script>
export default {
data () { 
    return {
        /*登录信息收集对象 */
        Login:{
        /* 登陆区域的的数据绑定 */
                account:"admin",
                password:"admin123."
        },
        //表单验证规则对象
        LoginRules:{
                account:[ 
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '请输入合法的用户名', trigger: 'blur' }
                    ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        type: 'string',
                        message: '请输入不包含空格的字符',
                        trigger: 'blur',
                        transform(value) {
                            if (value && value.indexOf(' ') === -1) {
                                return value
                            } else {
                                return false
                            }
                        }
                    },
                    {
                        trigger: 'blur',
                        validator: (LoginRules, value, callback) => {
                        var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
                            if (!passwordreg.test(value)) {
                                callback(new Error('密码必须由数字、字母、特殊字符组合,长度在6-16位之间'))
                            }else{
                                callback()
                            }
                        } 
                    }
                ],
            }

    }
},
methods: {
    /* 表单预验证 */
    login(){
        this.$refs.LoginRef.validate( valid=>{
            if(!valid) return;
            this.$message.success("登录成功！")
           /*  this.$message.error("登录失败！") */
           /* 跳转到主页 */
           window.sessionStorage.setItem("token",'mima')
            this.$router.push("/home")
            /*写死验证*/
/*             if(this.$ref.LoginRef) */

        })
    }
}
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%); 
}
.avatar_box{
    height: 130px;;
    width: 130px;
    border: 1px,solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #fff;
    }
}
.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.enter{
    width: 125px;
    left: 50%;
    transform: translate(105%);
}
</style>
