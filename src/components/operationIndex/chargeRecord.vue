<template>
  <div id="chargeRecord">
    <van-nav-bar title="实收记录" left-arrow @click-left="onClickLeft" @click-right="clickToExplain">
      <van-icon name="question-o" size="0.18rem" slot="right"></van-icon>
    </van-nav-bar>

    <main>
        <div class="chargingWay receive">
        <h4>{{recordRange}}</h4>
        <van-row type="flex" justify="center" class="btnGroup">
          <button @click="setReceive(3,$event)" class="active" type="default">实收本年</button>
          <button @click="setReceive(4,$event)" type="default">实收往年</button>
        </van-row>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="chargeTypeRatio">

        </div>
        <div class="totalIncome">
          <span class="icon icon_total"></span>
          <span>{{receiveText}}：</span>
          <span>{{total}}</span>
        </div>
      </div>

      <div class="splitLine"></div>
      <!-- 往年欠款 -->
      <div class="previousOverdraft">
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div class="incomeHeader">
          <h4>往年欠款情况</h4>
        </div>
        <div class="textTip">
          <h4>年初往年应收总额：<i>{{yearOverdraftTotal}}</i>元</h4>
        </div>
        <div id="previousOverdraft">

        </div>
        <div class="previousOverdraftTotal">
          <span>往年欠费：<i>{{previousOverdraftTotal2}}</i>元</span>
          <span>截止{{previousOverdraftRange}}</span>
        </div>
      </div>

      <div class="splitLine"></div>

      <div class="incomeSituation">
        <div class="incomeHeader">
          <h4>收入情况</h4>
          <a class="active" @click="setRangeType(0,$event)">月</a> <!-- target --><a @click="setRangeType(1,$event)">年</a>
        </div>

        <van-row type="flex" justify="center" class="incomeBtnGroup">
          <button @click="setIncomeType(0,$event)" class="active" type="default">总收入</button>
          <button @click="setIncomeType(1,$event)" type="default">物业费</button>
          <button @click="setIncomeType(2,$event)" type="default">能耗费</button>
        </van-row>
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="incomeSituation">

        </div>
      </div>
      <div class="splitLine"></div>
      <div class="chargingWay">
        <div class="chargingWayHead">
          <h4>收费方式</h4>
          <!-- <p>{{chargeWayRange}}</p> -->
        </div>
        <van-row type="flex" justify="center" class="btnGroup">
          <button @click="setChargeWay(0,$event)" class="active" type="default">综合费用</button>
          <button @click="setChargeWay(1,$event)" type="default">物业费</button>
        </van-row>
        <div id="chargingWay">

        </div>
      </div>
    </main>

  </div>
</template>

<script>
  let echarts = require('echarts');
  import GetUrlParam from '@/utils/urlParse';
  import { isNullY } from '@/utils/index';
  import { toThousands } from "@/utils/index.js";
  export default {
    name: "chargeRecord",
    data() {
      return {
        project: {    // 项目收费类型年度实收及实收占比： 查询参数    上一个页面通过url传递过来
          proId: 0,
          year: '',
          proidList: [],
        },
        dateStr: '',
        chargeRatioLegend: [],　　//
        chargeRatioSeries: [],   //
        recordRange: '',
        total: '',   // 总收入 需要计算啊！  计算属性啊  比阿尼chargeRatio数组
        rangeType: 0,   // 收入情况： 月(0) || 年(1)
        incomeType: 0, // 收入情况： 总收入(0) ||  物业费(1)  || 能耗(2)
        chargeWay: 0,  // 收费方式： 综合费用(0) ||  物业费(1)
        tooltipStr: '总收入',  //
        //  数据渲染  这里要定义好对象啊    ajax请求
        timeSpanArr: [],   //  收入情况横轴坐标
        incomeArrY: [],  // 收入情况纵轴坐标
        incomeArrY1: [], // 收入情况

        receiveType: 3, // 实收本年(3) 实收往年(4)
        receiveText: '实收本年累计',

        previousOverdraftSeries: [], 
        previousOverdraftTotal: 0, // 往年欠款金额
        previousOverdraftTotal2: 0, // 往年欠款金额
        yearOverdraftTotal: 0, // 年初至今欠款金额
        previousOverdraftRange: 0, // 往年欠款截止日期

        chargeWayLegendArr: [],  // 收费方式数组
        chargeWayArr: [],   // 收费方式占比
        chargeWayRange: '', // 收费方式时间段
        errPNG: 'url(' + require('../../assets/operationIndex/error/error.png') + ')',
        emptyPNG: 'url(' + require('../../assets/operationIndex/error/empty@2x.png') + ')',
      }
    },

    methods: {
      /**
       * 获取项目id
       */
      initProId() {
        let currentDate = new Date();
        if(this.$utils.GetUrlParam('proId')){
          var str = this.$utils.GetUrlParam('proId')
           this.project.proidList = str.split(',').map(Number)
           this.project.year = currentDate.getFullYear();
           console.log('获取了参数',this.project.proidList)
         }
      },

      /**
       * 切换active
       */
      toggleActive(dom) {
        dom.className = 'active'   // 激活   当前激活，另一个取消状态
        let parentNode = dom.parentNode
        for (let i = 0, j = parentNode.childNodes; i < j.length; i++) {
          if (j[i].innerText != dom.innerText) {
            j[i].className = ''
          }
        }
      },

      onClickLeft() {
        let fromPhone = GetUrlParam('fromPhone')
        if ((fromPhone == "android") || (fromPhone == "iOS")) {
            window.location.href = "zjh://close"
        } else if (fromPhone == null) {
            this.$router.go(-1)
        }
      },

      /**
       *  改变状态  ---》  调用请求方法  ---》 更新图表
       * @param type
       * @param $event
       */
      setRangeType(type, $event) {
        this.rangeType = type
        // 手动调用啊    可以写成计算属性的方式的！　　　依赖缓存的设计　
        this.toggleActive($event.target)
        this.timeSpanArr = []
        this.incomeArrY = []
        this.incomeArrY1 = []
        // 根据类型做表格渲染
        this.chargeCondititon(0)
      },

      /**
       *  选择收入类型
       *  0：总收入   1：物业费   2：能耗      改变状态  ---》  调用请求方法  ---》 更新图表
       */
      setIncomeType(type, $event) {
        this.incomeType = type
        this.toggleActive($event.target)
        this.timeSpanArr = []
        this.incomeArrY = []
        this.incomeArrY1 = []
        // 根据类型做表格渲染
        this.chargeCondititon(type)
      },

      /**
       *  选择实收类型
       *  3：实收本年   4：实收往年      改变状态  ---》  调用请求方法  ---》 更新图表
       */
      setReceive(type, $event) {
        this.receiveType = type
        this.toggleActive($event.target)
        this.chargeRatioLegend = []
        this.chargeRatioSeries = []
        this.receiveText = type === 3 ? '实收本年累计':'实收往年累计'
        this.getChargeType(type)
      },

      /**
       *  选择收费方式
       */
      setChargeWay(type, $event) {
        this.chargeWay = type
        this.toggleActive($event.target)
        this.chargeWayArr = []
        this.chargeWayLegendArr = []
        // 根据类型做表格渲染
        this.getChargingWay()
      },

      /**
       *  一：收费类型和占比    初始化数组 
       * @param type 3: 实收往年 4: 实收本年
       */

      getChargeType(type) {
        let that = this
        let myChart = echarts.init(document.getElementById('chargeTypeRatio'));
        let $dom = document.getElementById('chargeTypeRatio')
        $dom.style.backgroundImage = 'none'
        let chargeTypeConfig = {
          title: {
            x: 'center',
            top: 'top',
          },
          color: ['#1CC8AE', '#2652ED', '#268AED', '#9013FE', '#FFBC4F', '#F55023'],
          tooltip: {
            trigger: 'item',
            formatter: "{b}:<br/> {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            top: '6%',
            itemHeight: 12,
            itemWidth: 12,
            width: '96%',
            data: that.chargeRatioLegend,
            formatter: function (name) {
              let index
              that.chargeRatioSeries.forEach(function (item, idx, arr) {
                if (item.name == name) {
                  index = idx
                }
              })
              return `{name|${name}}\n{price|￥${that.chargeRatioSeries[index].value}}`
            },
            textStyle: {
              width: '10%',
              rich: {
                name: {
                  fontSize: 12,
                  verticalAlign: 'top',
                  align: 'left',
                  padding: [0, 0, 6, 4]
                },
                price: {
                  fontSize: 12,
                  align: 'left',
                  padding: [0, 4, 0, 4],
                  lineHeight: 20
                }
              }
            }
          },
          grid: {
            bottom: 10,
          },
          series: [
            {
              name: '费用类型占比：',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['50%', '70%'],
              label: {
                show: true,
                formatter: '{b}: \n {d}%',
                rich: {
                  align: 'left',
                  borderWidth: 1,
                  borderColor: 'red',
                },
              },
              data: that.chargeRatioSeries
            }
          ],
        };
        myChart.setOption(chargeTypeConfig)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = Object.assign({method: type}, this.project)
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.queryProChargeYearInfo, params).then(function (res) {
          myChart.hideLoading()
          if (res.data.result == 0) {
            if (res.data.data == null) {
              that.$utils.SetEmptyStyle($dom,that.emptyPNG)
              myChart.dispose();
            }
            let tempArr = res.data.data.charges
            for (let i = 0; i < tempArr.length; i++) {
              let obj = {}
              obj.value = tempArr[i].shishou
              obj.name = tempArr[i].ccName
              that.chargeRatioLegend.push(tempArr[i].ccName)
              that.chargeRatioSeries.push(obj)
            }
            that.total = toThousands(res.data.data.shishouSum);
            that.recordRange = res.data.data.range
            //  Rerender
            myChart.setOption({
              // title: {
              //   text: that.dateStr,
              // },
              legend: {
                data: that.chargeRatioLegend
              },
              series: [
                {
                  data: that.chargeRatioSeries
                }
              ],
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err);
        });
      },

      // 获取往年欠款情况
      getOverdraft() {
        let that = this
        let myChart = echarts.init(document.getElementById('previousOverdraft'));
        let $dom = document.getElementById('previousOverdraft')
        $dom.style.backgroundImage = 'none'
        let chargeTypeConfig = {
          title: {
            text: that.dateStr,        //  这里最好接口传递一下   或者自己从url取出来  做拼接
            x: 'center',
            top: 'top',
          },
          color: ['#1CC8AE', '#268AED'],
          tooltip: {
            trigger: 'item',
            formatter: "{b}:<br/> {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            top: '6%',
            itemHeight: 12,
            itemWidth: 12,
            width: 375,
            data: ['已收往年欠款', '未收往年欠款'],
          },
          grid: {
            bottom: 10,
          },
          series: [
            {
              name: '费用类型占比：',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['50%', '60%'],
              label: {
                show: true,
                formatter: '￥{c} \n {d}%',
                rich: {
                  align: 'left',
                  borderWidth: 1,
                  borderColor: 'red',
                },
              },
              data: that.previousOverdraftSeries
            }
          ],
        };
        myChart.setOption(chargeTypeConfig)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.queryProHisArrearsInfo, this.project).then(function (res) {
          myChart.hideLoading()
          if (res.data.result == 0) {
            if (res.data.data == null) {
              that.$utils.SetEmptyStyle($dom,that.emptyPNG)
              myChart.dispose();
            }
            let tempArr = res.data.data
            that.previousOverdraftTotal2 = toThousands((tempArr.hisArrears - tempArr.receiveLastYears).toFixed(2));
            that.previousOverdraftTotal = (tempArr.hisArrears - tempArr.receiveLastYears).toFixed(2);
            that.yearOverdraftTotal = toThousands(tempArr.hisArrears);
            that.previousOverdraftRange = tempArr.range
            that.previousOverdraftSeries = [{
              value: tempArr.receiveLastYears,
              name: '已收往年欠款'
            },{
              value: that.previousOverdraftTotal,
              name: '未收往年欠款'
            }]
            //  Rerender
            myChart.setOption({
              series: [
                {
                  data: that.previousOverdraftSeries
                }
              ],
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(function (err) {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err);
        });
      },

      switchTooltip(type) {
        switch (type) {
          case 0:
            return '总收入';
          case 1:
            return '物业费';
          case 2:
            return '能耗';
        }
      },

      /**
       *  二：收入情况查询
       *  @param  rangeType   月(default) ||  月
       *  @param  incomeType  总收入(default) ||  物业费 ||  能耗
       */
      chargeCondititon(type) {
        let that = this
        this.tooltipStr = this.switchTooltip(type)
        // console.info('tooltipStr', this.tooltipStr)
        let myChart = echarts.init(document.getElementById('incomeSituation'));
        let $dom = document.getElementById('incomeSituation')
        $dom.style.backgroundImage = 'none'
        let option = {
          tooltip: {
            trigger: 'axis',
            //formatter: '{a}:{c}<br/>{a1}:{c1}'
          },
          legend: {
            data: this.rangeType === 0 ? ['实收本月', '实收往月'] : ['实收本年', '实收往年'],
            top: '2%',
            itemHeight: 12,
            itemWidth: 12,
          },
          grid: {
            top: 40,
            left: '2%',
            right: '4%',
            bottom: '11%',                //  这里解决dataZoom与坐标轴重叠
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: that.buildingRateX,
              nameRotate: 60,
              axisTick: {
                alignWithLabel: false,
                rotate: 60,
              },
              axisPointer: {
                type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  color: '#E7E7E7'
                }
              },
              axisLabel: {
                show: true,
                interval: '0',
                formatter: '{value}',
                textStyle: {
                  color: '#525B6D'
                }
              },
              data: that.timeSpanArr
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: function(value, index) {
                  let conditions = isNullY(that.incomeArrY) && isNullY(that.incomeArrY1);
                  if(conditions) return value
                  return value/10000 + 'W'
                },
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
              name: this.rangeType === 0 ? '实收本月':'实收本年',   //  这里要设置响应式的哦！
              type: 'bar',   // 
              data: that.incomeArrY,
              itemStyle: {
                color: '#268AED'
              },
              smooth: true
            },
            {
              name: this.rangeType === 0 ? '实收往月':'实收往年',   
              type: 'bar',   // 
              data: that.incomeArrY1,
              itemStyle: {
                color: '#6DD5C5'
              },
              smooth: true
            },
          ],
          dataZoom: [
            {
              type: 'inside',
              show: true,
              startValue: 0,
              endValue: 5,
              minSpan: 20,
              minValueSpan: 6,
              maxValueSpan: 6,
              zoomLock: true,
              showDetail: false,
            }
          ],

        };
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = Object.assign({
          chargeClass: this.incomeType,
          method: this.rangeType,
        }, this.project)
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.queryProMonYearTrend, params).then(res => {
          myChart.hideLoading()
          if (res.data.result == 0) {
            if (res.data.data == null) {
              myChart.dispose();
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let rs = res.data.data.detail
            for (let i = 0; i < rs.length; i++) {
              that.timeSpanArr.push(rs[i].x)
              that.incomeArrY.push(rs[i].y)
              that.incomeArrY1.push(rs[i].y1)
            }
            // Rerender
            myChart.setOption({
              xAxis: [
                {
                  data: that.timeSpanArr
                }
              ],
              series: [
                {
                  data: that.incomeArrY,
                  // name: that.tooltipStr,    //  根据type传递值啊！　   取值可否
                },
                {
                  data: that.incomeArrY1
                }
              ],
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(err => {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err)
        })
      },

      /**
       *  三：收费方式查询
       *  @param  chargeWay   综合费用(0) ||  物业费(1)
       */
      getChargingWay() {
        let that = this
        let myChart = echarts.init(document.getElementById('chargingWay'));
        let $dom = document.getElementById('chargingWay')
        $dom.style.backgroundImage = 'none'
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
          },
          color: ['#268AED', '#1CC8AE', '#2652ED', '#9013FE', '#FFBC4F', '#F55023', '#F57323'],
          grid: {
            y: 30,
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            top: '8%',
            // borderWidth: 2,
            itemGap: 30,
            // padding: 15,
            itemWidth: 12,
            itemHeight: 12,
            width: 300,
            data: that.chargeWayLegendArr,
            borderRadius: 0,
            textStyle: {
              padding: [0, 0, 0, 5]
            }
          },
          series: [
            {
              name: '共计',
              type: 'pie',
              label: {
                show: true,
                formatter: '{b}: \n {d}%',
              },
              radius: ['30%', '50%'],
              center: ['50%', '70%'],
              data: that.chargeWayArr
            }
          ]
        };
        myChart.setOption(option)
        myChart.showLoading({
          text: '',
          color: '#268AED',
        })
        let params = Object.assign({method: this.chargeWay}, this.project)
        this.axios.post(this.$envConfigObj.dataAnalysisPath + this.$utils.pathArr.queryProPayMethPer, params).then(res => {
          myChart.hideLoading()
          if (res.data.result == 0) {
            if (res.data.data == null) {
              myChart.dispose();
                that.$utils.SetEmptyStyle($dom,that.emptyPNG)
            }
            let rs = res.data.data.pays
            that.chargeWayRange = res.data.data.range
            for (let i = 0; i < rs.length; i++) {
              let obj = {}
              that.chargeWayLegendArr.push(rs[i].payName)
              obj.name = rs[i].payName
              obj.value = rs[i].shishou
              that.chargeWayArr.push(obj)
            }
            // Rerender
            myChart.setOption({
              legend: {
                data: that.chargeWayLegendArr,
              },
              series: [
                {
                  data: that.chargeWayArr
                }
              ]
            })
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom,that.errPNG)
          }
        }).catch(err => {
          myChart.hideLoading()
          myChart.dispose()
          that.$utils.SetErrorStyle($dom,that.errPNG)
          console.log(err)
        })
      },

      // 跳转指标解释页面
      clickToExplain() {
        this.$router.push({ path: '/indicatorExplain', query: {name: 'Record'} })
      }
    },

    created() {
      this.$utils.OverWriteCSS()
      this.initProId()
    },

    beforeMount() {
    },

    mounted() {
      this.getChargeType(3)
      this.chargeCondititon(0)
      this.getChargingWay()
      this.getOverdraft()
    }
  }
</script>

<style scoped>
  @import '../../stylus/operationIndex/base.css';
  main{
    height: 90vh;
    overflow: auto;
  }
  #chargeRecord{
    background-color: #fff;
  }
  #chargeRecord .van-nav-bar__title{
    font-size: 17px;
  }
  #chargeRecord .van-nav-bar__arrow{
    font-size: 20px;
    color:#666666;
    font-weight: 600;
  }
  #chargeRecord #chargeTypeRatio {
    margin: 0 -.14rem;
    margin-top: .1rem;
    height: 500px;
  }

  #chargeRecord .totalIncome {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .13rem;
    height: 30px;
    border-top: 1px solid rgb(245,245,245);
    padding: 0.1rem .5rem 0.1rem .5rem;
  }
  #chargeRecord .totalIncome .icon{
    display: block;
    width: 16px;
    height: 16px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 5px;
  }
  #chargeRecord .totalIncome .icon_total{
    background-image: url("../../assets/operationIndex/chargeRecord/icon_total@2x.png");
  }
  @media(min-resolution: 2dppx) {
    #chargeRecord .totalIncome .icon_total{
      background-image: url("../../assets/operationIndex/chargeRecord/icon_total@2x.png");
    }
  }
  @media (min-resolution: 3dppx){
    #chargeRecord .totalIncome.icon_total{
      background-image: url('../../assets/operationIndex/chargeRecord/icon_total@3x.png') ;
    }
  }

  #chargeRecord .totalIncome span:nth-of-type(2){
    color: #666666;
    font-size: .13rem;
  }
  #chargeRecord .totalIncome span:nth-of-type(3){
    font-weight: 600;
    font-size: .18rem;
  }




  #chargeRecord .splitLine{
    height: .1rem;
    background: rgb(245,245,245);
    margin-top: .06rem;
  }

  #chargeRecord .totalIncome .van-icon{
    padding-right: .3rem;
    font-size: .13rem;
  }


  #chargeRecord .incomeSituation {
    text-align: center;
    margin: 0 .1rem;
    height: 3.75rem;
  }

  #chargeRecord .incomeSituation .incomeHeader{
    display: flex;
    align-items: center;
    height: 50px;
    margin-bottom: .1rem;
  }

  .incomeSituation .incomeHeader h4{
    flex: 9;
    text-align: left;
    font-size: .16rem;
    margin: 0;
  }
  
  .incomeSituation .incomeHeader a{
    flex:1;
    font-size: .14rem;
    width: .3rem;
  }
  .incomeSituation .incomeHeader a:first-of-type{
    margin-right: .3rem;
  }
  .incomeSituation .incomeHeader a.hover{
    background: darkgray;
  }
  .incomeSituation .incomeHeader a.active{
    color: rgb(38,138,237);
    border-bottom: 3px solid rgb(38,138,237);
  }

  .incomeSituation .incomeBtnGroup{
    z-index: 99999999;
    /*border: 1px solid red;*/
    position: relative;     /*  解决flex布局导致的z-indx失效问题   */
  }
  .incomeSituation .incomeBtnGroup button:first-of-type{
    border-radius: 10em 0 0 10em;
    border-left: 1px solid #ebedf0;
  }
  .incomeSituation .incomeBtnGroup button:nth-child(2){
    border-left: 1px solid #ebedf0;
    border-right: 1px solid #ebedf0;
  }
  .incomeSituation .incomeBtnGroup button:last-of-type{
    border-radius: 0 10em 10em 0;
    border-right: 1px solid #ebedf0;
  }
  .incomeSituation .incomeBtnGroup button{
    width: .7rem;
    height: .34rem;
    font-size: .13rem;
    line-height: .32rem;
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
    border-left-width: 0;
    border-right-width: 0;
    background: rgb(255,255,255);
    /* padding: 0 5px; */
  }
  .incomeSituation .incomeBtnGroup button.active{
    background: rgb(38,138,237);
    border: 2px solid rgb(38,138,237);
    color: #fff;
    line-height: 30px;
  }


  #incomeSituation {
    display: flex;
    height: 275px;
    margin: 0 -.1rem;
    /*width: calc(100vw - 2rem);*/
  }
  #chargeRecord .chargingWay{
    margin: 0 .14rem;
  }
  #chargeRecord .chargingWay .chargingWayHead {
    height: 50px;
    margin-bottom: .1rem;
    display: flex;
    align-items:center;
    justify-content: space-between;
  }

  .chargingWay .chargingWayHead h4, .chargingWay .chargingWayHead p {
    font-size:.16rem;
    color:rgba(3, 3, 3, 1);
    margin: 0;
  }
  #chargeRecord .chargingWay .btnGroup button:first-of-type{
    border-radius: 10em 0 0 10em;
    border-left: 1px solid #ebedf0;
  }
  #chargeRecord .chargingWay .btnGroup button:last-of-type{
    border-radius: 0 10em 10em 0;
    border-left: 1px solid #ebedf0;
    border-right: 1px solid #ebedf0;
  }
  .incomeSituation .incomeBtnGroup button:nth-child(2){
    border-left: 1px solid #ebedf0;
    border-right: 1px solid #ebedf0;
  }
  .chargingWay .btnGroup button{
    width: 100px;
    height: 34px;
    font-size: .14rem;
    line-height: 32px;
    border-top: 1px solid #ebedf0;
    border-bottom: 1px solid #ebedf0;
    border-left-width: 0;
    border-right-width: 0;
    background: rgb(255,255,255);
    padding: 0 5px;
  }
  #chargeRecord .chargingWay .btnGroup button.active{
    background: rgb(38,138,237);
    border: 2px solid rgb(38,138,237);
    color: #fff;
  }

  #chargingWay {
    height: 368px;
    margin-bottom: .5rem;
    margin: 0 -.14rem;
  }
  .van-nav-bar__title{
    font-weight: 700;
  }
  #chargeRecord .chargingWay.receive{
    margin-top: .2rem;
  }
  #chargeRecord .chargingWay.receive h4{
    font-size: .16rem;
    font-weight: 600;
    text-align: center;
    line-height: 1;
    margin-bottom: .2rem;
  }

  #previousOverdraft{
    height: 320px;
    margin: 0 -.1rem;
  }
  .previousOverdraft{
    margin: 0 .1rem;
  }
  .previousOverdraft .incomeHeader{
    display: flex;
    align-items: center;
    padding-top: .15rem;
  }
  .previousOverdraft .incomeHeader h4{
    text-align: left;
    font-size: .16rem;
    margin: 0;
  }
  .previousOverdraft .previousOverdraftTotal{
    display: flex;
    font-size: .14rem;
    justify-content: space-between;
    border-top: 1px solid #eee;
    padding:  .15rem 0;
  }
  .previousOverdraft .textTip{
    position: relative;
  }
  .previousOverdraft .textTip h4{
    font-weight: normal;
    line-height: 1;
    border-bottom: 1px solid #EEEEEE;
    font-size: .14rem;
    padding: .12rem 0 .12rem .2rem;
    margin: 0;
    color: #666666;
  }
  .previousOverdraft .textTip h4::before{
    content: '';
    width: .16rem;
    height: .16rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../../assets/operationIndex/chargeRecord/icon_qk.png');
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  @media(min-resolution: 2dppx) {
    .previousOverdraft .textTip h4::before{
      background-image: url("../../assets/operationIndex/chargeRecord/icon_qk@2x.png");
    }
  }
  @media (min-resolution: 3dppx){
    .previousOverdraft .textTip h4::before{
      background-image: url('../../assets/operationIndex/chargeRecord/icon_qk@3x.png') ;
    }
  }
  .previousOverdraft .previousOverdraftTotal span{
    flex: 2;
  }
  .previousOverdraft .previousOverdraftTotal span:last-child{
    flex: 1;
    text-align: right;
    font-size: .12rem;
  }
  .previousOverdraft .previousOverdraftTotal i, .previousOverdraft .textTip i{
    font-weight: 700;
    font-style: normal;
  }
</style>
