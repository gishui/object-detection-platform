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
    repredict(){
      this.url_1='',
      this.url_2='',
      this.srcList1=[],
      this.srcList2=[]
    },
    dataURLtoBlob(toDataURL) {
				var arr = toDataURL
					//mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[0]),
					n = bstr.length,
					//new ArrayBuffer(bstr.length) 这里有争议，加上后后面blob转化为formData 
          //的时候不是乱码形式的流，可以看到类似于就是formData的格式，但是提交后后台给的url图片显示不出来。
          //不使用呢看请求参数的时候就是一堆乱码流，但是后台接口能够通过它正常放回图片路径。
          //之前由于不懂这里直接用网上的代码，哎  后面研究一下，这个就搞了差不多一天。
          //所以建议new ArrayBuffer(bstr.length)  这个可以用于临时调试看参数。
          //实际使用还是使用bstr.length这个吧
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return Blob([u8arr], {type: 'image/jpg'});
		},

    blobToFile(Blob, fileName) {
				Blob.lastModifiedDate = new Date();
				Blob.name = fileName;
				return Blob;
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
          })
          .catch(error => {
            console.log(error)
          })
        
      }    
    },
    selectColor(index) {
      var colors = ["blue", "fuchsia", "green", "lime", "maroon", "navy", 
      "olive", "orange", "purple", "red", "silver", "teal", "white", "yellow", 
      "aqua", "black", "gray"];
      i = index % 18;
      var color = colors[i];
      return color;
    },
    DrawResult(results) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        var index = 0;
        var totalClasses=new Array(); 
        for(bboxInfo of results) { 
          bbox = bboxInfo['bbox'];
          class_name = bboxInfo['name'];
          score = bboxInfo['conf'];

          ctx.beginPath();
          ctx.lineWidth="4";

          if (totalClasses.includes(class_name) == false) 
            {
              totalClasses[index] = class_name;
              index += 1;
            }
          //ctx.strokeStyle="red";
          //ctx.fillStyle="red";
          var i = totalClasses.indexOf(class_name)   // class_name 值的索引值
          ctx.strokeStyle = selectColor(i);
          ctx.fillStyle = selectColor(i);
          
          ctx.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
          ctx.stroke();
          
          ctx.font="20px Arial";
          
          let content = class_name + " " + parseFloat(score).toFixed(2);
          ctx.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1]-5);
       }
    },
    setup() {
      // Make a detection with the default image
      var canvasTmp = document.createElement("canvas");
      canvasTmp.width = image.width;
      canvasTmp.height = image.height;
      var ctx = canvasTmp.getContext("2d");
      ctx.drawImage(image, 0, 0);
      var dataURL = canvasTmp.toDataURL("image/png");
      communicate(dataURL)
    }
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

