var yongGuiIp = 'http://192.168.3.55:8080'
var guangyouIp = 'http://192.168.3.18:8080'

var guoYong = 'http://192.168.3.24:8300/poly-arrears-backend-for-frontends'
var gaoWei = 'http://192.168.3.71:7002/poly-arrears-backend-for-frontends'

// 审计模块
var gaoWeiAudit = 'http://192.168.3.71:7002/audit-backend-for-frontends'

// 审计

// 测试环境接口    这个要做一个切换的        1环境 2接口类型
// var enVtestIp = 'http://audit.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com'


var bffPath = {
  'cuiJiao': '/poly-arrears-backend-for-frontends',
  'audit': '/audit-backend-for-frontends',
}

/**
 *  bffKey预留    cuijiao  audit
 * @param env
 * @param bffKey
 * @returns {*}
 */
// function getServer(env) {
//   let obj = {
//     // url
//     local: {
//       pageUrl: 'http://192.168.4.75',  //
//     },
//     dev: {
//       pageUrl: 'http://192.168.3.101',  //  本地调试
//       cuiJiaoPath: '/poly-arrears-backend-for-frontends',  //  催缴path
//       auditPath: '/audit-backend-for-frontends',         // 审计path
//       index: '',
//       projById: 'http://api.dev.zanjiahao.com/public/threshold/villageInfos',     // 绍兴url
//       dataCenter: 'http://data-center.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com',    // 大数据url
//       dataContext: '/data-center',
//     },
//     test: {
//       URL: 'http://api-gateway.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com',  //   网关地址
//       // pageUrl: 'http://page-home.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/operationIndex', // h5的包
//       pageUrl: 'http://hybrid-app.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/#/',  //  新包的地址啊
//       // pageUrl: 'http://arrears-info.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/operationIndex',
//       cuiJiaoPath: '/poly-arrears-backend-for-frontends',  //  催缴path
//       auditPath: '/audit-backend-for-frontends',         // 审计path
//       index: '',
//       projById: 'http://api.dev.zanjiahao.com/public/threshold/villageInfos',     // 绍兴url
//       dataContext: '/data-center',
//     },
//     uat: {
//       cuiJiaoPath: '/poly-arrears-backend-for-frontends',  //  催缴path
//       auditPath: '/audit-backend-for-frontends',         // 审计path
//       index: '',
//       projById: 'http://api.dev.zanjiahao.com/public/threshold/villageInfos',     // 绍兴url
//       dataCenter: 'http://data-center.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com',   // 大数据url
//       dataContext: '/data-center',
//     },
//     prod: {
//       URL: 'https://gateway.shenzhentianding.com',  //   网关地址
//       pageUrl: 'http://homepage.shenzhentianding.com/#',  //  新包的地址啊
//
//       // auditIpUrl: 'http://audit.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com',   //  审计url
//       cuiJiaoPath: '/poly-arrears-backend-for-frontends',  //  催缴path
//       auditPath: '/audit-backend-for-frontends',         // 审计path
//       index: '',
//       projById: 'http://api.zanjiahao.com/public/threshold/villageInfos',     // 绍兴url
//       // dataCenter: 'http://data-center.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com',    // 大数据url
//       dataContext: '/data-center',
//     }
//   }
//   return obj[env]   // flex
// }
//
// // 切换环境
// let envPath = getServer('prod')

let pathArr = {
  // 运营指标首页
  queryProYearInfo: '/zjIncome/queryProYearInfo',     //  应收  实收
  caiwuAlarmTask: '/zjIncome/caiwuAlarmTask', // 财务AI分析    首页、财务AI分析共用
  getHomeAlarmAnalysisList: '/alarmAnalysis/getHomeAlarmAnalysisList',
  queryStatusByUptownId: '/arrears/queryStatusByUptownId',   // 停车场  获取审计状态
  queryProcessStatus: '/carAudit/queryProcessStatus',   // 车辆审计


  queryProChargeYearInfo: '/zjIncome/queryProChargeYearInfo',  // 项目收费类型年度实收本年、往年及实收占比(时间本年截止上月)
  queryProMonYearTrend: '/zjIncome/queryProMonYearTrend',    // 项目实收年月变化趋势(前12个月变化趋势,含当月，3~5年)
  queryProPayMethPer: '/zjIncome/queryProPayMethPer',    // 项目收费方式实收占比(时间本年截止昨天)
  queryProHisArrearsInfo: '/zjIncome/queryProHisArrearsInfo', // 实收记录---往年欠款情况

  selectProjectsData: '/parkBasicData/selectProjectsData',   // 首页基础数据

  selectByParkId: '/parkBasicData/selectByParkId',
  getParkHandUprodDayList: '/parkHandUprodDay/getParkHandUprodDayList',  // 异常抬杆（日）
  selectByParkIdAndDataMonth: '/parkHandUprodDay/selectByParkIdAndDataMonth', // 异常抬杆(月)
  selectParkTotalRevenueByPakrId: '/parkTotalRevenue/selectParkTotalRevenueByPakrId',   // 收费情况()
  selectByParkIdAndDay: '/parkInoutHMonth/selectByParkIdAndDay',
  selectByParkIdHour: '/parkSpaceMonth/selectByParkIdAndDay',  // 车位使用率
  getAlarmAnalysisList: '/alarmAnalysis/getAlarmAnalysisList',   // 告警分析
  getAlarmAnalysisMFFXJE: '/alarmAnalysis/getAlarmAnalysisMFFXJE',   // 指标分析 （免费金额过高）
  getAlarmAnalysisXJJNBL: '/alarmAnalysis/getAlarmAnalysisXJJNBL',   // 指标分析 （现金缴费过高）
  getAlarmAnalysisMessageByParkIds: '/alarmAnalysis/getAlarmAnalysisMessageByParkIds', // 指标分析 （首页）


  queryProYearRate: '/zjIncome/queryProYearRate',   // 项目收缴率
  queryProChargeRate: '/zjIncome/queryProChargeRate',   // 各种类别的收缴率
  queryRateInfo: '/zjIncome/queryRateInfo', // 年度收缴率、月度收缴率、综合收缴率
  queryCaptureMonYearTrend: '/zjIncome/queryCaptureMonYearTrend',  // 财务AI分析： 收缴情况月年变化趋势(前12个月变化趋势,不含当月;3~5年,含本年)
  queryProLoudongRateTop: '/zjIncome/queryProLoudongRateTop',   // 财务AI分析：楼栋收缴率
  queryProYearRateLowerThanAlarm:'/zjIncome/queryProYearRateLowerThanAlarm', // 财务AI 指标分析
}

// axios 配置
// axios.defaults.timeout = 5000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


function GetUrlParam(paraName) {
  //debugger
  var url = document.location.href.toString();
  var arrObj = url.split("?");

  if (arrObj.length > 1) {
    var arrPara = arrObj[arrObj.length - 1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");

      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}

function OverWriteCSS() {
  var u = navigator.userAgent, app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    console.info('====ios style change ======')
    document.body.style.marginTop = '20px'
  } else {
  }
  console.log(u)
  console.log(app)
}

function SetEmptyStyle(dom,imgUrl) {
  dom.style.backgroundImage = imgUrl
  dom.style.backgroundRepeat = 'no-repeat'
  dom.style.backgroundSize = '129px 128px'
  dom.style.backgroundPosition = 'center center'
  let textDom = document.createElement('div')
  textDom.innerHTML = '<p id="emptyInfo" style="font-size:13px;color:#999099; position:absolute;bottom:20%;left:50%;margin-left:-39px;">暂时没有数据</p>'
  dom.appendChild(textDom)
  return
}

function SetErrorStyle(dom,imgUrl) {
  dom.style.backgroundImage = imgUrl
  dom.style.backgroundRepeat = 'no-repeat'
  dom.style.backgroundSize = '129px 128px'
  dom.style.backgroundPosition = 'center center'
  return
}

export {
  // envPath,
  pathArr,
  GetUrlParam,
  OverWriteCSS,
  SetEmptyStyle,
  SetErrorStyle,
}



















