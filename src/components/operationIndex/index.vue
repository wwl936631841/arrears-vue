<template>
  <div id="operationIndex">
    <div style="border: .001rem solid #F5F5F5"></div>
    <div class="info">
      <div class="img">
        <div class="pic">
          <img :src="baseInfoObj.villagePhoto" alt="" width="100%" height="100%"/>
        </div>
      </div>
      <div class="detail">
        <p>建筑面积：<span>{{area}}</span>万㎡</p>
        <p>户数：<span>{{baseInfoObj.residentNum || 0}}</span>户</p>
        <div class="iconContainer">
          <van-col span="12">
            <van-icon name="location" color="#D1D1D1"></van-icon>
            <label style="margin-left: 4px; color:#666666">{{baseInfoObj.city_name}}</label>
          </van-col>
          <van-col span="12" style="display:flex; justify-content: flex-end">
            <img @click="goSummaryExplain" src="../../assets/operationIndex/operationIndex/data _ic_quetion@2x.png" width="18" height="18">
            <!-- <img class="imgss" @click="goSummaryExplain" src="../../assets/operationIndex/operationIndex/data _ic_quetion@2x.png" alt=""> -->
          </van-col>
        </div>
      </div>  
    </div>
    <ul class="itemContainer">
      <li class="item">
        <p style="display:flex; align-items: center;">
          <van-icon class="" style="margin-right:10px;" size=".16rem" color="#4789CC"
                    name="after-sale"></van-icon>
          本年累计应收(元)
        <h3>{{yingShou}}</h3>
        <!--</p>-->
      </li>
      <li class="item" @click="routerGo(project.proId)">
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
      <li class="item" @click="routerGos(project.proId)">
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
      <div class="financeAndLot" @click="toFinanceAI(project.proId)">
        <!-- <div class="financeAndLot"> -->
        <div class="title">
          <span class="common finance"></span>
          <p>财务AI分析</p>
        </div>
        <!--<a href="financeAI.html?proId=1">-->  <!-- &lt;!&ndash;  传递参数啊  &ndash;&gt;-->
        <a>   <!--传递参数啊-->
          <van-icon name="arrow" color="#999999"></van-icon>
        </a>
      </div>
      <div class="content">
        <p>
          {{financeObj.note}}
        </p>
        <!-- financeObj.neadCuijiao  1:需要催缴 0: -->     <!--  正常   不正常：去催缴  催缴中  已催缴-->
        <div class="btnContainer" v-if="baseInfoObj.company_id == 1">  <!-- 公司是保利才可以-->
          <div class="btn" v-if="financeObj.neadCuijiao && financeStatus == 0">
            <!--<button @click="gotoUrgePay(project.proId,project.managerId,financeObj.month)">-->
            <!--去催缴-->
            <!--</button>-->
            <van-button style="color: #268AED;padding: 0;width: 62px" plain type="info"
                        @click="gotoUrgePay(project.proId,project.managerId,curMonth)">去催缴
            </van-button>
          </div>
          <div class="btn" v-if="financeObj.neadCuijiao && financeStatus == 1">
            <p style="color: #268AED;" @click="urgePaying(project.proId,project.managerId,curMonth)">
              催缴中
            </p>
          </div>
          <div class="btn" v-if="financeObj.neadCuijiao && financeStatus == 2">
            <p style="color: #666666">已催缴</p>
          </div>
        </div>
      </div>
    </div>
    <div class="parkingLotAI">
      <div class="financeAndLot" @click="toParkingLotAI(parkId)">
        <!--<div class="financeAndLot">-->
        <div class="title">
          <span class="common parking"></span>
          <p>停车场AI分析</p>
        </div>
        <!-- <a href="parkingLotAI.html?parkId=20170331104355787912661096716697"> -->
        <a>
          <van-icon name="arrow" color="#999999"/>
        </a>
      </div>
      <div class="content">
        <p>
          {{parkingObj.information}}
        </p>
        <!-- 是否需要审计 1：不正常  ----》　再判断审计状态carAuditStatus  1   2-->
        <div class="btnContainer" v-if="this.baseInfoObj.company_id == 1">  <!-- 公司是保利才可以-->
          <div class="btn" v-if="parkingObj.state == 1 && carAuditStatus == 1">
            <!--<van-button  plain type="info">待审计</van-button>-->
            <p style="color:#666666">待稽查</p>
          </div>
          <div class="btn" v-if="parkingObj.state == 1 && carAuditStatus == 2">
            <van-button style="color: #666666;padding: 0 10px" plain type="info">已稽查</van-button>
          </div>
        </div>
      </div>
    </div>
    <div class="report">
      <h4>调查报告</h4>
      <div class="reportContainer">
        <a class="reportItem" href="zjh://?action=satisfaction_survey  ">
          <span class="customer common"></span>
          <p>
            客户满意度报告
          </p>
        </a>
        <a class="reportItem" href="zjh://?action=work_order">
          <span class="callback common"></span>
          <p>
            工单回访报告
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import {GetUrlParam, pathArr} from "../../assets/js/base";
  import { toThousands,isEmpty } from "@/utils/index.js";
  import axios from 'axios'
  export default {
    name: "operationIndex",
    data() {
      return {
        columns: [],  // 单选列表
        baseInfoList: [],  // onchange --> 到这里查找然后初始化对象
        baseInfoObj: {},  // 页面头部基础数据
        list: [],
        area:'',
        loading: false,
        finished: false,
        curMonth: '',   // 跳转风华传递的月份  当前月
        lastMonth: '',  // 上一个月
        wangqian:0,
        yishou:0,
        project: {
          proId: '',   // 项目id
          managerId: '',  // 项目经理id
        },
        yingShou: 0,
        shiShou: 0,

        financeObj: {},
        parkingObj: {},  //

        parkId: 0, // 当前项目的停车场id

        carAuditStatus: 1,  // 停车场AI状态    1:正   2:已   默认就是待审计
        financeStatus: 0,   // 财务AI分析状态  1:正   2:已    3.催缴流程不存在   0：默认，去催缴！
        closeParkRoute: false,   // 停车场可跳转
      }

    },
    watch: {
      '$route'(to, from) {
        this.getProjectId()
        this.curMonth = this.initMonthStr()
        this.lastMonth = this.initFinanceMonthStr()
      }
    },
    methods: {
      goSummaryExplain(){
          // this.$router.push({
          //     name:'summaryExplain'
          // })
          let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}summaryPage/summaryExplain`
          window.location.href = url
          console.log('解释',url)
      },
      /**
       * 当前月
       * @returns {number}
       */
      initMonthStr() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1  // 当前月
        let monthStr = month > 9 ? month : '0' + month
        return year + monthStr
      },
      /**  上月
       * @returns {*}
       */
      initFinanceMonthStr() {
        let date = new Date(), monthStr, year
        let month = date.getMonth() + 1 // 当前月
        if (month > 1) {
          year = date.getFullYear()
          monthStr = (month - 1) > 9 ? (month - 1) : '0' + (month - 1)
          return year + monthStr
        } else {  // 跨年
          year = date.getFullYear() - 1
          monthStr = '12'
          return year + monthStr
        }
      },
      /**
       *    http://arrears-info.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/operationIndex/chargeRecord.html
       *    项目id
       */
      toFinanceAI(val) {
        this.$buryPoint('financial-ai-analysis')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}financeAI?proId=${val}`
        window.location.href = url   //  项目id： 项目的财务报表
        console.log('url',url)
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
      toOperation() {
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}operation`
        window.location.href = url
      },
      /**
       *  实收
       *  url传递参数
       * @param val
       */
      routerGo(val) {
        this.$buryPoint('net-receipts')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}chargeRecord?proId=${val}`   //  项目id： 项目的收缴记录图表
        window.location.href = url
      },
      routerGos(val) {
        this.$buryPoint('paid-arrears')
        let url = `zjh://?action=new_page&url=${this.$envConfigObj.pageUrl}chargeRecord?proId=${val}`   //  项目id： 项目的收缴记录图表
        window.location.href = url
      },
      /**
       * 去催缴
       */
      gotoUrgePay(proId, userId, month) {
        this.$buryPoint('to-rush-to-pay')
        let url = `${this.$envConfigObj.pageUrl}arrears/urgePaymentOpen?userId=${userId}&village_id=${proId}&month=${month}`
        console.log('gotoUrgePay:', url)
        window.location.href = `zjh://?action=new_page&url=${url}`
      },
      urgePaying(proId, userId, month) {
        let url = `${this.$envConfigObj.pageUrl}arrears/urgePaymentOpen?userId=${userId}&village_id=${proId}&month=${month}`
        console.log('urgePaying:', url)
        window.location.href = `zjh://?action=new_page&url=${url}`
      },

      /**
       *   原生传递数据：proId  managerId
       *   获取项目id   切换数据啊    ----》 根据项目id查询项目经理的信息
       */
      getProjectId() {
        // this.project.proId = localStorage.getItem('uptownId')  // 项目id
        this.project.proId = GetUrlParam('village_id')  // 项目id
        this.project.managerId = GetUrlParam('userId')  // 项目经理id'
        this.project.companyId = GetUrlParam('company_id')
        if (window.localStorage) {
          localStorage.setItem('userId', this.project.managerId)
        }
        // this.project.companyId = this.baseInfoObj.company_id  // 公司id'
        console.info(`:: 首页url取参begin ::${new Date().getTime()}`)
        console.info('项目id ------->', this.project.proId)
        console.info('项目经理id ----->', this.project.managerId)
        console.info('公司id ----->', this.project.companyId)
        console.info(':: 首页url取参end ::')
        this.getProjById()
      },
      /**
       *  根据id查找项目   http://api.dev.zanjiahao.com/public/threshold/villageInfos?villageId=1
       */
      getProjById() {
        let that = this
        axios.get(`${this.$envConfigObj.projById}?villageId=${this.project.proId}`)  //  动态传递
          .then(function (res) {
            if (res.data.errorCode == 0) {
              let tempData = res.data.data
                that.baseInfoObj = tempData       //  页面数据绑定
              if(that.baseInfoObj.manage_area!='null'){
                that.area = (that.baseInfoObj.manage_area/10000).toFixed(2)

              }
              if (tempData.parkList.length > 0) {
                that.parkId = tempData.parkList[0].parkCode    // 更新停车场id
              } else {
                that.parkId = 0     //  没有车场id 赋值为0
              }
              that.project.proId = tempData.villageID   // 更新项目id  其他接口顺序调用
            } else {
              console.error('根据id查项目失败')
            }
          }).then(() => {
          that.getMoney()
          that.financeAIStatus()  //  财务催缴状态初始化
          that.parkingLotStatus()  //  停车场催缴状态初始化
          that.getParkingLotInfo()    //  停车场信息初始化
          that.getFinanceInfo()    //  AI信息初始化
        }).catch(function (err) {
          console.log(err);
        });
      },
      /**
       *  根据name查询对应的object   更新parkId  项目id
       */
      // getObjByName(name) {
      //   let that = this
      //   let obj = this.baseInfoList.forEach(function (item, index, arr) {
      //     if (item.name == name) {
      //       that.baseInfoObj = item       //  页面数据绑定
      //       that.parkId = item.parkId     // 更新停车场id
      //       that.project.proId = item.communityId   // 更新项目id
      //     }
      //   })
      //   console.log(that.baseInfoObj)
      // },

      /**
       *  应收  实收
       */
      getMoney() {
        let that = this
        let params = {
          proidList: [this.project.proId].map(Number),
          // method: this.chargeWay
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + pathArr.queryProYearInfo, params).then(res => {
          let tempData = res.data.data
          console.log(tempData)
            if(!isEmpty(tempData)){
                that.yingShou = toThousands(tempData.yingShou);
                that.shiShou = toThousands(tempData.shiShou);
                that.wangqian = toThousands(tempData.hisArrears);
                that.yishou = toThousands(tempData.receiveLastYears);
            }else{
                that.yingShou = 0;
                that.shiShou = 0;
                that.wangqian = 0;
                that.yishou = 0;
            }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       *   财务AI首页信息
       */
      getFinanceInfo() {
        let that = this
        console.log('project',that.project);
        that.financeObj = {};
        let params = {
          proId: this.project.proId,
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + pathArr.caiwuAlarmTask, params).then(res => {
          let { result, resultNote, data } = res.data;
          if(result == 1){
            this.$set(this.financeObj, 'note' , resultNote);
            return;
          }
          let tempData = data;
          if (tempData != null && tempData.note != null) {
            // 按高保真
            tempData.note = tempData.note.split(';')[0].toString();
            that.financeObj = tempData;
            console.log('financeObj',that.financeObj)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       *  财务AI是否启动催缴
       *  month: 当前月份
       */
      financeAIStatus() {
        let that = this
        // queryStatusByUptownId
        axios.get(this.$envConfigObj.cuiJiaoPath + pathArr.queryStatusByUptownId, {
          params: {
            uptownId: this.project.proId,
            month: this.curMonth,
          }
        }).then(function (res) {
          if (res.data.status == 0) {
            // 不为空  就赋值
            if (res.data.data != null) {
              console.log('333',res)
              that.financeStatus = res.data.data    // 1  2
            } else {
              that.financeStatus = 0
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
      },

      /**
       *  停车场AI首页信息
       */
      getParkingLotInfo() {
        let that = this
        that.parkingObj = {}
        let params = {
          parkId: that.parkId,
          managerId: that.project.managerId,
        }
        axios.post(this.$envConfigObj.dataAnalysisPath + pathArr.getHomeAlarmAnalysisList, params).then(res => {
          if (res.data.status == 0) {
            let tempData = res.data.data
            //  后端说： 接口可扩展
          if (tempData && tempData.length > 0) {
              that.parkingObj = tempData[0]
              that.parkingObj.type != 'YCTGL' ? that.closeParkRoute = true : that.closeParkRoute = false
            }
          } else {
            that.parkingObj = {}
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       *  停车场AI审计状态判断
       *  月份：上一个月
       */
      parkingLotStatus() {
        let that = this
        axios.get(`${this.$envConfigObj.auditPath}${pathArr.queryProcessStatus}/${this.project.proId}/${this.lastMonth}`).then(function (res) {
          if (res.data.status == 0) {
            that.carAuditStatus = res.data.data
          }
        }).catch(function (error) {
          console.log(error);
        });
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
      localStorage.setItem('company_id',GetUrlParam('company_id'))
      localStorage.setItem('userId',GetUrlParam('userId'))
      localStorage.setItem('village_id',GetUrlParam('village_id'))
      this.project.proId = GetUrlParam('village_id')  // 项目id
      // console.log('原生url：', location.href)
      this.getProjectId()  // 获取项目id
      this.curMonth = this.initMonthStr()
      this.lastMonth = this.initFinanceMonthStr()
      // 入口页面单独处理ios顶部距离样式
      document.body.style.height = '100vh'
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        //  留海屏  原生提供字段
        console.info('======== ios style change ===============')
        document.body.style.marginTop = '0px'
        document.body.style.height = ' calc( 100vh - 24px ) '
      } else {

      }
    },
    mounted() {
      console.log('催缴判断',this.financeStatus)
    }
  }
</script>

<style scoped>
  @import '../../stylus/operationIndex/base.css';

  #operationIndex {
    font-size: .12rem;
    background-color: #F5F5F5;
    height: 100vh;
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

  #operationIndex .info .img .pic {
    background-image: url('../../assets/operationIndex/operationIndex/no_pic@2x.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  /* @media (min-resolution: 2dppx) {
    #operationIndex .info .img .pic {
      background-image: url("../../assets/operationIndex/operationIndex/no_pic@2x.png");
    }
  }

  @media (min-resolution: 3dppx) {
    #operationIndex .info .img .pic {
      background-image: url("../../assets/operationIndex/operationIndex/no_pic@2x.png");
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

  #operationIndex .info .detail p:nth-child(3) {
    color: rgba(102, 102, 102, 1);
    font-size: 10px;
  }

  #operationIndex .itemContainer {
    display: flex;
    padding: 0 0.12rem;
    flex-wrap: wrap;
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
    margin-bottom: .1rem
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
    margin: .1rem .12rem;
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
    /* padding: 0 .12rem; */
    /*border: 1px solid green;*/
    margin: .1rem .12rem;
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
