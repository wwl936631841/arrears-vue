<template>
  <div id="operation">
    <van-nav-bar title="运营指数" left-arrow  @click-left="onClickLeft"></van-nav-bar>
    <div class="imgInfo">
      <div>
        <img src="../../assets/operationIndex/error/empty@2x.png" alt="" width="129" height="119">
      </div>
      <p>更多功能开发中，敬请期待</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'operation',
        data(){
          return{

          }
        },
        methods: {
          onClickLeft(){
            location.href = 'zjh://close'
          }
        },
        created() {
          this.$utils.OverWriteCSS()

        },
        mounted() {

        }
    }
</script>

<style scoped>
  #operation {
    height: 100vh;
    background-color:#F5F5F5;
  }
  #operation .van-nav-bar__arrow{
    font-size: .2rem;
    color:#666666;
    font-weight: 600;
  }

  #operation .imgInfo {
    margin: .88rem auto;
  }
  #operation .imgInfo div{
    width: 1.43rem;
    height: 1.42rem;
    margin: 0 auto;
  }
  #operation .imgInfo p {
    color: #999999;
    font-size: .14rem;
    text-align:center;
  }

  #operation .imgInfo img {
    width: 100%;
    height: 100%;
  }

</style>
