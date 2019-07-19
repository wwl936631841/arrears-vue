const urlMap = {}
const auditBaseUrl = '/audit-backend-for-frontends'
const cuiJiao = '/poly-arrears-backend-for-frontends'
const dataContext = '/data-center'

const auditPath = process.env.BASE_API + auditBaseUrl    // 审计
const cuiJiaoPath = process.env.BASE_API + cuiJiao    // 催缴
const dataAnalysisPath = process.env.BASE_API + dataContext     // 大数据

const pageUrl = process.env.pageUrl        // 页面url
const projById = process.env.projById      // 绍兴接口
const URL = process.env.BASE_API           // 接口
const arrearsUrl = process.env.arrearsUrl

const houseId = process.env.houseId

const referUrl = process.env.auditAndUrgeEntry
// 微信分享配置
const wxConfig = process.env.wxConfig
// const arrearsPath = 'http://api-gateway.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/poly-arrears-backend-for-frontends'

// 微信配置 dev
// const wxConfigObj = {
//   wxConfig: 'http://web.zjh.com/api/WxInfo/wxDetails',
//   // wxConfig: 'http://webapp.test.zanjiahao.com/api/WxInfo/wxDetails  ',
// }

export default {
  houseId,
  pageUrl,
  projById,
  URL,
  dataContext,
  auditPath,     // 审计
  cuiJiaoPath,   //  催缴重构
  dataAnalysisPath,  // 大数据
  wxConfig,     //  微信配置
  arrearsUrl,
  // arrearsPath,
  referUrl,
}

//  预留扩展  async   错误捕获   node



