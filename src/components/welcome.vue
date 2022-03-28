<template>
  <div class="introduce-card">
    <el-card>
      <el-carousel indicator-position="outside">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3>{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
    </el-card>     
  </div>
</template>

<script>
export default {
  data () {
    return {
      image:[
        
      ]
    }
  }
}
</script>

<style lang="less" scoped>
  .introduce-card{
    height: 100%;
  }
  .el-carousel{
    height: 450px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 420px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>