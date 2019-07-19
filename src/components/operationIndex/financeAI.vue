<template>
  <div id="financeAI">
    <van-nav-bar title="财务AI分析" left-arrow @click-left="onClickLeft" @click-right="clickToExplain">
      <van-icon name="question-o" size="0.18rem" slot="right"></van-icon>
    </van-nav-bar>
    <main>
      <div style="margin: 0 .1rem;">
        <div class="collectionRate">
          <h3 class="firstTitle">收缴率</h3>
          <p style="color:#666666">{{range}}</p>
        </div>
        <div class="collectionRate" v-if="query.proidList.length===1">
          <h4>{{proName}}收缴率</h4>
          <div>
            <span style="color:#999999;font-size: .16rem;font-weight:normal;margin-right: .2rem;">排名</span>
            <span style="color:#268AED; font-size: .2rem; font-weight: 600;">第{{rank}}名</span>
          </div>
        </div>
        <div id="collectionRate"></div>
        <ul class="detail">
          <!-- <li>
            <span class="item icon_a"></span>
            <div>
              <h4>住宅物业费</h4>
              <strong>{{property}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_b"></span>
            <div>
              <h4>空调使用费</h4>
              <strong>{{airConditioning}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_c"></span>
            <div>
              <h4>多种经营</h4>
              <strong>{{mixin}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_d"></span>
            <div>
              <h4>车位费</h4>
              <strong>{{parkingSpace}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_e"></span>
            <div>
              <h4>能耗</h4>
              <strong>{{energy}}</strong>
            </div>
          </li>-->
          <li>
            <span class="item icon_mr"></span>
            <div>
              <h4>本月收缴率</h4>
              <strong>{{monthRate}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_cr"></span>
            <div>
              <h4>清欠率</h4>
              <strong>{{clearanceRate}}</strong>
            </div>
          </li>
          <li>
            <span class="item icon_comr"></span>
            <div>
              <h4>综合收缴率</h4>
              <strong>{{comprehensiveRate}}</strong>
            </div>
          </li>
        </ul>
      </div>

      <div class="splitLine"></div>

      <div style="margin: 0 .1rem;">
        <div class="collectionRate">
          <h3 class="firstTitle">收缴情况</h3>
          <ul>
            <li class="active" @click="setMonthOrYear(0,$event)">月</li>
            <li @click="setMonthOrYear(1,$event)">年</li>
          </ul>
        </div>
        <div style="margin-top: 0.2rem;" class="btnGroup">
          <van-row type="flex" justify="center">
            <button @click="setIncomeType(0,$event)" class="active" type="default">综合费用</button>
            <button @click="setIncomeType(1,$event)" type="default">物业费</button>
          </van-row>
        </div>
        <div id="chargeSituation"></div>
      </div>

      <div class="splitLine"></div>

      <div style="margin: 0 0.1rem;">
        <div class="collectionRate">
          <h3 class="firstTitle" v-if="query.proidList.length>1">项目收缴率</h3>
          <h3 class="firstTitle" v-else>楼栋收缴率</h3>
          <!-- <p>{{buildingRange}}</p> -->
        </div>
        <div style="margin-top: 0.1rem;" class="btnGroup">
          <h4 v-if="query.proidList.length>1">年度项目收缴率排名</h4>
          <div v-else>
            <h4>年度楼栋收缴率排名</h4>
            <van-row type="flex" justify="center">
              <button @click="setEligibleType(0,$event)" class="active" type="default">不达标Top</button>
              <button @click="setEligibleType(1,$event)">达标Top</button>
            </van-row>
          </div>
          <div id="buildingRate"></div>
        </div>
      </div>

      <div class="splitLine" v-if="query.proidList.length>1"></div>

      <!-- <div style="margin: 0 0.1rem;" v-if="query.proidList.length===1">
        <div class="collectionRate">
          <h3 class="firstTitle">楼栋收缴率</h3>
          <p>{{buildingRange}}</p>
        </div>
        <div style="margin-top: 0.6rem;" class="btnGroup">
          <h4>年度楼栋收缴率排名</h4>
          <van-row type="flex" justify="center">
            <button @click="setEligibleType(0,$event)" class="active" type="default">不达标Top</button>
            <button @click="setEligibleType(1,$event)">达标Top</button>
          </van-row>
          <div id="buildingRate"></div>
        </div>
      </div>-->

      <div style="margin: 0 .1rem;" v-if="query.proidList.length>1">
        <div class="collectionRate">
          <h3 class="firstTitle">指标分析</h3>
          <p>{{anaysisRange}}</p>
        </div>
        <div class="btnGroup textTip">
          <h4>收缴率偏低</h4>
        </div>
        <div style="margin-top: 0.2rem;" class="btnGroup">
          <h4>收缴率低于阙值项目</h4>
        </div>
        <div id="indicatorAnaysis"></div>
      </div>

      <div class="splitLine"></div>

      <div style="margin: 0 .12rem .1rem .12rem;" v-if="query.proidList.length===1">
        <div class="AlarmAnalysis">
          <h4 class="firstTitle">告警分析</h4>
          <ul v-html="alarmInfo"></ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
let echarts = require("echarts");
import { isNullY } from '@/utils/index';
export default {
  name: "financeAI",
  data() {
    return {
      proId: 0,
      query: {
        //proidList: [3,5,21],
        proidList: [],
        year: "2019"
      },
      rate: "", // 收缴率
      rank: 0, // 排名
      proName:'', // 项目名称
      range: "", // 年度收缴率绑值： 时间区间
      // 各类别的ratio
      property: "", //  住宅物业费
      airConditioning: "", // 空调使用费
      mixin: "", // 多种经营
      parkingSpace: "", //  车位费
      energy: "", // 能耗
      penalty: "", // 违约金
      monthRate: "", //月度收缴率
      clearanceRate: "", //往年清欠率
      comprehensiveRate: "", //综合收缴率

      monthOrYear: 0, // 收缴情况  0:月  1:年
      chargeType: 0, //  收缴情况类别  0：综合费用 1：物业费

      chargeMonthX: [],
      chargeIncomeY1: [], // 收缴情况收入
      chargeIncomeY2: [], // 收缴情况收缴率

      buildingRange: "", // 楼栋日期
      eligibleType: 0, //  0：达标   1：不达标
      buildingRateX: [], // 楼栋收缴率x轴
      buildingRateY: [], // 楼栋收缴率y轴

      anaysisRange: "", // 指标分析日期
      anaysisX: [], // 指标分析项目名称
      anaysisY1: [], // 指标分析收缴率
      anaysisY2: [], // 指标分析阀值

      alarmInfo: "", // 告警信息   type arr
      errPNG:
        "url(" + require("../../assets/operationIndex/error/error.png") + ")",
      emptyPNG:
        "url(" + require("../../assets/operationIndex/error/empty@2x.png") + ")"
    };
  },
  methods: {
    toTest() {
      let url =
        `${this.$envConfigObj.pageUrl}/template/testImg.html?` + Math.random();
      location.href = url;
    },

    /**
     *  传递项目id
     */
    initProId() {
      let currentDate = new Date();
      if (this.$utils.GetUrlParam("proId")) {
        var str = this.$utils.GetUrlParam('proId')
        this.query.proidList = str.split(',').map(Number)
        this.query.year = currentDate.getFullYear();
      }
      console.log("参数", this.$utils.GetUrlParam("proId"));
    },

    /**
     *  格式化
     * @param rate
     * @returns {string}
     */
    formatRate(rate) {
      return (rate * 100).toFixed(2) + '%'
      // return Math.ceil(rate * 100) + "%";
    },

    /**
     *  收缴情况：　月　　年
     */
    setMonthOrYear(type, $event) {
      this.monthOrYear = type;
      this.toggleActive($event.target);
      // 默认查询综合费用
      this.chargeMonthX = [];
      this.chargeIncomeY1 = [];
      this.chargeIncomeY2 = [];
      this.queryCaptureMonYearTrend();
    },

    /**
     *  收缴情况  综合费用  物业费
     */
    setIncomeType(type, $event) {
      this.chargeType = type;
      this.toggleActive($event.target);
      // 默认查询综合费用
      this.chargeMonthX = [];
      this.chargeIncomeY1 = [];
      this.chargeIncomeY2 = [];
      this.queryCaptureMonYearTrend();
    },

    setEligibleType(type, $event) {
      this.eligibleType = type;
      this.toggleActive($event.target);
      this.buildingRateX = [];
      this.buildingRateY = [];
      this.queryProLoudongRateEligible();
    },

    /**
     * 切换active
     */
    toggleActive(dom) {
      dom.className = "active"; // 激活   当前激活，另一个取消状态
      // 当前元素的同胞节点的子节点
      let prev = dom.previousElementSibling;
      let next = dom.nextElementSibling;
      let arr = [prev, next];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== null) {
          arr[i].className = "";
        }
      }
    },

    /**
     *  收缴率基本信息　（一）
     */
    getBaseInfo() {
      let that = this;
      let myChart = echarts.init(document.getElementById("collectionRate"));
      let $dom = document.getElementById("collectionRate");
      $dom.style.backgroundImage = "none";
      let rich = {
        total: {
          color: "#268AED",
          fontSize: 24,
          align: "center",
          fontWeight: 600
        }
      };
      let echartData = [
        {
          value: 4000,
          name: "收缴"
        },
        {
          value: 1500,
          name: "未收缴"
        }
      ];
      let option = {
        title: {
          text: "本年收缴率",
          left: "center",
          top: "48%",
          padding: [24, 0],
          textStyle: {
            color: "#999999",
            fontSize: 14,
            align: "center"
          }
        },
        legend: {
          selectedMode: false,
          formatter: function(name) {
            return "{total|" + that.rate + "}";
          },
          data: [echartData[0].name],
          left: "center",
          top: "35%",
          icon: "none",
          align: "center",
          textStyle: {
            color: "#fff",
            // fontSize: 16,
            rich: rich
          }
        },
        series: [
          {
            name: "本年收缴率",
            type: "pie",
            radius: ["55%", "85%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            color: ["#268AED", "#eee"],
            label: {
              show: false
            },
            data: echartData
          }
        ]
      };
      myChart.setOption(option);
      myChart.showLoading({
        text: "",
        color: "#268AED"
      });
      let params = {
        proidList: this.query.proidList,
        year: this.query.year
      };
      this.axios
        .post(
          that.$envConfigObj.dataAnalysisPath +
            that.$utils.pathArr.queryRateInfo,
          params
        )
        .then(res => {
          myChart.hideLoading();
          if (res.data.result == 0) {
            if (res.data.data == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom, that.emptyPNG);
            }
            let tempArr = res.data.data;
            this.range = tempArr.range;
            that.rate = that.formatRate(tempArr.yearRate);
            this.monthRate = this.formatRate(tempArr.monthRate);
            this.clearanceRate = this.formatRate(tempArr.clearRate);
            this.comprehensiveRate = this.formatRate(tempArr.yearGeneralRate);
          
            if(this.query.proidList.length === 1){
              this.rank = res.data.data.rateOrder;
              this.proName = res.data.data.name;
            }
            echartData = [
              {
                value: tempArr.yearYingshou,
                name: "收缴"
              },
              {
                value: tempArr.yearYingshou - tempArr.yearShishou,
                name: "未收缴"
              }
            ];
            myChart.setOption({
              series: [
                {
                  data: echartData
                }
              ]
            });
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom, that.errPNG);
          }
        })
        .catch(function(err) {
          myChart.hideLoading();
          myChart.dispose();
          that.$utils.SetErrorStyle($dom, that.errPNG);
          console.log(err);
        });
    },
    /**
     *   获取各种类型的收缴率　（二）
     */
    getAllTypeRatio() {
      let that = this;
      let params = {
        proidList: this.query.proidList,
        year: this.query.year
      };
      this.axios
        .post(
          that.$envConfigObj.dataAnalysisPath +
            this.$utils.pathArr.queryRateInfo,
          params
        )
        .then(res => {
          if (res.data.result == 0) {
            let tempArr = res.data.data;
            this.range = tempArr.range;
            this.monthRate = this.formatRate(tempArr.monthRate);
            this.clearanceRate = this.formatRate(tempArr.clearRate);
            this.comprehensiveRate = this.formatRate(tempArr.yearGeneralRate);
            
          } else {
            console.log("接口调用失败了！");
          }
        })
        .catch(function(err) {
          console.error(err);
        });
    },

    /**
     *  查询收缴情况数据　（三）
     */
    queryCaptureMonYearTrend() {
      let that = this;
      let myChart = echarts.init(document.getElementById("chargeSituation"));
      let $dom = document.getElementById("chargeSituation");
      $dom.style.backgroundImage = "none";
      let option = {
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //     type: 'cross',
          //     crossStyle: {
          //         color: '#999'
          //     }
          // },
          formatter: '{a0}: {c0}<br/>{a1}: {c1}%'
        },
        legend: {
          data: ["实收本月", "收缴率"],
          top: "5%",
          itemHeight: 12,
          itemWidth: 12
        },
        xAxis: [
          {
            type: "category",
            data: that.chargeMonthX,
            axisPointer: {
              type: "shadow"
            },
            nameRotate: 60,
            axisLine: {
              lineStyle: {
                color: "#E7E7E7"
              }
            },
            axisLabel: {
              interval: 0,
              color: "#525B6D"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: function(value, index) {
                let conditions = isNullY(that.chargeIncomeY1) && isNullY(that.chargeIncomeY2);
                if(conditions) return value
                return value/10000 + 'W'
              },
              fontSize: 11,
              align: "right",
              color: "#999"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          },
          {
            type: "value",
            axisLabel: {
              formatter: "{value}%",
              color: "#999"
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
        grid: {
          bottom: "10%",
          left: "12%",
          right: "12%"
        },
        dataZoom: [
          {
            type: "inside",
            show: true,
            startValue: 0,
            endValue: 4,
            minValueSpan: 5,
            maxValueSpan: 5,
            zoomLock: true
          }
        ],
        series: [
          {
            name: "实收本月",
            type: "bar",
            data: that.chargeIncomeY1,
            barWidth: 20,
            itemStyle: {
              color: "#268AED"
            }
          },
          {
            name: "收缴率",
            type: "line",
            yAxisIndex: 1,
            data: that.chargeIncomeY2,
            itemStyle: {
              color: "#1CC8AE"
            },
            
          }
        ]
      };
      myChart.setOption(option);
      myChart.showLoading({
        text: "",
        color: "#268AED"
      });
      let params = {
        proId: this.proId,
        proidList: this.query.proidList,
        chargeClass: that.chargeType,
        method: that.monthOrYear
      };

      this.axios
        .post(
          that.$envConfigObj.dataAnalysisPath +
            that.$utils.pathArr.queryCaptureMonYearTrend,
          params
        )
        .then(function(res) {
          myChart.hideLoading();
          if (res.data.result == 0) {
            if (res.data.data.detail == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom, that.emptyPNG);
            }
            let tempArr = res.data.data.detail;
            for (let i = 0; i < tempArr.length; i++) {
              that.chargeMonthX.push(tempArr[i].x);
              that.chargeIncomeY1.push(tempArr[i].y1);
              that.chargeIncomeY2.push((tempArr[i].y2 * 100).toFixed(2));
            }
            myChart.setOption({
              xAxis: [
                {
                  data: that.chargeMonthX
                }
              ],
              series: [
                {
                  data: that.chargeIncomeY1
                },
                {
                  data: that.chargeIncomeY2
                }
              ]
            });
          } else {
                 
            myChart.dispose();
            that.$utils.SetErrorStyle($dom, that.errPNG);
          }
        })
        .catch(function(err) {
        
          myChart.hideLoading();
          myChart.dispose();
          that.$utils.SetErrorStyle($dom, that.errPNG);
          console.log(err);
        });
    },

    /**
     *  获取楼栋收缴率数据： 达标   不达标　（四）
     *  二期改成项目收缴率 去除达标不达标
     */
    queryProLoudongRateEligible() {
      let that = this;
      let myChart = echarts.init(document.getElementById("buildingRate"));
      let $dom = document.getElementById("buildingRate");
      $dom.style.backgroundImage = "none";
      myChart.clear();
      let option = {
        color: ["#268AED"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b}<br />收缴率:{c}%',
        },
        grid: {
          top: 40,
          left: "3%",
          right: "4%",
          bottom: "11%", //  这里解决dataZoom与坐标轴重叠
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: that.buildingRateX,
            nameRotate: 60,
            axisTick: {
              alignWithLabel: false,
              rotate: 60
            },
            axisLine: {
              lineStyle: {
                color: "#E7E7E7"
              }
            },
            axisLabel: {
              color: "#525B6D",
              interval: 0,
              formatter: function(value, index) {
                if (value && value.length > 5) {
                  return value.substr(0, 4) + "\n" + value.substr(4);
                } else if (value && value.length > 10) {
                  return (
                    value.substr(0, 4) +
                    "\n" +
                    value.substr(4, 9) +
                    "\n" +
                    value.substr(9)
                  );
                }
                return value;
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}%",
              color: "#999"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        dataZoom: [
          {
            type: "inside",
            show: true,
            startValue: 0,
            endValue: 4,
            minValueSpan: 5,
            maxValueSpan: 5,
            zoomLock: true
            // handleSize: 8,
          }
        ],
        series: [
          {
            label: {
              show: true,
              position: "top",
              formatter: "{c}%"
            },
            name: "收缴率",
            type: "bar",
            barWidth: 20,
            data: that.buildingRateY
          }
        ]
      };
      myChart.setOption(option);
      myChart.showLoading({
        text: "",
        color: "#268AED"
      });
      
      let params = {}, currentPath = '';
      if(this.query.proidList.length === 1){
        currentPath = that.$utils.pathArr.queryProLoudongRateTop
         params = {
          method: this.eligibleType,
          proId: this.query.proidList.toString(),
        };
      }else{
         params = {
          // proId: this.proId, queryProLoudongRateTop
          method: this.eligibleType,
          proidList: this.query.proidList,
          year: this.query.year
        };
        currentPath = that.$utils.pathArr.queryProYearRate
      }
      this.axios
        .post(
          that.$envConfigObj.dataAnalysisPath +
          currentPath,
          params
        )
        .then(function(res) {
          myChart.hideLoading();
          if (res.data.result == 0) {
            if (res.data.data.detail == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom, that.emptyPNG);
            }
            let tempArr = res.data.data.detail;
            for (let i = 0; i < tempArr.length; i++) {
              if(that.query.proidList.length === 1){
                  that.buildingRateX.push(tempArr[i].loudong_name);
              }else{
                that.buildingRateX.push(tempArr[i].name);
              }
              that.buildingRateY.push((tempArr[i].rate * 100).toFixed(2));
            }
            that.buildingRange = res.data.data.range;
            myChart.setOption({
              xAxis: [
                {
                  data: that.buildingRateX
                }
              ],
              series: [
                {
                  data: that.buildingRateY
                }
              ]
            });
          } else {
            // console.info('rateTop dom', $dom)
            myChart.dispose();
            that.$utils.SetErrorStyle($dom, that.errPNG);
          }
        })
        .catch(function(err) {
          myChart.hideLoading();
          myChart.dispose();
          that.$utils.SetErrorStyle($dom, that.errPNG);
          console.log(err);
        });
    },

    /**
     * 指标分析
     */
    queryIndicatorAnaysis() {
      let that = this;
      let myChart = echarts.init(document.getElementById("indicatorAnaysis"));
      let $dom = document.getElementById("indicatorAnaysis");
      $dom.style.backgroundImage = "none";
      let option = {
        tooltip: {
          trigger: "axis"
          // formatter: '{a0}: {c0}%<br/>{a1}: {c1}%'
        },
        legend: {
          data: ["收缴率", "阀值"],
          top: "5%",
          itemHeight: 12,
          itemWidth: 12
        },
        xAxis: [
          {
            type: "category",
            data: that.chargeMonthX,
            axisPointer: {
              type: "shadow"
            },
            nameRotate: 60,
            axisLine: {
              lineStyle: {
                color: "#E7E7E7"
              }
            },
            axisLabel: {
              interval: 0,
              color: "#525B6D",
              formatter: function(value, index) {
                if (value && value.length > 5) {
                  return value.substr(0, 4) + "\n" + value.substr(4);
                } else if (value && value.length > 10) {
                  return (
                    value.substr(0, 4) +
                    "\n" +
                    value.substr(4, 9) +
                    "\n" +
                    value.substr(9)
                  );
                }
                return value;
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              fontSize: 11,
              formatter: "{value}%",
              align: "right",
              color: "#999"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        grid: {
          bottom: "10%",
          left: "20%",
          right: "12%"
        },
        dataZoom: [
          {
            type: "inside",
            show: true,
            startValue: 0,
            endValue: 4,
            minValueSpan: 5,
            maxValueSpan: 5,
            zoomLock: true
          }
        ],
        series: [
          {
            name: "收缴率",
            type: "bar",
            data: that.anaysisY1,
            barWidth: 20,
            itemStyle: {
              color: "#268AED"
            }
          },
          {
            name: "阀值",
            type: "line",
            // yAxisIndex: 1,
            data: that.anaysisY2,
            itemStyle: {
              color: "#1CC8AE"
            },
            label: {
              show: true,
              position: "right",
              formatter: "{c}%"
            }
          }
        ]
      };
      myChart.setOption(option);
      myChart.showLoading({
        text: "",
        color: "#268AED"
      });
      let params = {
        proidList: this.query.proidList,
        year: this.query.year
      };
      this.axios
        .post(
          that.$envConfigObj.dataAnalysisPath +
            that.$utils.pathArr.queryProYearRateLowerThanAlarm,
          params
        )
        .then(res => {
          myChart.hideLoading();
          if (res.data.result == 0) {
            if (res.data.data.detail == null) {
              myChart.dispose();
              that.$utils.SetEmptyStyle($dom, that.emptyPNG);
            }
            this.anaysisRange = res.data.data.range;
            let tempArr = res.data.data.detail;
            for (let i = 0; i < tempArr.length; i++) {
              that.anaysisX.push(tempArr[i].name);
              that.anaysisY1.push((tempArr[i].rate * 100).toFixed(2));
              that.anaysisY2.push((tempArr[i].AlarmRate * 100).toFixed(2));
            }
            myChart.setOption({
              xAxis: [
                {
                  data: that.anaysisX
                }
              ],
              series: [
                {
                  data: that.anaysisY1
                },
                {
                  data: that.anaysisY2
                }
              ]
            });
          } else {
            myChart.dispose();
            that.$utils.SetErrorStyle($dom, that.errPNG);
          }
        })
        .catch(function(err) {
          myChart.hideLoading();
          myChart.dispose();
          that.$utils.SetErrorStyle($dom, that.errPNG);
          console.log(err);
        });
    },

    /**
     *  告警分析 （五）
     */
    getAlarmInfo() {
      let that = this;
      let params = {
        proId: this.query.proidList.toString()
      };
      this.axios
        .post(
          this.$envConfigObj.dataAnalysisPath +
            this.$utils.pathArr.caiwuAlarmTask,
          params
        )
        .then(function(res) {
          if (res.data.result == 0) {
            let tempData = res.data.data;
            console.log("tempData", tempData);
            let alarmInfoArr = tempData.note.split(";");
            for (let i = 0; i < alarmInfoArr.length - 1; i++) {
              that.alarmInfo += `<li>${alarmInfoArr[i]}。</li>`;
            }
          } else {
            console.log("接口调用失败！");
            that.alarmInfo = "暂未获取到项目催缴率";
          }
        })
        .catch(function(err) {
          console.error(err);
        });
    },

    onClickLeft() {
      location.href = "zjh://close";
    },

    // 跳转指标解释页面
    clickToExplain() {
      this.$router.push({ path: "/indicatorExplain", query: { name: "AI" } });
    }
  },

  created() {
    this.$utils.OverWriteCSS();
    this.initProId(); //  从url获取接口参数
  },
  mounted() {
    this.getBaseInfo();
    this.queryCaptureMonYearTrend();
    if(this.query.proidList.length >1){
      this.queryIndicatorAnaysis();
    }
    this.queryProLoudongRateEligible();
    this.getAlarmInfo();
  }
};
</script>

<style scoped>
@import "../../stylus/operationIndex/base.css";
main{
  height: 90vh;
  overflow: auto;
}
#financeAI {
  background-color: #fff;
}

.splitLine {
  height: 0.1rem;
  background: rgb(245, 245, 245);
  margin-top: 0.2rem;
}

#financeAI {
}

#financeAI .van-nav-bar__title {
  font-size: 17px;
}

#financeAI .van-nav-bar__arrow {
  font-size: 20px;
  color: #666666;
  font-weight: 600;
}

#financeAI .firstTitle {
  font-size: 16px;
}

#financeAI .collectionRate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 0.3rem;
  margin-top: 0.1rem;
}
#financeAI .collectionRate ul {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}
#financeAI .collectionRate h4,
p {
  color: #313131;
  font-size: 0.16rem;
}

#financeAI .collectionRate div {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  font-size: 0.16rem;
}

#financeAI .collectionRate ul li {
  display: inline-block;
}

#financeAI .collectionRate ul li:first-of-type {
  margin-right: 0.2rem;
}

#financeAI .collectionRate li {
  font-size: 0.14rem;
  padding: 0.02rem 0.04rem;
}

#collectionRate {
  height: 200px;
  margin: 0 -0.1rem;
}

#financeAI .collectionRate li.active {
  /*flex-grow: 1;*/
  border-bottom: 3px solid #268aed;
  /*text-align: right;*/
  color: #268aed;
}

#financeAI .detail {
  display: flex;
  flex-wrap: wrap;
}

#financeAI .detail h4 {
  color: #666666;
  font-size: 0.14rem;
  font-weight: normal;
}

#financeAI .detail li strong {
  color: #34394a;
  font-size: 0.2rem;
}

#financeAI .detail li {
  /*border: 1vw solid red;*/
  padding: 1vw 0;
  margin: 2vh 0;
  border-collapse: collapse;
  width: 44vw;
  display: flex;
  justify-content: right;
}

#financeAI .detail li:nth-of-type(even) {
  border-left: 1px solid #eeeeee;
}

#financeAI .detail li div {
  /*border: 1px solid green;*/
  flex: 3;
  display: flex;
  flex-direction: column;
}

#financeAI .detail li div h4 {
  margin: 0 0 3px 0;
}

#financeAI .detail .item {
  flex: 1;
  display: block;
  margin-left: 15px;
  margin-top: 2px;
  /*border: 1px solid red;*/
  width: 26px;
  height: 22px;
  /*background-size: 26px 22px;*/
  background-size: contain;
  background-repeat: no-repeat;
}

#financeAI .detail .icon_a {
  background-image: url("../../assets/operationIndex/financeAI/icona@3x.png");
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_a {
    background-image: url("../../assets/operationIndex/financeAI/icona@2x.png");
    /*background-size: 52px 44px;*/
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_a {
    background-image: url("../../assets/operationIndex/financeAI/icona@3x.png");
    /*background-size: 78px 66px;*/
  }
}

#financeAI .detail .icon_b {
  background-image: url("../../assets/operationIndex/financeAI/iconb@3x.png");
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_b {
    background-image: url("../../assets/operationIndex/financeAI/iconb@2x.png");
    /*background-size: 52px 48px;*/
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_b {
    background-image: url("../../assets/operationIndex/financeAI/iconb@3x.png");
    /*background-size: 78px 72px;*/
  }
}

#financeAI .detail .icon_c {
  background-image: url("../../assets/operationIndex/financeAI/iconc@2x.png");
  /*background-size: 26px 23px;*/
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_c {
    background-image: url("../../assets/operationIndex/financeAI/iconc@2x.png");
    /*background-size: 52px 46px;*/
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_c {
    background-image: url("../../assets/operationIndex/financeAI/iconc@3x.png");
    /*background-size: 78px 69px;*/
  }
}

#financeAI .detail .icon_d {
  background-image: url("../../assets/operationIndex/financeAI/icond@3x.png");
  /*background-size: 24px 22px;*/
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_d {
    background-image: url("../../assets/operationIndex/financeAI/icond@2x.png");
    /*background-size: 48px 44px;*/
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_d {
    background-image: url("../../assets/operationIndex/financeAI/icond@3x.png");
    /*background-size: 72px 66px;*/
  }
}

#financeAI .detail .icon_e {
  background-image: url("../../assets/operationIndex/financeAI/icone@2x.png");
  background-size: contain;
}

/*@media (min-resolution: 2dppx) {*/
/*#financeAI .detail .icon_e {*/
/*background-image: url('../img/financeAI/icone@2x.png');*/
/*!*background-size: 40px 48px;*!*/
/*}*/
/*}*/

/*@media (min-resolution: 3dppx) {*/
/*#financeAI .detail .icon_e {*/
/*background-image: url('../img/financeAI/icone@3x.png');*/
/*!*background-size: 60px 72px;*!*/
/*}*/
/*}*/

#financeAI .detail .icon_f {
  background-image: url("../../assets/operationIndex/financeAI/iconf@3x.png");
  /*background-size: 24px 26px;*/
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_f {
    background-image: url("../../assets/operationIndex/financeAI/iconf@2x.png");
    /*background-size: 48px 52px;*/
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_f {
    background-image: url("../../assets/operationIndex/financeAI/iconf@3x.png");
    /*background-size: 72px 78px;*/
  }
}

#financeAI .detail .icon_mr {
  background-image: url("../../assets/operationIndex/financeAI/icon_mouth@3x.png");
}

@media (min-resolution: 2dppx) {
  #financeAI .detail .icon_mr {
    background-image: url("../../assets/operationIndex/financeAI/icon_mouth@2x.png");
  }
  #financeAI .detail .icon_cr {
    background-image: url("../../assets/operationIndex/financeAI/icon_year@2x.png");
  }
  #financeAI .detail .icon_comr {
    background-image: url("../../assets/operationIndex/financeAI/icon_totalrate@2x.png");
  }
}

@media (min-resolution: 3dppx) {
  #financeAI .detail .icon_mr {
    background-image: url("../../assets/operationIndex/financeAI/icon_mouth@3x.png");
  }
  #financeAI .detail .icon_cr {
    background-image: url("../../assets/operationIndex/financeAI/icon_year@3x.png");
  }
  #financeAI .detail .icon_comr {
    background-image: url("../../assets/operationIndex/financeAI/icon_totalrate@3x.png");
  }
}

#financeAI .detail .icon_cr {
  background-image: url("../../assets/operationIndex/financeAI/icon_year@3x.png");
}

#financeAI .detail .icon_comr {
  background-image: url("../../assets/operationIndex/financeAI/icon_totalrate@3x.png");
}

#financeAI .border {
  border: 1px solid #999;
}

@media screen and (-webkit-min-device-pixel-ratio: 2) {
  #financeAI .border {
    border: 0.5px solid #999;
  }
}

@media screen and (-webkit-min-device-pixel-ratio: 3) {
  #financeAI .border {
    border: 0.333333px solid #999;
  }
}

#financeAI .btnGroup h4 {
  text-align: center;
  font-size: 0.14rem;
  color: rgba(82, 91, 109, 1);
}
#financeAI .btnGroup.textTip h4 {
  text-align: left;
  margin-top: 0.08rem;
  padding-bottom: 0.16rem;
  border-bottom: 1px solid #eeeeee;
}
#financeAI .btnGroup.textTip h4::before {
  content: "";
  display: inline-block;
  width: 0.08rem;
  height: 0.08rem;
  border-radius: 50%;
  background-color: #268aed;
  margin-right: 0.08rem;
}

#financeAI .btnGroup button:first-of-type {
  border-radius: 10em 0 0 10em;
  border-left: 1px solid #ebedf0;
}

#financeAI .btnGroup button:nth-child(2) {
  border-left: 1px solid #ebedf0;
  border-right: 1px solid #ebedf0;
}

#financeAI .btnGroup button:last-of-type {
  border-radius: 0 10em 10em 0;
  border-left: 1px solid #ebedf0;
}

#financeAI .btnGroup button {
  height: 34px;
  width: 100px;
  line-height: 32px;
  border-top: 1px solid #ebedf0;
  border-bottom: 1px solid #ebedf0;
  border-left-width: 0;
  border-right-width: 0;
  background: rgb(255, 255, 255);
  padding: 0 5px;
  font-size: 0.13rem;
}

#financeAI .btnGroup button.active {
  background: rgb(38, 138, 237);
  border: 2px solid rgb(38, 138, 237);
  color: #fff;
}

#chargeSituation,
#indicatorAnaysis,
#buildingRate {
  height: 45vh;
  margin: 0 -0.1rem;
}

#financeAI .AlarmAnalysis ul {
  font-size: 0.14rem;
}
#financeAI .AlarmAnalysis ul li {
  line-height: 30px;
  font-size: 0.14rem;
  color: #666;
}

.van-nav-bar__title {
  font-weight: 700;
}
</style>
