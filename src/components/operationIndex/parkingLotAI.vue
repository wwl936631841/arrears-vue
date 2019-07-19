<template>
  <div id="parkingLotAI">
    <van-nav-bar title="停车场AI分析" left-arrow @click-left="onClickLeft" @click-right="clickToExplain">
      <van-icon name="question-o" size="0.18rem" slot="right"></van-icon>
    </van-nav-bar>
    <main>
      <van-panel title="基础数据" style="background: #F5F5F5">
        <ul class="basicData">
          <li v-if="parkIdList.length===1">
            <span class="item icon_park"></span>
            <div>
              <h4>车位总数</h4>
              <strong>{{totalLot}}</strong>
            </div>
          </li>
          <li v-if="parkIdList.length===1">
            <span class="item icon_card"></span>
            <div>
              <h4>月卡数量</h4>
              <strong>{{parkCardCount}}</strong>
            </div>
          </li>
          <li v-if="parkIdList.length>1">
            <span class="item icon_fac"></span>
            <div>
              <h4>厂商数量(个)</h4>
              <strong>{{suppliersCount}}</strong>
            </div>
          </li>
          <li v-if="parkIdList.length>1">
            <span class="item icon_car"></span>
            <div>
              <h4>车场数量(个)</h4>
              <strong>{{parkNum}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_minput"></span>
            <div>
              <h4>今日应收(元)</h4>
              <strong>{{ysAmount}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_total_b"></span>
            <div>
              <h4>今日实收(元)</h4>
              <strong>{{ssAmount}}</strong>
            </div>
          </li>
        </ul>
      </van-panel>
      <div class="splitLine"></div>
      <div class="exception">
        <div style="display: flex">
          <ul class="exceptionHead">
            <li style="flex:5" class="firstTitle">免费放行情况</li>
            <li style="flex: 1">
              <a class="active" @click="setRangeType(0,$event)">日</a>
            </li>
            <li style="flex: 1">
              <a @click="setRangeType(1,$event)">月</a>
            </li>
          </ul>
        </div>
        <div style="margin-top: 0.12rem;" class="btnGroup">
          <van-row type="flex" justify="center">
            <button class="active" @click="byMoneyOrAmount(0,$event)"><span class="icon icon_m_l subActive"></span><span
              class="text">金额</span></button>
            <button @click="byMoneyOrAmount(1,$event)"><span class="icon icon_n_r_s"></span><span class="text">数量</span>
            </button>
          </van-row>
        </div>
        <!-- 日金额   日金额和月金额是通用的啊 -->
        <div id="money">

        </div>
        <!-- 切换的时候显示icon -->
        <div class="totalInfo" v-show="moneyShow">
          <div>
            <img src="../../assets/operationIndex/parkingLotAI/icon_cash@2x.png" width="16" height="16">
            <span>{{isOneDay?'今日':'本月'}}免费:</span>
            <span>{{readyMoney}}</span>
          </div>
          <div>
            <img src="../../assets/operationIndex/parkingLotAI/icon_zb@2x.png" width="16" height="16">
            <span>占比:</span>
            <span>{{readyMoneyRatio}}%</span>
          </div>
        </div>
        <div class="totalInfo" v-show="amountShow">
          <div>
            <img src="../../assets/operationIndex/parkingLotAI/Rectangle23@2x.png" width="16" height="16">
            <span style="">异常抬杆数:</span>
            <span>{{exceptionUpNum}}</span>
          </div>
          <div>
            <img src="../../assets/operationIndex/parkingLotAI/icon_zb@2x.png" width="16" height="16">
            <span>占比:</span>
            <span>{{exceptionUpRatio}}%</span>
          </div>
        </div>
      </div>
      <div class="splitLine"></div>

      <div style="margin: 0 .12rem;" class="chargeContainer">
        <h4 class="firstTitle">收费情况</h4>
        <div id="chargeSituation">
        </div>
        <div style="display:flex; align-items: center; justify-content: center; margin-top: .1rem;margin-bottom: .14rem;">
          <img src="../../assets/operationIndex/parkingLotAI/icon_total@2x.png" alt="" width="16" height="16">
          <span style="color:#666666;font-size:14px;font-weight:400;margin-left: 3px;">实收：</span>
          <span style="color:#313131;font-size:18px;font-weight:600;">{{totalMoney}}</span>
        </div>
      </div>
      <div class="splitLine"></div>

      <div style="margin: 0 .12rem;">
        <h4 class="firstTitle">停车出入情况</h4>
        <div id="inAndOutSituation">

        </div>
      </div>
      <div class="splitLine"></div>

      <div style="margin: .12rem;">
        <h4 class="firstTitle">车位使用率</h4>
        <div id="parkingUseRate">

        </div>
      </div>
      <div class="splitLine"></div>

      <div class="alarmInfo" v-if="parkIdList.length===1">
        <h4 class="firstTitle">告警分析</h4>
        <ul v-html="alarmInfo"></ul>
      </div>
      <div style="margin: 0 .12rem;" class="anaysis" v-else>
        <h4 class="firstTitle">指标分析</h4>
        <div class="btnGroup textTip">
          <h4>免费金额过高</h4>
        </div>
        <div id="indicatorAnaysisFree">

        </div>

        <div class="btnGroup textTip cash">
          <h4>现金缴费过高</h4>
        </div>
        <div id="indicatorAnaysisCash">

        </div>
      </div>
      <div class="splitLine"></div>
    </main>
  </div>
</template>

<script>
  import { toThousands } from "@/utils/index.js";
  let echarts = require('echarts')
  export default {
    name: "parkingLotAI",
    data() {
      return {
        //  数据渲染  这里要定义好对象啊    ajax请求
        parkLotId: null,  //  停车场id
        parkIdList: [], // 停车场id列表
        // 可以以对象的形式写的  然后Object.assign
        totalLot: 0,  //车位总数
        parkCardCount: 0,  // 月卡数量
        suppliersCount: 0, // 供应商数量
        parkNum: 0, // 停车场数量
        ysAmount: 0, // 今日应收
        ssAmount: 0,  // 今日实收

        // ExceptionLegend: [],   // 异常放行情况图例数组
        exceptionOutX: [],   // 异常放行X轴
        yyMoneyArr: [],   // 应收money数组
        freeMoneyArr: [],  // 免费money数组
        moneyRatioArr: [], // 免费金额占比

        exceptionOutX1: [], // 异常放行X轴：数量
        exceptionCarAmount: [],   // 异常放行Y轴：数量
        exceptionCarRatio: [],   // 异常放行Y轴：异常率

        /* 异常放行金额：现金 占比 */
        readyMoney: 0,
        readyMoneyRatio: 0,
        /* 异常放行数量：异常抬竿数  占比 */
        exceptionUpNum: 0,
        exceptionUpRatio: 0,
        moneyShow: true,
        amountShow: false,


        chargeWayArr: [],  //  收费情况
        totalMoney: 0,     // 收费情况 -> 实收

        // chargeSituationTitle: '',    // 收费情况 -> 标题

        parkingSituationX: [],  // 停车出入情况X轴
        parkingSituationy1: [],  // 停车出入情况Y轴：入场
        parkingSituationy2: [],  // 停车出入情况Y轴：出场

        parkingUseRateX: [],  // 车位使用率x轴
        parkingUseRateY: [],   // 车位使用率y轴

        indicatorAnaysisFreeX: [], // 免费金额过高
        indicatorAnaysisFreeY1: [],
        indicatorAnaysisFreeY2: [],

        indicatorAnaysisCashX: [], //现金缴费过高
        indicatorAnaysisCashY1: [],
        indicatorAnaysisCashY2: [],

        alarmInfo: '',   //   告警分析结果

        moneyFlag: true,
        amountFlag: false,
        isOneDay: true, //免费放行是否为 日放行
        errPNG: 'url(' + require('../../assets/operationIndex/error/error.png') + ')',
        emptyPNG: 'url(' + require('../../assets/operationIndex/error/empty@2x.png') + ')',
      }
    },
    methods: {
      /**
       *  传递项目id
       */
      initProId() {
        var str =  this.$utils.GetUrlParam('parkId') 
        this.parkIdList = str.split(',')
        console.log('参数', str.split(','))
      },

      /**
       *  改变状态  ---》  调用请求方法  ---》 更新图表
       * @param type   0: 日  1：月
       * @param $event
       */
      setRangeType(type, $event) {
        this.isOneDay = type === 0 ? true : false
        if (type == 0) {
          this.moneyShow = true
          this.amountShow = false
        } else {
          this.moneyShow = false
          this.amountShow = true
        }
        let domArr = document.querySelectorAll('.exceptionHead li a')
        for (let i = 0; i < domArr.length; i++) {
          domArr[i].className = ''
        }
        $event.target.className = 'active'
        this.exceptionOutX = []
        this.yyMoneyArr = []
        this.freeMoneyArr = []
        this.moneyRatioArr = []

        this.exceptionOutX1 = []
        this.exceptionCarAmount = []
        this.exceptionCarRatio = []

        // 清除缓存
        // moneyChart.clear()
        // amountChart.clear()
        if (type == 0) {
          // 更新日信息
          this.byMoneyOrAmount(0, $event)
          this.getParkHandUprodDayList()
          // document.getElementsByClassName('btnGroup')[0].firstChild.firstChild.firstChild.classList.add('subActive')
          // 因为初始化之后存在两个button子元素都没有subActive类，所以给金额button子元素添加这个类名
          document.querySelector('.btnGroup div .active').childNodes[0].classList.add('subActive')
        } else {
          // 更新月信息
          this.byMoneyOrAmount(0, $event)
          this.selectByParkIdAndDataMonth()
          // 因为初始化之后存在两个button子元素都没有subActive类，所以给金额button子元素添加这个类名
          document.getElementsByClassName('btnGroup')[0].firstChild.firstChild.firstChild.classList.add('subActive')
        }
      },

      onClickLeft() {
        location.href = 'zjh://close'
      },

      /**
       *   金额  ||  数量
       */
      byMoneyOrAmount(type, $event) {
        if (type == 0) {
          this.moneyShow = true
          this.amountShow = false
        } else {
          this.moneyShow = false
          this.amountShow = true
        }
        let dom = $event.target
        let allSiblings = document.querySelectorAll('.btnGroup button')
        for (let i = 0; i < allSiblings.length; i++) {
          allSiblings[i].className = ''
          allSiblings[i].childNodes[0].classList.remove('subActive')
          if (dom.tagName.toLocaleLowerCase() == 'button') {       //  加一个判断就好)
            dom.className = 'active'
            allSiblings[0].childNodes[0].classList.remove('subActive')
            dom.childNodes[0].classList.add('subActive')
          } else if (dom.parentNode.tagName.toLocaleLowerCase() == 'button') {
            dom.parentNode.className = 'active'
            allSiblings[1].childNodes[0].classList.remove('subActive')
            dom.parentNode.childNodes[0].classList.add('subActive')
          }
          if (type == 0) {
            this.initExceptionByMoney()
          } else {
            this.initExceptionByAmount()
          }
        }
      },

      /**
       *  一： 获取停车场基础数据
       */
      getParkBasicData() {
        let that = this
        let params = {
          parkId: this.parkLotId,
          managerId: 5146,
          parkIdList: this.parkIdList
        }
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.selectByParkId, params).then(function (res) {
          that.totalLot = parseInt(res.data.data.totalLot)
          that.parkCardCount = parseInt(res.data.data.parkCardCount)
          that.suppliersCount = parseInt(res.data.data.suppliers)
          that.parkNum = parseInt(res.data.data.parkNum)
          that.ysAmount = parseInt(res.data.data.ysAmount)
          that.ssAmount = parseInt(res.data.data.ssAmount)
        }).catch(function (err) {
          console.error(err)
        })
      },

      /**
       *  二： 异常放行： 日
       */
      getParkHandUprodDayList() {
        let that = this, dateStr, monthStr
        let $dom = document.getElementById('money')
        $dom.style.backgroundImage = 'none'
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
        dateStr = year + month + day
        let params = {
          parkId: this.parkLotId
        }
        let queryString = this.parkIdList.join('&parkIdList=')
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.getParkHandUprodDayList + '?parkIdList=' + queryString).then(function (res) {
          if (res.data.status == 0) {
            if (res.data.data.length == 0) {
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.exceptionOutX.push(tempArr[i].dataDay)  // 异常放行X轴
              that.yyMoneyArr.push(tempArr[i].ysAmount)     // 应收money数组
              that.freeMoneyArr.push(tempArr[i].errFreeAmount)  // 免费money数组
              // that.moneyRatioArr.push(tempArr[i].freeProfit.toFixed(2) * 100 + '%')  // 免费金额占比
              that.moneyRatioArr.push(tempArr[i].freeProfit.toFixed(2))  // 免费金额占比
              // "20190404"  当前日期和这个判断
              if (dateStr == tempArr[i].dataDay) {
                // 日金额
                that.readyMoney = tempArr[i].errFreeAmount
                that.readyMoneyRatio = tempArr[i].freeProfit.toFixed(2)
                // 日数量
                that.exceptionUpNum = tempArr[i].totalCnt   // 免费车辆
                that.exceptionUpRatio = tempArr[i].errProfit.toFixed(2)  // 免费率
              }
              that.exceptionOutX1.push(tempArr[i].dataDay)    //  放行情况: X轴
              that.exceptionCarAmount.push(tempArr[i].errFreeCnt)   // 免费车辆数
              that.exceptionCarRatio.push(tempArr[i].errProfit.toFixed(2))   // 免费占比
            }
            // echarts init
            that.initExceptionByMoney()
          } else {
            // 报错
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err)
        })
      },

      /**
       * 二： 异常放行： 月
       */
      selectByParkIdAndDataMonth() {
        let date = new Date()
        let $dom = document.getElementById('money')
        $dom.style.backgroundImage = 'none'
        let year = date.getFullYear()
        let month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        let monthStr = year + month
        let that = this
        let params = {
          parkId: this.parkLotId
        }
        let queryString = this.parkIdList.join('&parkIdList=')
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.selectByParkIdAndDataMonth + '?parkIdList=' + queryString).then(function (res) {
          if (res.data.status == 0) {
            if (res.data.data.length == 0) {
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.exceptionOutX.push(tempArr[i].dataDay)  // 异常放行X轴
              that.yyMoneyArr.push(tempArr[i].ysAmount)     // 应收money数组
              that.freeMoneyArr.push(tempArr[i].errFreeAmount)  // 免费money数组
              that.moneyRatioArr.push(tempArr[i].freeProfit.toFixed(2))  // 免费金额占比
              if (monthStr == tempArr[i].dataDay) {
                // 月金额
                that.readyMoney = tempArr[i].errFreeAmount
                that.readyMoneyRatio = tempArr[i].freeProfit.toFixed(2)
                // 月数量
                that.exceptionUpNum = tempArr[i].errFreeCnt   // 
                that.exceptionUpRatio = tempArr[i].errProfit.toFixed(2)  // 
              }
              that.exceptionOutX1.push(tempArr[i].dataDay)    //  异常放行情况：数量 ：X轴
              that.exceptionCarAmount.push(tempArr[i].errFreeCnt)   // 异常车辆数
              that.exceptionCarRatio.push(tempArr[i].errProfit.toFixed(2))   // 异常率
            }
            // echarts init
            that.initExceptionByMoney()
          } else {
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          console.error(err)
          that.$utils.SetErrorStyle($dom,that.errPNG)
        })
      },

      /**
       *  三：收费情况
       */
      selectParkTotalRevenueByPakrId() {
        let that = this
        let myChart = echarts.init(document.getElementById('chargeSituation'));
        let $dom = document.getElementById('chargeSituation')
        $dom.style.backgroundImage = 'none'

        let option = {
          tooltip: {
            trigger: 'item',
          },
          color: ['#1CC8AE', '#268AED'],
          grid: {
            top: '40%',
            bottom: 0,
          },
          title: {
            text: `${new Date().getMonth()} 月现金收费情况`,
            x: 'center',
            y: '0',
            textStyle: {
              color: '#666666',
              fontSize: 14,
              fontWeight: 400,
            }
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 30,
            itemHeight: 12,
            itemWidth: 12,
            data: ['现金', '线上']
          },
          series: [
            {
              name: '收费方式占比',
              type: 'pie',
              radius: ['35%', '50%'],
              center: ['50%', '60%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                formatter: '{b}:{c}\n{d}%'
              },
              labelLine: {
                show: true,
              },
              data: that.chargeWayArr,
            }
          ]
        };
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = {
          parkId: this.parkLotId
        }
        let queryString = this.parkIdList.join('&parkIdList=')
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.selectParkTotalRevenueByPakrId + '?parkIdList=' + queryString).then(function (res) {
          myChart.hideLoading()
          if (res.data.status == 0) {
            if (res.data.data == null) {
              myChart.dispose()
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let temp = res.data.data
            that.chargeWayArr = [{
              name: '现金',
              value: temp.cashAmount
            }, {
              name: '线上',
              value: temp.onlineAmount,
            }]
            that.totalMoney = toThousands(temp.ssAmount);
            myChart.setOption({
              series: [
                {
                  data: that.chargeWayArr,
                }
              ]
            })
          } else {
            myChart.dispose()
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.dispose()
          console.error(err)
          that.$utils.SetErrorStyle($dom,that.errPNG)
        })
      },

      /**
       * 四：停车出入情况
       */
      selectByParkIdAndDay() {
        let that = this
        let myChart = echarts.init(document.getElementById('inAndOutSituation'));
        let $dom = document.getElementById('inAndOutSituation')
        $dom.style.backgroundImage = 'none'
        let option = {
          title: {
            text: `${new Date().getMonth()}月份出入场情况`,
            x: 'center',
            textStyle: {
              color: '#666666',
              fontSize: 14,
              fontWeight: 400,
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            y: '30',
            data: ['入场', '出场']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: that.parkingSituationX,
            axisLine: {
              lineStyle: {
                color: '#E7E7E7'
              }
            },
            axisLabel: {
              color: '#525B6D'
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999'
            },
            splitLine: {
              lineStyle: {
                  type: 'dashed'
                }
            }
          },
          series: [
            {
              name: '入场',
              type: 'line',
              stack: '总量',
              data: that.parkingSituationy1,
              itemStyle: {
                color: '#268AED'
              },
              smooth: true
            },
            {
              name: '出场',
              type: 'line',
              stack: '总量',
              data: that.parkingSituationy2,
              itemStyle: {
                color: '#1CC8AE'
              },
              smooth: true
            }
          ]
        }
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = {
          parkId: this.parkLotId
        }
        let queryString = this.parkIdList.join('&parkIdList=')
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.selectByParkIdAndDay + '?parkIdList=' + queryString).then(function (res) {
          myChart.hideLoading()
          if (res.data.status == 0) {
            if (res.data.data.length == 0) {
              myChart.dispose()
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.parkingSituationX.push(tempArr[i].dataHour + ':00')
              that.parkingSituationy1.push(parseInt(tempArr[i].inCount))
              that.parkingSituationy2.push(parseInt(tempArr[i].outCount))
            }
            myChart.setOption({
              xAxis: {
                data: that.parkingSituationX,
              },
              series: [
                {
                  data: that.parkingSituationy1,
                },
                {
                  data: that.parkingSituationy2,
                }
              ]
            })
          } else {
            myChart.dispose()
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.dispose();
          console.error(err)
          that.$utils.SetErrorStyle($dom,that.errPNG)
        })
      },

      /**
       * 五：车位使用率
       */
      parkingUseRate() {
        let that = this
        let myChart = echarts.init(document.getElementById('parkingUseRate'));
        let $dom = document.getElementById('parkingUseRate')
        $dom.style.backgroundImage = 'none'
        let option = {
          title: {
            text: `${new Date().getMonth()}月份车位使用率`,
            x: 'center',
            textStyle: {
              color: '#666666',
              fontSize: 14,
              fontWeight: 400,
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            formatter: '{c}%',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: that.parkingUseRateX,
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              },
              axisLabel: {
                color: '#525B6D'
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}%',
                color: '#999'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            }
          ],
          series: [
            {
              areaStyle: {
                color: '#E2F2FF'
              },
              name: '使用率',
              type: 'line',
              stack: '总量',
              data: that.parkingUseRateY,
              itemStyle: {
                color: '#268AED'
              }
            }
          ]
        }
        // 为echarts对象加载数据
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = {
          parkId: this.parkLotId
        }
        let queryString = this.parkIdList;
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.selectByParkIdHour + '?parkIdList=' + queryString).then(function (res) {
          myChart.hideLoading()
          if (res.data.status == 0) {
            if (res.data.data.length == 0) {
              myChart.dispose()
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.parkingUseRateX.push(tempArr[i].dataHour + ':00')
              that.parkingUseRateY.push(tempArr[i].usedProfit.toFixed(2))
            }
            myChart.setOption({
              xAxis: [
                {
                  data: that.parkingUseRateX,
                }
              ],
              series: [
                {
                  data: that.parkingUseRateY,
                }
              ]
            })
          } else {
            myChart.dispose()
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.error(err)
        })
      },

      /**
       * 六：告警分析
       */
      getAlarmAnalysisList() {
        let that = this
        let params = {
          parkId: this.parkIdList.toString()
        }
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.getAlarmAnalysisList, params).then(function (res) {
          if (res.data.status == 0) {
            if (res.data.data.length == 0) return
            let tempArr = res.data.data, str = ``
            for (let i = 0; i < tempArr.length; i++) {
              str += `<li style="font-size: .14rem">${tempArr[i].information}</li>`
            }
            that.alarmInfo = str
          } else {
            console.error('接口请求失败')
          }
        }).catch(function (err) {
          console.error(err)
        })
      },

      /**
       * 异常放行情况： by  金钱
       */
      initExceptionByMoney() {
        // 好坑的接口啊  这里只能手动维护了
        let buttonArr = document.querySelector('.btnGroup button')
        buttonArr.className = 'active'
        buttonArr.nextElementSibling.className = ''
        // buttonArr[0].className = 'active'
        // 基于准备好的dom，初始化echarts图表
        let that = this
        let moneyChart = echarts.init(document.getElementById('money'));
        moneyChart.clear()
        let exceptionByMoney = {
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}:{c2}%',
          },
          legend: {
            data: ['应收', '免费', '占比'],
            top: '8%',
            itemHeight: 12,
            itemWidth: 12,
          },
          grid: {
            left: '12%',
            right: '13%',
            bottom: '8%',
          },
          xAxis: [
            {
              type: 'category',
              data: that.exceptionOutX,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                color: '#525B6D'
              },
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              // name: '应收',
              // min: 0,
              // max: 250,
              // interval: 1000,
              axisLabel: {
                formatter: function(value, index) {
                  if(value === 0) return value
                  return value/10000 + 'W'
                },
                color: '#999999'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}%',
                color: '#999999'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '应收',
              type: 'bar',
              data: that.yyMoneyArr,
              itemStyle: {
                color: '#268AED'
              }
            },
            {
              name: '免费',
              type: 'bar',
              data: that.freeMoneyArr,
              itemStyle: {
                color: '#6DD5C5'
              }
            }
            ,
            {
              name: '占比',
              type: 'line',
              yAxisIndex: 1,
              data: that.moneyRatioArr,
              itemStyle: {
                color: '#86C3FF'
              }
            }
          ]
        };
        // 为echarts对象加载数据
        moneyChart.setOption(exceptionByMoney)
      },

      /**
       *  异常放行情况： by  数量
       */
      initExceptionByAmount() {
        // 基于准备好的dom，初始化echarts图表
        let that = this
        let amountChart = echarts.init(document.getElementById('money'));
        let exceptionByAmount = {
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}%',
          },
          legend: {
            data: ['异常车辆', '异常率'],
            top: '8%',
            itemHeight: 12,
            itemWidth: 12,
          },
          grid: {
            left: '12%',
            right: '12%',
            bottom: '10%',
          },
          xAxis: [
            {
              type: 'category',
              data: that.exceptionOutX1,
              axisPointer: {
                type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              },
              axisLabel: {
                color: '#525B6D'
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              // name: '异常车辆',
              // min: 0,
              // max: 250,
              // interval: 1000,
              axisLabel: {
                // formatter: '{value} ml'
                color: '#999'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            {
              type: 'value',
              // name: '异常率',
              // min: 0,
              // max: 25,
              // interval: 5,
              axisLabel: {
                formatter: '{value}%',
                color: '#999'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '异常车辆',
              type: 'bar',
              data: that.exceptionCarAmount,
              itemStyle: {
                color: '#268AED',
              }
            },
            {
              name: '异常率',
              type: 'line',
              yAxisIndex: 1,
              data: that.exceptionCarRatio,
              itemStyle: {
                color: '#1CC8AE'
              }
            }
          ]
        };
        amountChart.clear()
        // 为echarts对象加载数据
        amountChart.setOption(exceptionByAmount)

      },

      /** 
       * 指标分析 免费放行金额高于限定阙值项目
       */
      indicatorAnaysisFree() {
        let that = this
        let myChart = echarts.init(document.getElementById('indicatorAnaysisFree'));
        let $dom = document.getElementById('indicatorAnaysisFree')
        $dom.style.backgroundImage = 'none'
        let option = {
          title: {
            text: `免费放行金额高于限定阙值项目`,
            x: 'center',
            textStyle: {
              color: '#525B6D',
              fontSize: 14,
              fontWeight: 400,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{a0}: {c0}<br/>{a1}: {c1}'
          },
          legend: {
            data: ['免费放行金额', '阀值'],
            y: '30',
            itemHeight: 12,
            itemWidth: 12,
          },
          xAxis: [
            {
              type: 'category',
              data: that.indicatorAnaysisFreeX,
              axisPointer: {
                type: 'shadow'
              },
              nameRotate: 60,
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              },
              axisLabel: {
                interval: 0,
                color: '#525B6D',
                formatter: function (value, index) {
                  if (value && value.length > 5) {
                    return value.substr(0, 4) + '\n' + value.substr(4)
                  } else if (value && value.length > 10) {
                    return value.substr(0, 4) + '\n' + value.substr(4, 9) + '\n' + value.substr(9)
                  }
                  return value
                },
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                fontSize: 11,
                align: 'right',
                color: '#999',
                formatter: function(value, index) {
                  if(value === 0) return value
                  return value/10000 + 'W'
                },
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
          ],
          grid: {
            bottom: '10%',
            left: '12%',
            right: '12%',
          },
          dataZoom: [
            {
              type: 'inside',
              show: true,
              startValue: 0,
              endValue: 4,
              minValueSpan: 5,
              maxValueSpan: 5,
              zoomLock: true,
            }
          ],
          series: [
            {
              name: '免费放行金额',
              type: 'bar',
              data: that.indicatorAnaysisFreeY1,
              barWidth: 20,
              itemStyle: {
                color: '#268AED',
              }
            },
            {
              name: '阀值',
              type: 'line',
              // yAxisIndex: 1,
              data: that.indicatorAnaysisFreeY2,
              itemStyle: {
                color: '#1CC8AE'
              },
              label: {
                show: true,
                position: 'right',
                formatter: function({value}) {
                  if(value === 0) return value
                  return value/10000 + 'W'
                },
              }
            }
          ]
        };
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = {
          // proId: this.parkLotId,
          parkIds: this.parkIdList
        }
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.getAlarmAnalysisMFFXJE, params).then(function (res) {
          myChart.hideLoading()
          if (res.data.status == 0) {
            if (res.data.data == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.indicatorAnaysisFreeX.push(tempArr[i].parkName)
              that.indicatorAnaysisFreeY1.push(tempArr[i].value)
              that.indicatorAnaysisFreeY2.push(tempArr[i].threshold)
            }
            myChart.setOption({
              xAxis: [
                {
                  data: that.indicatorAnaysisFreeX,
                }
              ],
              series: [
                {
                  data: that.indicatorAnaysisFreeY1,
                },
                {
                  data: that.indicatorAnaysisFreeY2,
                }
              ]
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err)
        })
      },

      /** 
       * 指标分析 现金收费比例高于阙值项目
       */
      indicatorAnaysisCash() {
        let that = this
        let myChart = echarts.init(document.getElementById('indicatorAnaysisCash'));
        let $dom = document.getElementById('indicatorAnaysisCash')
        $dom.style.backgroundImage = 'none'
        let option = {
          title: {
            text: `现金收费比例高于阙值项目`,
            x: 'center',
            textStyle: {
              color: '#525B6D',
              fontSize: 14,
              fontWeight: 400,
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{a0}: {c0}%<br/>{a1}: {c1}%'
          },
          legend: {
            data: ['现金比例', '阀值'],
            y: '30',
            itemHeight: 12,
            itemWidth: 12,
          },
          xAxis: [
            {
              type: 'category',
              data: that.indicatorAnaysisCashX,
              axisPointer: {
                type: 'shadow'
              },
              nameRotate: 60,
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              },
              axisLabel: {
                interval: 0,
                color: '#525B6D',
                formatter: function (value, index) {
                  if (value && value.length > 5) {
                    return value.substr(0, 4) + '\n' + value.substr(4)
                  } else if (value && value.length > 10) {
                    return value.substr(0, 4) + '\n' + value.substr(4, 9) + '\n' + value.substr(9)
                  }
                  return value
                },
              },
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
              fontSize: 11,
                align: 'right',
                color: '#999',
                formatter: '{value}%'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
          ],
          grid: {
            bottom: '10%',
            left: '12%',
            right: '12%',
          },
          dataZoom: [
            {
              type: 'inside',
              show: true,
              startValue: 0,
              endValue: 4,
              minValueSpan: 5,
              maxValueSpan: 5,
              zoomLock: true,
            }
          ],
          series: [
            {
              name: '现金比例',
              type: 'bar',
              data: that.indicatorAnaysisCashY1,
              barWidth: 20,
              itemStyle: {
                color: '#1CC8AE',
              }
            },
            {
              name: '阀值',
              type: 'line',
              // yAxisIndex: 1,
              data: that.indicatorAnaysisCashY2,
              itemStyle: {
                color: '#268AED'
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}%'
              }
            }
          ]
        };
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = {
          // proId: this.parkLotId,
          parkIds: this.parkIdList
        }
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.getAlarmAnalysisXJJNBL, params).then(function (res) {
          myChart.hideLoading()
          if (res.data.status == 0) {
            if (res.data.data == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let tempArr = res.data.data
            for (let i = 0; i < tempArr.length; i++) {
              that.indicatorAnaysisCashX.push(tempArr[i].parkName)
              that.indicatorAnaysisCashY1.push(tempArr[i].value)
              that.indicatorAnaysisCashY2.push((tempArr[i].threshold-0).toFixed(2))
            }
            myChart.setOption({
              xAxis: [
                {
                  data: that.indicatorAnaysisCashX,
                }
              ],
              series: [
                {
                  data: that.indicatorAnaysisCashY1,
                },
                {
                  data: that.indicatorAnaysisCashY2,
                }
              ]
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err)
        })
      },
      // 跳转指标解释页面
      clickToExplain() {
        this.$router.push({ path: '/indicatorExplain', query: {name: 'Parking'} })
      }
    },

    created() {
      this.$utils.OverWriteCSS()
      this.initProId()
    },

    mounted() {
      this.getParkBasicData()
      this.getParkHandUprodDayList()    // 日
       if(this.parkIdList.length ===1){
         this.getAlarmAnalysisList()   //  告警分析
       }else{
         this.indicatorAnaysisFree() // 指标分析 （免费金额过高）
         this.indicatorAnaysisCash() // 指标分析 （现金缴费过高）
       }
      this.selectParkTotalRevenueByPakrId()
      this.selectByParkIdAndDay()
      this.parkingUseRate()
    }
  }
</script>

<style scoped>
  @import '../../stylus/operationIndex/base.css';
  main{
    height: 90vh;
    overflow: auto;
  }
  #parkingLotAI .van-nav-bar__title{
    font-size: 17px;
  }
  #parkingLotAI .van-panel__header{
    background-color: #EEEEEE;
  }
  .splitLine {
    height: .1rem;
    background: #EEEEEE;
  }
  #parkingLotAI .van-nav-bar__arrow{
    font-size: 20px;
    color:#666666;
    font-weight: 600;
  }
  #parkingLotAI header {
    display: flex;
    padding: 5px 10px;
    height: 30px;
    line-height: 30px;
  }

  #parkingLotAI .van-cell__title span {
    color: rgba(3, 3, 3, 1);
    font-size: .16rem;
    font-weight: bold;
  }

  #parkingLotAI header .van-icon {
    padding: 5px 10px;
    flex: 1;
    cursor: pointer;
  }

  #parkingLotAI header label {
    flex: 2
  }

  #parkingLotAI .basicData {
    display: flex;
    flex-wrap: wrap;
    background-color: #EEEEEE;
  }

  #parkingLotAI .basicData li {
    border: 1vw solid #fff;
    padding: 4vw 0;
    border-collapse: collapse;
    width: 47.3vw;
    display: flex;
    justify-content: right;
    margin-left: 5px;
    background-color: #fff;
    margin-top: 5px;
  }
  #parkingLotAI .basicData li:nth-child(1){
    margin-left: 0;
  }
  #parkingLotAI .basicData li:nth-child(3){
    margin-left:0;
  }

  #parkingLotAI .basicData li div {
    display:flex;
    flex-direction: column;
    flex: 3;
    height: .6rem;
  }

  #parkingLotAI .basicData li div h4 {
    margin: 5px 0;
    font-weight: 500;
    color: #666;
  }

  #parkingLotAI .basicData .item {
    flex: 1;
    display: block;
    margin-left: 15px;
    margin-top: 2px;
    /*border: 1px solid red;*/
    width: 24px;
    height: 24px;
    background-size: 24px 24px;
    background-repeat: no-repeat;
  }
  #parkingLotAI .basicData li h4{
    font-size: 14px;
  }
  #parkingLotAI .basicData li strong{
    font-size: .2rem;
  }

  #parkingLotAI .basicData .icon_park {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_park@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_park {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_park@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_park {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_park@3x.png');
    }
  }

  #parkingLotAI .basicData .icon_card {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_card@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_card {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_card@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_card {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_card@3x.png');
    }
  }

  #parkingLotAI .basicData .icon_minput {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_minput@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_minput {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_minput@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_minput {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_minput@3x.png');
    }
  }

  #parkingLotAI .basicData .icon_total_b {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_total_b@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_total_b {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_total_b@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_total_b {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_total_b@3x.png');
    }
  }

  #parkingLotAI .basicData .icon_fac {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_fatory@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_fac {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_fatory@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_fac {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_fatory@3x.png');
    }
  }

  #parkingLotAI .basicData .icon_car {
    background-image: url('../../assets/operationIndex/parkingLotAI/icon_car@2x.png');
  }

  @media (min-resolution: 2dppx) {
    #parkingLotAI .basicData .icon_car {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_car@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    #parkingLotAI .basicData .icon_car {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_car@3x.png');
    }
  }


  .exception .exceptionHead {
    flex-grow: 1;
    display:flex;
    align-items: center;
    /*border: 1px solid red;*/
    margin: .12rem;
  }

  .exception .exceptionHead li{
    display:flex;
  }

  .exception .exceptionHead a {
    display: inline-block;
    padding: 0.1rem .1rem;
    font-size: .14rem;
    font-weight: 500;
  }

  .exception .exceptionHead a:visited {
    border-bottom: 2px solid green;
  }

  .exception .exceptionHead a:link {
    color: blue;
  }

  .exception .exceptionHead a.active {
    border-bottom: 3px solid #268AED;
    color: #268AED;
  }

  .exception .btnGroup {

  }

  .exception .totalInfo {
    display: flex;
    justify-content: space-around;
    margin: .12rem .12rem;
  }

  .exception .totalInfo div {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
  .exception .totalInfo div:nth-child(1) {
    justify-content: flex-start;
  }
  .exception .totalInfo div:nth-child(2) {
    display:flex;
    justify-content: flex-end;
    text-align:left;
  }
  .exception .totalInfo div span:nth-child(3){
    color: #313131;
    font-size: 18px;
    font-weight: 600;
  }



  .exception .totalInfo div span {
    color: #666666;
    font-size: 14px;
    margin-left: 5px;
  }

  .exception .btnGroup button:first-of-type {
    border-radius: 10em 0 0 10em;
    border-left: 1px solid #ebedf0;
  }

  .exception .btnGroup button:nth-child(2) {
    border-left: 1px solid #ebedf0;
    border-right: 1px solid #ebedf0;
  }

  .exception .btnGroup button:last-of-type {
    border-radius: 0 10em 10em 0;
    border-right: 1px solid #ebedf0;
  }

  .exception .btnGroup button {
    display: flex;
    align-items: center;
    font-size: .14rem;
    width: 100px;
    height: 34px;
    line-height: 32px;
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
    border-left-width: 0;
    border-right-width: 0;
    background: rgb(255, 255, 255);
    padding: 0 5px;
    position: relative;
  }

  .exception .btnGroup button.active {
    background: rgb(38, 138, 237);
    border: 2px solid rgb(38, 138, 237);
    color: #fff;
  }

  .exception .btnGroup .icon {
    display: inline-block;
    margin-right: 5px;
    width: 16px;
    height: 15px;
    /*border: 1px solid red;*/
    background-size: 16px 15px;
    background-repeat: no-repeat;
    /*position: relative;*/
    /*right: 5px;*/
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    /* margin-left: -35px; */
  }
  .exception .btnGroup .text {
    position: absolute;
    left: 40px;
    top: 50%;
    transform: translateY(-50%);
  }

  .exception .exceptionInfo {
    margin: 1rem;
  }

  .exception .btnGroup .icon_m_l {
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_m_l_s@2x.png");
  }
  .exception .btnGroup .active .subActiveMoney{                          /*  money */
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_m_l_s@2x.png");
  }
  .exception .btnGroup .icon_m_l.subActive {
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_m_l@2x.png");
  }
  @media (min-resolution: 2dppx) {
    .exception .btnGroup .icon_m_l {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_m_l_s@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    .exception .btnGroup .icon_m_l {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_m_l_s@2x.png');
    }
  }

  .exception .btnGroup .icon_n_r_s {
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_n_r_s@2x.png");
  }
  .exception .btnGroup .subActiveAmount {
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_m_r@2x.png");     /*  amount */
  }
  .exception .btnGroup .icon_n_r_s.subActive {
    background-image: url("../../assets/operationIndex/parkingLotAI/icon_m_r@2x.png");     /*  amount */
  }
  @media (min-resolution: 2dppx) {
    .exception .btnGroup .icon_n_r_s {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_n_r_s@2x.png');
    }
  }

  @media (min-resolution: 3dppx) {
    .exception .btnGroup .icon_n_r_s {
      background-image: url('../../assets/operationIndex/parkingLotAI/icon_n_r_s@3x.png');
    }
  }


  #money {
    height: 48vh;
    /*border: 1px solid red;*/
    border-bottom: 1px solid #EEEEEE;
    /* margin: 0 4vw; */
  }

  #amount, #inAndOutSituation,#parkingUseRate, #indicatorAnaysisFree,#indicatorAnaysisCash {
    height: 45vh;
    margin: 0 -.12rem;
  }
  #indicatorAnaysisFree,#indicatorAnaysisCash{
    padding-bottom: .1rem;
  }
  #chargeSituation {
    height: 45vh;
    border-bottom: 1px solid #EEEEEE;
    margin: 0 -.12rem;
  }

  .alarmInfo {
    margin: .12rem;
  }

  .alarmInfo ul li {
    padding: 4px 0px;
    line-height: 25px;
    color: #666;
    font-size: .14rem;
  }
  #parkingLotAI .firstTitle{
    color: #030303;
    font-size: 16px;
    font-family:PingFangSC-Medium;
    font-weight:600;
  }
  .van-nav-bar__title{
    font-weight: 700;
  }
  .anaysis .btnGroup{
    font-size: .14rem;
    color: #666666;
    margin-top: -.1rem;
  }
  .anaysis .btnGroup h4{
    font-weight: normal;
    line-height: 1;
    padding-bottom: .15rem;
    border-bottom: 1px solid #EEEEEE;
  }
  .anaysis .btnGroup.cash h4{
    font-weight: normal;
    line-height: 1;
    padding-top: .15rem;
    border-top: 1px solid #EEEEEE;
    border-bottom: 0;
  }
  .anaysis .btnGroup.textTip h4::before{
    content: '';
    display: inline-block;
    width: .08rem;
    height: .08rem;
    border-radius: 50%;
    background-color: #268AED;
    margin-right: .08rem;
  }
  .anaysis .btnGroup.cash h4::before{
    background-color: #1CC8AE;
  }
</style>
