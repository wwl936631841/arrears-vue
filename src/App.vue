<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    created() {
      document.body.style.height = '100vh'
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        //  留海屏  原生提供字段
        console.info('======== ios style change ===============')
        document.body.style.marginTop = '24px'
        document.body.style.height = ' calc( 100vh - 24px ) '
      }
    },
  }
</script>
<style lang="stylus">
  #app {
    font-family: -apple-system, "PingFang SC", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fff;
    /*text-align: center;*/
    color: #313131;
    /*margin-top: 60px;*/
    height 100%
  }
  *{
    -webkit-overflow-scrolling: touch;
  }
</style>
