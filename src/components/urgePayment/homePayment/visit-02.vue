<template>
  <div id="visit">
    <div class="header">
      <div class="backImg" @click="back">
        <img src="../../../assets/img/urgePayment/icon_back@2x.png" alt="" width="12" height="20"/>
      </div>
      <p class="title">上门</p>
    </div>
    <item :isVisit="true" :adviceStatus="false"></item>
    <!-- 未支付 -->
    <div v-if="false">
      <div class="tooltip">
        <p>
          <img src="../../../assets/img/urgePayment/time@2x.png" alt="" width="11" height="12"/>
          <span>2019-02-22 11:3-:50 后二维码失效</span>
        </p>
      </div>
      <div class="qrcodeBlock">
        <h4>支付单号25643786786</h4>
        <div class="qrcode">
          <img src="../../../assets/img/urgePayment/code@2x.png" alt="" width="170" height="170">
          <p>请业主扫描上方二维码支付</p>
        </div>
      </div>
      <div class="total">
        <h4>物业账单</h4>
        <p>￥1200.52</p>
      </div>
    </div>
    <!-- 支付成功 -->
    <div v-if="true" class="" style="text-align: center; margin-top: .5rem; margin-bottom: 1rem">
        <img src="../../../assets/img/urgePayment/success@2x.png" width="96" height="96" alt=""/>
        <p style="font-size: .14rem; color:rgba(102, 102, 102, 1)">业主已成功支付物业账单</p>
    </div>
    <div class="submit">
      <van-button type="info" size="large" @click="toFeedBack">上门反馈</van-button>
    </div>
  </div>
</template>

<script>
  import item from '../common/item'

  export default {
    name: "visit",     // 上门
    data() {
      return {
        isVisit: true,
      }
    },
    components: {
      item
    },
    methods: {
      back() {
        this.$router.push('reminderTask')
      },
      toFeedBack() {
        this.$router.push('feedBack')
      }
    }
  }
</script>

<style scoped lang="stylus">
  #visit
    .header
      display: flex
      justify-content: center
      height: .63rem
      border-bottom: 1px solid rgba(235, 235, 235, 1)

      .backImg
        position: absolute
        left: 0.15rem
        top: -.3rem

      .title
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
        p
          font-size: 12px
          margin: -.1rem 0 .2rem 0
          color: rgba(102, 102, 102, 1)

    .total
      text-align: center

      h4
        font-size: 12px
        margin-bottom: 0

      p
        font-size: .2rem
        font-weight: 600
        color: rgba(38, 138, 237, 1)
        margin-top: 0

    .submit
      background-color: rgba(247, 247, 247, 1)

      .van-button--large
        line-height: .44rem
</style>
