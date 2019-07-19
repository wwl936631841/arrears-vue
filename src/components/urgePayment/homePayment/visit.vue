<template>
  <div id="visit">
    <div class="header">
      <div class="backImg" @click="back">
        <img src="../../../assets/img/urgePayment/icon_back@2x.png" alt="" width="12" height="20"/>
      </div>
      <p class="title">上门</p>
    </div>

    <!-- <item :isVisit="true" :adviceStatus="false" style="height:1.2rem" :itemObj="obj" @wxEvent="WXshare"></item> -->
    <item :isVisit="true" :adviceStatus="false" style="height:1.2rem" :itemObj="obj" @billDetail="billDetails"></item>

    <div class="tooltip" v-if="!obj.payStatus">
      <p>
        <img src="../../../assets/img/urgePayment/time@2x.png" alt="" width="11" height="12"/>
        <span>2019-02-22 11:3-:50 后二维码失效</span>
      </p>
    </div>
    <div class="qrcodeBlock" v-show='!isLoading && !obj.payStatus'>
      <h4>支付单号 {{weixinObj.payOrderNo}}</h4>
      <div class="qrcode">
        <!--<van-loading type="spinner" color="white" />-->
        <div id="qrcode">
        </div>
        <!--<img :src="weixinObj.qrcodeAddress" alt="" width="170" height="170" >-->
        <p>请业主扫描上方二维码支付</p>
      </div>
    </div>
    <div class="banner" style="position:absolute; top: 60%;left:46%;" v-show="isLoading">
      <van-loading type="spinner" color="black"/>
    </div>
    <div class="total" v-show="!isLoading && !obj.payStatus">
      <h4>物业账单</h4>
      <p>￥{{weixinObj.arrearageMoney}}</p>
    </div>
    <div v-if="obj.payStatus" class="" style="text-align: center; margin-top: .5rem; margin-bottom: 1rem">
      <img src="../../../assets/img/urgePayment/success@2x.png" width="96" height="96" alt=""/>
      <p style="font-size: .14rem; color:rgba(102, 102, 102, 1)">业主已成功支付物业账单</p>
    </div>
    <div class="submit" v-if="!obj.payStatus">
      <van-button type="info" size="large" @click="toFeedBack">上门反馈</van-button>
    </div>
  </div>
</template>

<script>
  import item from '../common/item'
  import axios from 'axios'
  // import {cuiJiaoPath, wxConfig} from '../../../api/env'
  import QRCode from 'qrcodejs2'
  import wx from 'weixin-js-sdk';
  import jsonp from 'jsonp'

  export default {
    name: "visit",     // 上门
    data() {
      return {
        isVisit: true,
        taskId: '',
        houseId: '',
        arrearType: 3,
        obj: {},
        weixinObj: {},
        isLoading: true,
        WXshareObj: {},
      }
    },
    watch: {
      $route() {

      }
    },
    components: {
      item
    },
    methods: {
      WXshare() {
        let imgUrl = require('../../../assets/img/urgePayment/zfc@2x.png')
        console.log(imgUrl)
        let lineLink = this.weixinObj.qrcodeAddress
        let shareTitle = "上门缴费单"
        let descContent = "上门缴费单"

        wx.config({
          debug: true,    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.WXshareObj.appid,   // 必填，公众号的唯一标识
          timestamp: this.WXshareObj.timestamp,  // 必填，生成签名的时间戳
          nonceStr: this.WXshareObj.nonceStr,  // 必填，生成签名的随机串
          signature: this.WXshareObj.signature,  // 必填，签名
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']  // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {
          // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
          wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: lineLink,
            imgUrl: imgUrl // 分享图标
          });
          // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: descContent, // 分享描述
            link: lineLink,
            imgUrl: imgUrl, // 分享图标
            type: 'link' // 分享类型,music、video或link，不填默认为link
          });

          wx.onMenuShareWeibo({
            title: shareTitle, // 分享标题
            desc: descContent, // 分享描述
            link: lineLink, // 分享链接
            imgUrl: imgUrl// 分享图标

          });
          wx.onMenuShareQZone({
            title: shareTitle, // 分享标题
            desc: descContent, // 分享描述
            link: lineLink, // 分享链接
            imgUrl: imgUrl // 分享图标
          });
          window.location.href = `zjh://?action=shareToWechat&jump_url=` + lineLink + `&title=` + shareTitle + `&description=` + descContent + `&imageUrl=`
        });
      },

      billDetails(){
          this.$buryPoint('bill-details')
          axios.get(`${this.$envConfigObj.houseId}?cottage_id=${this.obj.houseId}`).then(res=>{
              if(res.data.errorCode == 0){
                  const getHouseId = res.data.data.list.FWID
                  let url = `zjh://?action=billDetail&house_id=${getHouseId}&customer_mobilephone=${this.obj.customPhone}&customer_id=${this.obj.customId}&village_id=${this.obj.uptownId}&customer_name=${this.obj.customName}&address=${this.obj.uptownName}${this.obj.unitNumber}${this.obj.houseName}`
                  console.log('url',url)
                  window.location.href = url
              }
          })
      },

      getDetail() {
        let that = this
        axios.get(`${this.$envConfigObj.cuiJiaoPath}/arrears/home/details/${this.taskId}/${this.houseId}/${this.arrearType}`).then(function (res) {
          if (res.data.status == 0) {
            that.obj = res.data.data
            that.arrearToHome()
          }
        })
      },

      arrearToHome() {
        let that = this
        axios.post(this.$envConfigObj.cuiJiaoPath + '/arrears/home/arrearToHome', {
          amount: that.obj.arrearageMoney,
          arrearId: that.obj.arrearId,
          customId: that.obj.customId,
          customName: that.obj.customName,
          houseId: that.obj.houseId,
          month: that.obj.month,
          taskId: that.obj.taskId,
          userId: localStorage.getItem('userId'),
        }).then((res) => {
          if (res.data.status == 0) {
            that.$nextTick(() => {
              that.weixinObj = res.data.data
              console.log(that.weixinObj.qrcodeAddress)
              let qrcode = new QRCode('qrcode', {
                width: 170, // 设置宽度，单位像素
                height: 170, // 设置高度，单位像素
                text: that.weixinObj.qrcodeAddress
              })
            })
          }
        }).then(() => {
          this.isLoading = false
        })
      },

      // 生成二维码
      generateQRCode() {
        let qrcode = new QRCode('qrcode', {
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: this.weixinObj.qrcodeAddress
        })
      },

      back() {
        this.$router.go(-1)
      },

      toFeedBack() {
        let that = this
        this.$router.push({
          name: 'feedBack',
          params: {
            arrearId: that.obj.arrearId,
            taskId: that.obj.taskId,
          }
        })
      },

      getWxConfig() {
        let that = this
        // console.log(wxConfig)
        axios.get(this.$envConfigObj.wxConfig).then(function (res) {
          if (res.data.errorCode == 0) {
            that.WXshareObj = res.data.data
          }
        }).catch((e) => {
          console.log('========= wx share err ===========')
          console.log(e)
        })
      }
    },

    created() {
      this.taskId = this.$route.params.taskId
      this.houseId = this.$route.params.houseId
      this.arrearType = this.$route.params.arrearType
      this.getDetail()
      this.getWxConfig()
    }
  }
</script>

<style scoped lang="stylus">
  #visit
    .header
      display: flex
      align-items center
      height: .63rem
      border-bottom: 1px solid rgba(235, 235, 235, 1)

      .backImg
        display: flex
        align-items: center
        padding-left: .18rem
        flex: 1
        height: .3rem

      .title
        flex: 8
        margin-left: -.3rem
        margin-right: .2rem
        text-align: center
        font-size: 0.18rem
        color: rgba(51, 51, 51, 1)

    .item
      li
        padding-bottom: 0

    .tooltip
      p
        display: flex
        align-items: center
        font-size: .12rem
        padding: 8px 20px
        background-color: rgba(238, 246, 255, 1)

        span
          margin-left: .1rem

    .qrcodeBlock
      text-align: center
      padding: 0 10px
      border-bottom: 1px solid rgba(235, 235, 235, 1)

      h4
        font-size: 0.14rem
        padding-bottom: 14px
        border-bottom: 1px solid rgba(235, 235, 235, 1)

      .qrcode
        position: relative
        padding-top: .1rem
        height: 2.1rem
        //background-color: rgba(0,0,0,0.5)
        //z-index: 9999
        /*.van-loading*/
        /*position:relative*/
        /*top: 45%*/
        /*left:46%*/

        #qrcode
          display: flex
          justify-content center
          z-index: 900

          img
            z-index: 900

        p
          font-size: 12px
          margin: .1rem 0 .2rem 0
          color: rgba(102, 102, 102, 1)

    .total
      text-align: center
      height: 1rem

      h4
        font-size: 12px
        margin-bottom: 0

      p
        font-size: .2rem
        font-weight: 600
        color: rgba(38, 138, 237, 1)
        margin-top: 0

    .submit
      display flex
      position: absolute
      bottom: 0rem
      // height  .44rem
      width: 100%
      background-color: #fff

      .van-button--large
        line-height: .44rem
        height  .44rem
        width: -webkit-fill-available
        margin: .12rem .15rem
</style>
<style lang="stylus">
  #visit
    .item
      .message
        li
          height: 1.1rem

          .status
            margin-bottom: .03rem

            .left
              > span
                color: rgba(51, 51, 51, 1)
                font-weight: 600

            .right
              .no
                color: rgba(68, 68, 68, 1)

          .price
            margin-bottom: .03rem

          .add
            margin-bottom: .03rem
</style>
