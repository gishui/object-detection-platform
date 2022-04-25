<template>
  <div class="imagedetection_card">
      <el-card>
           <el-row>
            <el-col :span="6">
              <el-button  @click="repredict" icon="el-icon-camera-solid">重新识别</el-button>
            </el-col>
             <el-col :span="6">
              <el-button  @click="downloadresult" icon="el-icon-download">下载图片</el-button>
            </el-col>
            <el-col :span="6">
              <el-popover placement="bottom" trigger="click">
                  <div id="datachart"></div>
                 <el-button slot="reference" icon="el-icon-s-data">统计图表</el-button>
              </el-popover>
            </el-col>
             <el-col :span="6">
              <el-button  @click="PrintTable" icon="el-icon-s-data">打印表格</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="28">
             <el-col :span="12">
                <el-image id="origin_Image" :src="url_1" :preview-src-list="srcList1">
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
                <el-image :src="url_2" :preview-src-list="srcList2" 
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
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
      
      <el-card>
          <el-table :data="featureList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" border stripe max-height="200px">
            <el-table-column fixed="left" type="index" width="50px"></el-table-column>
            <el-table-column label="目标类别" prop="name">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>        
            </el-table-column>
            <el-table-column label="目标大小" prop="size">
              <template slot-scope="scope">
                <span>{{ scope.row.size }}</span>
              </template>        
            </el-table-column>
            <el-table-column label="置信度" prop="conf">
              <template slot-scope="scope">
                <span>{{ scope.row.conf }}</span>
              </template>        
            </el-table-column>
             <el-table-column fixed="right" width="200px" align="right">
              <template slot="header">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-location" size="mini"
                @click="LocateObj(scope.$index, scope.row)"></el-button>
             </template>
            </el-table-column>
        </el-table>
      </el-card>
       <el-divider></el-divider>
      <template v-if="showcanvas==='true'">
        <el-card>
          <canvas id="myCanvas" :width="ImageWidth" :height="ImageHeight">
          </canvas>
        </el-card>
      </template>
  </div>
</template>

<script>
import axios from 'axios'; 
import printJS from 'print-js'
let Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      server_url:'http://127.0.0.1:5000/predict',
      url_1:"",
      url_2:"",
      srcList1:[],
      srcList2:[],
      featureList:[],
      showbutton:true,
      featureinfo:{},
      URL:'',
      image_data:'',
      ImageWidth:'',
      ImageHeight:'',
      showcanvas:'flase',
      loading: false,
      search: '',
      classlist:[]
    }
  },
  created:function() {
      document.title = "无人机影像目标检测系统";
  },
  mounted () {
      var datachart=document.getElementById('datachart')
      datachart.style.height="300px"
      datachart.style.width="500px"
  },
  methods: {
    true_upload() {
      this.$refs.upload.click();
    },
    downloadresult(){
       
       let a = document.createElement('a')
       a.download = 'result.png'
       a.href = this.url_2
       a.click()
    },
    PrintTable(){
      var data=[]
      for (let i = 0; i < this.featureList.length; i++) {
        data.push({
          field1:i+1,
          field2:this.featureList[i].name,
          field3:this.featureList[i].size,
          field4:this.featureList[i].conf
        })
        
      }
      printJS({
	         printable:data,
	         properties:[{
	             field:'field1',
	             displayName:'序号',
	             columnSize:1
	         },{
	             field:'field2',
	             displayName:'目标名称',
	             columnSize:1
	         },{
	             field:'field3',
	             displayName:'目标大小',
	             columnSize:1
	         },{
	             field:'field4',
	             displayName:'置信度',
	             columnSize:1
	         }],
	         type:'json',
           documentTitle:"目标检测结果",
	         header:'目标检测结果',
	         //样式设置
	         gridStyle:'border:2px solid #3971A5;',
	         gridHeaderStyle:'color:black; border:2px solid #3971A5;'
	     })
    },
    DrawEcharts(){
       var myChart = this.$echarts.init(datachart);
        // 显示标题，图例和空的坐标轴
            var option = {
              title: {
                text: '目标类别统计',
                left: 'center'
              },
              tooltip: {
                trigger: 'item'
              },
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              series: [
                {
                  name:'ObjectName',
                  type: 'pie',
                  data: this.classlist
                }
              ]
            };
    myChart.setOption(option)
    },
    //重新上传图片重置url方法
    repredict(){
      this.url_1='',
      this.url_2='',
      this.srcList1=[],
      this.srcList2=[],
      this.featureList=[],
      this.showcanvas='flase',
      this.classlist=[]
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
    GetClassCount(){

    },
    LocateObj(index,row){
        
        //调用绘制单目标方法
        this.QueryObj(index)
        //设置高亮当前行
        this.currentRow=index
    },
    QueryObj(objid) {
          
          //获得查询目标的大小、左上角坐标
          const objsize = this.featureList[objid].size.match(/\d+/g)
          const objname =this.featureList[objid].name
          const  lu_x=this.featureList[objid].cordinate.lu[0]
          const  lu_y=this.featureList[objid].cordinate.lu[1]
          
          var c = document.getElementById("myCanvas");
          var ctx = c.getContext("2d");

          var img = new Image()
          img.src = this.url_1 
          img.onload = function () {
           // 设置图片在canvas上 前面两个0,0是边距, 后面是宽高
              ctx.drawImage(img, 0, 0);
              // 添加文字 后面两个数字是坐标
              ctx.font  = "15px bold "
              ctx.fillStyle = 'yellow'
              ctx.fillText(objname, lu_x, lu_y-objsize[1]-2);
              //绘制目标框
              ctx.strokeStyle = 'red'
              ctx.strokeRect(lu_x, lu_y-objsize[1],objsize[0], objsize[1]);    
       }
    },
    /*  图片上传方法 */
    update(e){
        this.loading=true
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
            //获取检测后的图片数据
            this.ImageWidth=res.data.imageSize.width
            this.ImageHeight=res.data.imageSize.height
            this.image_data=res.data.image_url
            //获取检测到的要素信息
            this.featureList=res.data.results.boxes_detected
            this.classlist=res.data.results.classdata
            this.loading=false
            //使用base64编码直接组装图片，加上编码格式头 可以直接解析图片
            this.url_2='data:image/jpg;base64,'+this.image_data
            this.srcList2.push(this.url_2)
            //设置canvas节点可见
            this.showcanvas='true'
            this.DrawEcharts()
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
    height: 400px;
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

