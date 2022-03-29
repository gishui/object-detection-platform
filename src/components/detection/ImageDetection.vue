<template>
  <div class="imagedetection_card">
      <el-card>
          <el-row :gutter="28">
             <el-col :span="12">
                <el-image  :src="url_1" :preview-src-list="srcList1">
                 <!--  使用自定义加载失败来漂浮上传图片按钮 -->
                 <div slot="error">
                     <div slot="placeholder" class="image-slot">
                      <el-button v-show="showbutton" type="primary" icon="el-icon-upload"
                                class="upload_bt" v-on:click="true_upload">上传图像
                            <input ref="upload" style="display: none" name="file"
                             type="file" @change="update"/>
                      </el-button>
                </div>
                 </div>
                </el-image>
                <div class="infobox">
                  <span>原始图像</span>
                </div>
             </el-col>
            <el-col :span="12">
                <el-image :src="url_2" :preview-src-list="srcList2">
                  <div slot="error">
                    <div slot="placeholder" class="image-slot">
                       等待检测结果<span class="dot">...</span>
                   </div>
                  </div>
                </el-image>
                <div class="infobox">
                  <span>检测结果</span>
                </div>
            </el-col>
          </el-row>
      </el-card>
      <el-button style="primary" @click="repredict">重新识别</el-button>
  </div>
</template>

<script>
import axios from 'axios'; 
let Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      server_url:'http://127.0.0.1:5000/predict',
      url_1:"",
      url_2:"",
      srcList1:[],
      srcList2:[],
      showbutton:true,
      URL:'',
      image_data:''
    }
  },
  created:function() {
      document.title = "遥感影像目标检测系统";
  },
  methods: {
    true_upload() {
      this.$refs.upload.click();
    },
    //重新上传图片重置url方法
    repredict(){
      this.url_1='',
      this.url_2='',
      this.srcList1=[],
      this.srcList2=[]
    },
    SuccessTips(){
       //预测成功弹框提示
       /*  this.$notify({
        title: "预测成功",
        message: "点击图片可以查看大图",
        duration: 0,
        type: "success",
      }); */
      this.$message.success("检测成功！点击图片查看大图")
    },
    ErrorTips(){
      this.$message.error("检测失败！请重新上传图片")
    },
    /*  图片上传方法 */
    update(e){
        let file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          //创建图片的url并将其添加到原始图预览列表
          this.url_1 = URL.createObjectURL(file);
          this.srcList1.push(this.url_1)
          let config = {
              headers: { "Content-Type": "application/json" },
            }; //添加请求头
          //发送编码的图片到flask服务器
          axios.post(this.server_url,JSON.stringify({'image':reader.result}),config)
          .then(res =>{
            console.log(res.data)
            this.image_data=res.data.image_url
/*             var imgFileBlob = this.$options.methods.dataURLtoBlob(this.image_data)
            var imgFile = this.$options.methods.blobToFile(imgFileBlob) */

            this.url_2='data:image/jpg;base64,'+this.image_data
            this.srcList2.push(this.url_2)
            this.SuccessTips() 
          })
          .catch(error => {
            console.log(error)
            this.ErrorTips()
          })
        
      }    
    },
  }
  
}
</script>

<style lang="less" scoped>
  .imagedetection_card{
    height: 600px;
    width: 1120px;
    align-content: center;
  }
  .el-image{
    width: 520px; 
    height: 300px;
    border-color: #01A9DB;
  }
  .image-slot{
      margin: 100px auto;
      width: 50%;
      padding: 10px;
      text-align: center;
  }
  .upload_bt{
    display: inline-block;
  }
  .infobox{
    border-radius: 0 0 5px 5px;
    background-color: #01A9DB;
    height: 36px;
    width: 520px;
    text-align: center;
    span{
      color: white;
      size: 36px;
      margin-top: 5px;
    }
  }
</style>

