<template>
  <div id="operationIndex">
    <v-nav-bar :title="title">
        <img class="imgss" @click="goSummaryExplain" src="../../assets/operationIndex/operationIndex/data _ic_quetion@2x.png" alt="">
    </v-nav-bar>
    <div style="border: .001rem solid #F5F5F5"></div>
    <div class="info">
      <div class="img">
        <div class="pic">
          <img src="../../assets/operationIndex/operationIndex/data_pic_total@2x.png" alt="" width="100%" height="100%"/>
        </div>
      </div>
      <div class="detail">
        <p>建筑面积：<span>{{area}}</span>万㎡</p>
        <p>户数：<span>{{total.residentNum}}</span>户</p>
        <p>物业项目数：<span>{{total.villageNum}}</span></p>
      </div>
    </div>
    <ul class="itemContainer">
      <li class="item">
        <p style="display:flex; align-items: center;">
          <van-icon class="" style="margin-right:10px;" size=".16rem" color="#4789CC"
                    name="after-sale"></van-icon>
          本年累计应收（元）
        <h3>{{yingShou}}</h3>
        <!--</p>-->
      </li>
      <li class="item" @click="routerGo(total.villageIDList)">
        <p style="display:flex; align-items: center;">
          <van-icon class="" style="margin-right:10px;" size=".16rem" color="#29CBB3" name="paid"></van-icon>
          实收本年累计（元）
        </p>
        <a>
          <h3>{{shiShou}}</h3>
        </a>
      </li>
      <li class="item">
        <p style="display:flex; align-items: center;">
          <img src="../../assets/operationIndex/operationIndex/data _ic_qk@2x.png" style="margin-right:10px;width:.14rem;" alt="">
          年初往年应收（元）
        <h3>{{wangqian}}</h3>
      </li>
      <li class="item" @click="routerGos(total.villageIDList)">
        <p style="display:flex; align-items: center;">
          <img src="../../assets/operationIndex/operationIndex/data _ic_yswq@2x.png" style="margin-right:10px;width:.14rem;" alt="">
          实收往年累计（元）
        </p>
        <a>
          <h3>{{yishou}}</h3>
        </a>
      </li>
    </ul>
    <!-- 财务AI分析  financeObj -->
    <div class="FinanceAI">
      <div class="financeAndLot" @click="toFinanceAI(total.villageIDList)">
        <!-- <div class="financeAndLot"> -->
        <div class="title">
          <span class="common finance"></span>
          <p>财务AI分析</p>
        </div>
        <a>   <!--传递参数啊-->
          <van-icon name="arrow" color="#999999"></van-icon>
        </a>
      </div>
      <div class="content">
        <p>
          整体项目收缴率为{{rateNum}}%，有{{count}}个项目低于阀值，请重点关注。
        </p>
      </div>
    </div>
    <div class="parkingLotAI">
      <div class="financeAndLot" @click="toParkingLotAI(total.parkIdList)">
        <div class="title">
          <span class="common parking"></span>
          <p>停车场AI分析</p>
        </div>
        <a>
          <van-icon name="arrow" color="#999999"/>
        </a>
      </div>
      <div class="contents">
        <p v-for="(item,index) in parkingObj" :key="index">
          {{item}}
        </p>
      </div>
    </div>
    
  </div>
</template>

<script>
  import {GetUrlParam, pathArr} from "../../assets/js/base";
  import axios from 'axios'
  import { toThousands } from "@/utils/index.js";
  export default {
    name: "summaryPage",
    data() {
      return {
        title:'项目汇总',
        baseInfoList: [],  // onchange --> 到这里查找然后初始化对象
        list: [],
        loading: false,
        finished: false,
        total:{},
        area:"",
        project: {
          proId: '',   // 项目id
          managerId: '',  // 项目经理id
        },
        yingShou: 0,
        shiShou: 0,
        wangqian:0,
        yishou:0,
        financeObj: {},
        parkingObj: [],  //
        rate:{},
        rateNum:0,
        count:0,
        parkId: 0, // 当前项目的停车场id

        closeParkRoute: false,   // 停车场可跳转
      }

    },

    watch: {
      '$route'(to, from) {
        // this.getProjectId()
        // this.curMonth = this.initMonthStr()
        // this.lastMonth = this.initFinanceMonthStr()
      }
    },

    methods: {
      goSummaryExplain(){
          this.$router.push({
              name:'summaryExplain'
          })
      },

      getTotalUser(){
        axios.get(this.$envConfigObj.dataAnalysisPath + `/parkBasicData/selectAllProjectsBaseInfo/${GetUrlParam('userId')}`) //managerId:5146  //GetUrlParam('userId')  
        .then(res=>{
          if(res.data.status==0){
              this.total = res.data.data
              console.log('total',this.total)
              if(this.total.manageArea!='null'){
                this.area = (this.total.manageArea/10000).toFixed(2)

              }
          }
        }).then(res=>{
            this.getParkingLotInfo()
          }).then(res=>{
            this.getMoney()
          }).then(res=>{
            this.getFinanceInfo()
          })
      },

      /**
       *    http://arrears-info.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/operationIndex/chargeRecord.html
       *    项目id
       */
      toFinanceAI(val) {
        console.info('page:toFinanceAI= ', val)
        this.$buryPoint('financial-ai-analysis')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}financeAI?proId=${val}`
        window.location.href = url   //  项目id： 项目的财务报表
      },

      /**
       *  项目id
       */
      toParkingLotAI(val) {
        this.$buryPoint('ai-analysis-of-parking-lot')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}parkingLotAI?parkId=${val}`
         if (this.closeParkRoute) {
          return
        }
        window.location.href = url   //  停车场id： 项目的停车场报表
      },

      /**
       *
       */
      /**
       *  实收
       *  url传递参数
       * @param val
       */
      routerGo(val) {
        this.$buryPoint('net-receipts')
        console.info('page:routerGo= ', val)
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}chargeRecord?proId=${val}`   //  项目id： 项目的收缴记录图表
        window.location.href = url
      },
     
      routerGos(val) {
        this.$buryPoint('paid-arrears')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}chargeRecord?proId=${val}`   //  项目id： 项目的收缴记录图表
        window.location.href = url
      },

      /**
       *  应收  实收
       */
      getMoney() {
        let that = this
        let params = {
          proidList:that.total.villageIDList.map(Number)
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + `/zjIncome/queryProYearInfo`, params).then(res => {
          let tempData = res.data.data
          that.yingShou = toThousands(tempData.yingShou);
          that.shiShou = toThousands(tempData.shiShou);
          that.wangqian = toThousands(tempData.hisArrears);
          that.yishou = toThousands(tempData.receiveLastYears);
        }).catch(err => {
          console.error(err)
        })
      },

      /**
       *   财务AI首页信息
       */
      getFinanceInfo() {
        let that = this
        let params = {
          proidList:that.total.villageIDList.map(Number)
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + `/zjIncome/queryProYearRateLowerThanAlarmCount`, params).then(res => {
          let rate = res.data.data
          // console.log('111',rate)
          this.rateNum = (Number(rate.yearRate)*100).toFixed(2) 
          this.count = rate.proidCount
          console.log('reteNum',this.rateNum)
        }).catch(err => {
          console.error(err)
        })
      },

      /**
       *  停车场AI首页信息
       */
      getParkingLotInfo() {
        let that = this
        that.parkingObj = []
        let params = {
          parkIds: that.total.parkIdList,
          managerId: GetUrlParam('userId'),   //that.project.managerId,
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + `/alarmAnalysis/getAlarmAnalysisMessageByParkIds`, params).then(res => {
          if (res.data.status == 0) {
            that.parkingObj = res.data.data
            console.log('shenji',that.parkingObj)
          }
        }).catch(err => {
          console.error(err)
        })
      },

      onLoad() {
        var that = this
        // 异步更新数据
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            that.list.push(this.list.length + 1);
          }
          // 加载状态结束
          that.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 20) {
            that.finished = true;
          }
        }, 500);
      }

    },

    created() {
      this.getTotalUser()
      localStorage.setItem('company_id',GetUrlParam('company_id'))
      localStorage.setItem('userId',GetUrlParam('userId'))
      localStorage.setItem('village_id',GetUrlParam('village_id'))
    }
  }
</script>

<style scoped>
  @import '../../stylus/operationIndex/base.css';
    #operationIndex .imgss{
         margin-right:10px;
         width: 0.18rem;
         position: absolute;
         right: 10px;
         margin-top:.13rem;
         z-index: 2222;
    }
  #operationIndex {
    font-size: .12rem;
    background-color: #F5F5F5;
    height: 100%;
  }

  #operationIndex .info {
    /*margin-left: 3px;*/
    padding-top: .1rem;
    padding-bottom: .1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
    border-top: 1px solid #EEEEEE;
    background-color: #fff;
  }

  #operationIndex .selectBtn {
    background-color: #fff;
  }

  #operationIndex .selectBtn .van-button--default {
    border-width: 0;
    font-size: 18px;
    margin-left: 6px;
  }


  #operationIndex .info .img {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: .15rem;
  }

  #operationIndex .info .img div {
    width: .96rem;
    height: .72rem;
  }

  /* #operationIndex .info .img .pic img{
        background-image: url('../../assets/operationIndex/operationIndex/data_pic_total@2x.png');
        background-repeat: no-repeat;
        background-size: contain;
  } */

  /* @media (min-resolution: 2dppx) {
    #operationIndex .info .img .pic {
        background-image: url("../../assets/operationIndex/operationIndex/data_pic_total@2x.png");
        background-repeat: no-repeat;
        background-size: contain;
    }
  }

  @media (min-resolution: 3dppx) {
    #operationIndex .info .img .pic {
         background-image: url("../../assets/operationIndex/operationIndex/data_pic_total@2x.png");
        background-repeat: no-repeat;
        background-size: contain;
    }
  } */

  #operationIndex .info .img .pic img {
    /*width: 9rem;*/
    /*height: 6rem;*/
  }


  #operationIndex .info .detail {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 72px;
    margin-left: 15px;
    /*padding-left: .4rem;*/
    /*padding-top: 0.4rem;*/
  }

  #operationIndex .info .detail .iconContainer div {
    display: flex;
    align-items: center;
    text-align: right;
    padding-right: .2rem;
    /*border:1px solid red;*/
  }

  #operationIndex .info .detail p {
    margin-bottom: .05rem;
    margin-top: 0;
    font-size: .14rem;
  }

  #operationIndex .itemContainer {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.12rem;
    /* height: .64rem; */
    /*border: 1px solid black;*/
    background-color: #fff;
  }

  #operationIndex .itemContainer .item {
    /*border: 1px solid red;*/
    padding-top: 0;
    padding-bottom: 0;
    flex: 40%;
    padding-left: .12rem;
    margin-top: .1rem;
    /* margin-bottom: .1rem; */
  }

  #operationIndex .itemContainer .item p {
    /* font-family: PingFangSC-Semibold; */
    color: #666666;
    font-size: .13rem;
    margin-top: 0;
    margin-bottom: .05rem;
    font-weight: 700;
  }

  #operationIndex .itemContainer .item h3 {
    margin-left: .28rem;
    font-size: .16rem;
    margin-top: 0;
  }

  #operationIndex .itemContainer li:nth-last-child(1) {
    border-left: .02rem solid #F5F5F5;
  }
  #operationIndex .itemContainer li:nth-last-child(3) {
    border-left: .02rem solid #F5F5F5;
  }

  #operationIndex .itemContainer li:nth-last-child(1) h3 {
    /*color: blue;*/
  }

  #operationIndex .FinanceAI, .parkingLotAI {
    /*padding: 1rem;*/
    /*border: 1px solid blue;*/
    background-color: #fff;
    margin: 4vw;
  }

  /*#operationIndex .FinanceAI .content {*/
  #operationIndex .content {
    display: flex;
    height: 70px;
    line-height: 20px;
    align-items: center;
    /*border: 1px solid red;*/
    overflow: hidden;
    text-overflow: ellipsis; /*  无效 */
    /*word-space:nowrap;*/
    /*-webkit-line-clamp: 2;*/
    /*-webkit-box-orient: vertical;*/
    margin-top: 0;
    -webkit-box-orient: vertical;
    /* 设置 display 为 -webkit-box 或者 -webkit-inline-box 时为隐藏状态 */
    /*display: -webkit-inline-box;*/ /* 设置后button不可见 */
  }
  #operationIndex .contents {
    display: flex;
    min-height: 60px;
    /* height: 70px; */
    flex-direction: column;
    line-height: 20px;
    align-items: center;
    /*border: 1px solid red;*/
    overflow: hidden;
    text-overflow: ellipsis; /*  无效 */
    /*word-space:nowrap;*/
    /*-webkit-line-clamp: 2;*/
    /*-webkit-box-orient: vertical;*/
    margin-top: 0;
    -webkit-box-orient: vertical;
    padding: 0.05rem .12rem
    /* 设置 display 为 -webkit-box 或者 -webkit-inline-box 时为隐藏状态 */
    /*display: -webkit-inline-box;*/ /* 设置后button不可见 */
  }
  #operationIndex .contents p{
    margin-top: .05rem ;
    margin-bottom : 0.05rem;
    font-size: .14rem;
    color: #313131;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* -webkit-line-clamp: 2; */
    -webkit-box-orient: vertical;
  }
  /*#operationIndex .FinanceAI .content p:nth-child(1){*/
  #operationIndex .content p:nth-child(1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    flex: 6;
    font-size: .14rem;
    /*border: 1px solid blue;*/
    word-space: nowrap;
    padding: 0 12px;
    color: #313131;
  }

  /*#operationIndex .FinanceAI .content .btnContainer{*/
  #operationIndex .content .btnContainer {
    flex: 2;
  }

  #operationIndex .FinanceAI .content .btn {
    text-align: center;
  }

  #operationIndex .FinanceAI .content .btn button {
    text-align: center;
  }

  #operationIndex .FinanceAI .content .btn .van-button {
    height: .28rem;
    line-height: .28rem;
    border: 1px solid #268AED;
    border-radius: .05rem;
    margin-right: .1rem;
  }

  .financeAndLot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F5F5F5;
  }

  .financeAndLot .van-icon {
    /*border: 1px solid  red;*/
    padding: .12rem .05rem .12rem .2rem;
    font-size: .2rem;
    color: #268AED
  }

  .financeAndLot .title {
    display: flex;
    align-items: center;
    line-height: .3rem;
    padding-left: .12rem;
  }

  .financeAndLot .title p {
    margin: 0;
    font-size: .16rem;
    font-weight: 600;
    color: #313131;
  }

  .common {
    display: block;
    margin-right: .15rem;
    width: .24rem;
    height: .24rem;
    /*border: 1px solid red;*/
  }

  #operationIndex .parkingLotAI .btn {
    text-align: center;
  }

  #operationIndex .parkingLotAI .btn button {
    border-width: 0;

  }


  .financeAndLot .finance {
    background-image: url('../../assets/operationIndex/operationIndex/data_ic_cai@2x.png');
    -webkit-background-size: cover;
    background-size: cover;
  }

  @media (min-resolution: 2dppx) {
    .financeAndLot .finance {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_cai@2x.png");
    }
  }

  @media (min-resolution: 3dppx) {
    .financeAndLot .finance {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_cai@3x.png");
    }
  }

  .financeAndLot .parking {
    background-image: url("../../assets/operationIndex/operationIndex/data_ic_car@2x.png");
    -webkit-background-size: cover;
    background-size: cover;
  }

  @media (min-resolution: 2dppx) {
    .financeAndLot .parking {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_car@2x.png");
    }
  }

  @media (min-resolution: 3dppx) {
    .financeAndLot .parking {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_car@3x.png");
    }
  }


  #operationIndex .report {
    padding: 0 .12rem;
    /*border: 1px solid green;*/
    margin: 2vw 2vw 8vw 2vw;
  }

  #operationIndex .report h4 {
    font-size: .16rem;
    font-weight: 600;
    color: rgba(49, 49, 49, 1);
    margin: 0 ;
    padding: 0.1rem 0;
  }

  #operationIndex .report .reportContainer {
    display: flex;
    justify-content: space-between;
    /*margin: 0 8px;*/
  }

  #operationIndex .report .reportContainer .common {
    /*border:1px solid red;*/
    height: .6rem;
    background-position: center;
  }

  #operationIndex .report .reportItem {
    /*border: 1px solid red;*/
    flex: 1;
    /*display: block;*/
    padding: 0 0.1rem;
    /*padding: 2vw 1vw;*/
    /*width: 41vw;*/
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
  #operationIndex .report .reportItem:nth-child(2){
    margin-left: .1rem
  }

  #operationIndex .report .reportItem p {
    font-size: .14rem;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  #operationIndex .report .reportItem .customer {
    background-image: url("../../assets/operationIndex/operationIndex/data_ic_myd@2x.png");
    -webkit-background-size: contain;
    background-size: contain;
    background-repeat: no-repeat;
  }

  @media (min-resolution: 2dppx) {
    #operationIndex .report .reportItem .customer {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_myd@2x.png");
    }
  }

  @media (min-resolution: 3dppx) {
    #operationIndex .report .reportItem .customer {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_myd@3x.png");
    }
  }

  #operationIndex .report .reportItem .callback {
    background-image: url("../../assets/operationIndex/operationIndex/data_ic_wback@3x.png");
    -webkit-background-size: contain;
    background-size: contain;
    background-repeat: no-repeat;
  }

  @media (min-resolution: 2dppx) {
    #operationIndex .report .reportItem .callback {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_wback@2x.png");
    }
  }

  @media (min-resolution: 3dppx) {
    #operationIndex .report .reportItem .callback {
      background-image: url("../../assets/operationIndex/operationIndex/data_ic_wback@3x.png");
    }
  }


</style>
