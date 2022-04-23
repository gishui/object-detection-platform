<template>
  <div>
       <canvas id="myCanvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    mounted(){
        this.draw()
    },
    methods: {
        draw(){
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            
            ctx.strokeRect(20, 30, 36, 120)
        }
    }


}
</script>

<style lang="less" scoped>

</style>