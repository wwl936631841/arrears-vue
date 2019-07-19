<template>
  <div id="paymentReport">
    <van-nav-bar title="催缴报告" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <main>
      <div class="panel">
        <div>
          <div class="subPanel">
            <span class="icon icon_total1"></span>
            <p>欠费总户数</p>
          </div>
          <p class="totalMoney" style="color:#FF6A44">{{totalUser}}<span>户</span></p>
        </div>
      </div>
      <div class="panel">
        <div>
          <div class="subPanel">
            <span class="icon icon_total2"></span>
            <p>欠费总金额</p>
          </div>
          <p class="totalMoney" style="color:#1CC8AE;font-size:22px;">{{totalArrearAmount}}<span>元</span></p>
        </div>
      </div>
      <div class="panel">
        <div>
          <div class="subPanel">
            <span class="icon icon_total4"></span>
            <p>欠违约金金额</p>
          </div>
          <p class="totalMoney" style="color:rgb(38, 138, 237);font-size:22px;">{{penaltyMoney}}<span>元</span></p>
        </div>
      </div>
      <div class="panel">
        <div>
          <div class="subPanel">
            <span class="icon icon_total3"></span>
            <p>收款总金额</p>
          </div>
          <p class="totalMoney" style="color: #268AED">{{totalRecievedAmount}}<span>元</span></p>
        </div>
      </div>
      <div class="statistics" @click="goSmsRecord">
        <h3>
          <span class="icon mail"></span>
          短信催缴
        </h3>
        <ul>
          <li>
            <h3>{{msgArrear.notifyTotal || 0}}</h3>
            <span>需通知总户数</span>
          </li>
          <li>
            <h3>{{msgArrear.hasNotifyTotal || 0}}户</h3>
            <span>已通知总户数</span>
          </li>
          <li>
            <h3>{{notices || 0}}%</h3>
            <span>通知成功率</span>
          </li>
        </ul>
      </div>
      <div class="statistics" @click="goPhoneRecord">
        <h3>
          <span class="icon icon_phone"></span>
          电话催缴
        </h3>
        <ul>
          <li>
            <h3>{{phoneArrear.callTotal || 0}}户</h3>
            <span>需拨打总户数</span>
          </li>
          <li>
            <h3>{{phoneArrear.hasCalledTotal || 0}}户</h3>
            <span>已拨打总户数</span>
          </li>
          <li>
            <h3>{{boda || 0}}%</h3>
            <span>拨打完成率</span>
          </li>
        </ul>
      </div>
      <div class="statistics" @click="goVistRecord">
        <h3>
          <span class="icon icon_visit"></span>
          上门催缴
        </h3>
        <ul>
          <li>
            <h3>{{toHouseArrear.toHouseTotal || 0}}户</h3>
            <span>需上门总户数</span>
          </li>
          <li>
            <h3>{{toHouseArrear.hasToHouseTotal || 0}}户</h3>
            <span>已上门总户数</span>
          </li>
          <li>
            <h3>{{tohome || 0}}%</h3>
            <span>上门完成率</span>
          </li>
        </ul>
      </div>
      <div class="statistics" @click="goCollectionRecord">
        <h3>
          <span class="icon icon_visits"></span>
          催收函
        </h3>
        <ul>
          <li>
            <h3>{{toCollectLetterArrearVo.toCollectLetterotal	|| 0}}户</h3>
            <span>需通知总户数</span>
          </li>
          <li>
            <h3>{{toCollectLetterArrearVo.hasCollectLetterTotal || 0}}户</h3>
            <span>已发管家</span>
          </li>
          <li @click.stop="toRecordList">
            <h3 style="color:rgb(56, 148, 239)">{{toCollectLetterArrearVo.toStampTotal || 0}}次</h3>
            <span>盖章次数</span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
  import axios from 'axios'
  import {cuiJiaoPath} from '../../api/env'
  import GetUrlParam from '@/utils/urlParse'
  import {thousands} from '@/utils/numberUtils'
  import { toThousands } from "@/utils/index.js";
  export default {
    name: "paymentReport",
    data() {
      return {
        totalUser: "",  // 欠费总用户
        totalArrearAmount: '',  // 欠费总金额
        totalRecievedAmount: '', // 收款总金额
        penaltyMoney:'', // 违约金金额
        msgArrear: {}, // 短信催缴信息
        phoneArrear: {},  // 电话催缴
        toHouseArrear: {

        }, // 上门催缴
        toCollectLetterArrearVo:{}, // 催收函
        arrearsId:null,
        uptownName:'',
        tohome:'',
        boda:'',
        notices:''
      }
    },
    methods: {
      onClickLeft() {
        this.$router.push(
          {
            path: '/urgePayment',
            query: {
              company_id: localStorage.getItem('companyId'),
              userId: localStorage.getItem('userId'),
              village_id: localStorage.getItem('uptownId'),
            }
          }
        )
      },
      
      // 获取汇总信息
      getReportDetail() {
        let that = this
        let params = {
          month: that.$route.query.month,
          uptownId: that.$route.query.uptownId,
          userId: that.$route.query.userId,   // 用户id
        }
        axios.get(this.$envConfigObj.cuiJiaoPath + '/summary/summaryReport', {params}).then(function (res) {
          let tempObj = res.data.data
          console.log('333',tempObj)
          that.totalUser = tempObj.totalHouses
          that.totalArrearAmount = toThousands(tempObj.totalArrearAmount) || 0
          that.totalRecievedAmount = toThousands(tempObj.totalRecievedAmount)
          that.penaltyMoney = toThousands(tempObj.penaltyMoney) || 0
          that.tohome = (tempObj.toHouseArrear.toHouseSuccessRate * 100).toFixed(2)
          that.boda = (tempObj.phoneArrear.completeSuccessRate * 100).toFixed(2)
          that.notices = (tempObj.msgArrear.notifySuccessRate * 100).toFixed(2)
          that.msgArrear = tempObj.msgArrear
          that.phoneArrear = tempObj.phoneArrear
          that.toHouseArrear = tempObj.toHouseArrear
          that.toCollectLetterArrearVo = tempObj.toCollectLetterArrearVo
          that.arrearsId = tempObj.arrearsId
          that.uptownName = tempObj.uptownName
          localStorage.setItem('arrearsId',tempObj.arrearsId)
          localStorage.setItem('uptownName',tempObj.uptownName)
        }).catch(function (error) {
          console.log(error);
        });
      },

      // 短信催缴记录列表
      goSmsRecord(){
        this.$buryPoint('sms-records')
        this.$router.push({
          name:'goSmsRecord',
          params:{
            arrearsId:this.arrearsId
          }
        })
      },

      // 电话上门记录列表
      goPhoneRecord(){
        this.$buryPoint('call-records')
        this.$router.push({
          name:'goPhoneRecord',
          params:{
            arrearsId:this.arrearsId
          }
        })
      },

      // 上门催缴记录列表
      goVistRecord(){
        this.$buryPoint('visit-records')
        this.$router.push({
          name:'goVistRecord',
          params:{
            arrearsId:this.arrearsId
          }
        })
      },

      // 催收函记录列表
      goCollectionRecord(){
        this.$buryPoint('stamp-records')
        this.$router.push({
          name:"collectionRecord",
          params:{
            arrearsId:this.arrearsId
          }
        })
      },

      // 盖章次数列表
      toRecordList(){
        this.$buryPoint('stamp-count')
        this.$router.push({
          name:"RecordList",
          params:{
            arrearsId:this.arrearsId
          }
        })
      }
    },

    created() {
      console.warn('cur page: ', location.href)
      console.log('接受到的参数--->', this.$route.params)
      this.getReportDetail()
    }

  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/mixin.styl"
  #paymentReport
    background-color: #F5F5F5
    height: 100vh;
    main{
      height: 88vh;
      overflow: auto;
    }
    .van-nav-bar
      margin-bottom: 5px

    .van-nav-bar__left
      .van-nav-bar__arrow
        font-size: 24px;
        color: #666666;
        font-weight: 600;

    .van-nav-bar__title
      color: #333333
      font-size: 17px
      font-weight: 500

    .panel
      display: flex
      align-items: center
      justify-content: space-between
      margin: 2px

      div
        display: flex
        align-items: center
        border-radius: 5px
        margin: 5px 10px 5px 10px
        background-color: #fff
        width: 100%
        padding: 5px 15px 5px 0

        .subPanel
          flex: 2

          .icon
            display: inline-block

          .icon_total1
            width: 25px
            height: 22px
            bg-image('../../assets/img/financeAI/icon_total1')
            background-size: contain
            background-repeat: no-repeat

          .icon_total2
            width: 24px
            height: 24px
            bg-image('../../assets/img/financeAI/icon_total2')
            background-size: contain
            background-repeat: no-repeat
          .icon_total4
            width: 24px
            height: 24px
            background  url('../../assets/img/record/icon_total3@2x.png')
            background-size: cover
            background-repeat: no-repeat

          .icon_total3
            width: 19px
            height: 19px
            bg-image('../../assets/img/financeAI/icon_total3')
            background-size: contain
            background-repeat: no-repeat

          p
            margin: 10px
            font-size: 15px
        .totalMoney

          justify-content: flex-end
      p:last-child
        font-weight: 600
        font-size: 24px
        display: flex
        flex: 2
        align-items: center

        span
          font-size: 14px
          color: #999999
          margin-left: 7px

    .statistics
      margin: 6px 10px 12px 10px
      background-color: #fff
      border-radius: 5px

      h3
        text-align: left
        margin-top: 0
        margin-bottom: 2px
        margin-left: 15px
        padding-top: 12px
        color: #444444
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: normal
        font-size: 16px

        .mail
          width: 14px
          height: 12px
          bg-image('../../assets/img/financeAI/mail')
          background-size: contain

        .icon_phone
          width: 13px
          height: 14px
          bg-image('../../assets/img/financeAI/icon_phone')
          background-size: contain

        .icon_visit
          width: 10px
          height: 14px
          bg-image('../../assets/img/financeAI/icon_visit')
          background-size: contain
        .icon_visits
          width: 10px
          height: 14px
          background url('../../assets/img/record/形状@2x.png') no-repeat center
          background-size: cover
        .mails
          width: .12rem
          height: .14rem
          background url('../../assets/img/record/icon_tools@2x.png') no-repeat center
          background-size: cover
      ul
        display: flex
        justify-content: space-between

        li
          display: flex
          flex: 1
          flex-direction: column
          align-items: start;
          padding-left: .16rem;
          justify-content: flex-start
          margin-bottom: 10px
          padding-bottom: 10px
          
          h3
            margin-top: 0
            margin-left: 5px
            font-size: 20px
            color: #313131
            text-align: left
            font-weight: 500

          span
            font-size: 12px
            color: #999999
            text-align: left
            margin-left: 5px

        li:nth-of-type(2)
          border-left: 2px solid #F6F6F6

        li:nth-of-type(3)
          border-left: 2px solid #F6F6F6


    .icon
      display: inline-block

</style>
