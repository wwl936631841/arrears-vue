'use strict'
// const merge = require('webpack-merge')
// const devEnv = require('./dev.env')

module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"uat"',
  BASE_API: '"http://api-gateway-uat.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com"',
  projById:'"http://api.pre.zanjiahao.com/public/threshold/villageInfos"',
  auditAndUrgeEntry:'"http://webapp.pre.zanjiahao.com/companyservice/Dispatch/dispatchlist"',   // 跳转

  pageUrl: '"http://arrears-vue-uat.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/#/"',
  arrearsUrl: '"http://webapp.pre.zanjiahao.com/fee/reminder/start"',     // 接口

  houseId:'"http://api.pre.zanjiahao.com/public/payment/cottageId"',  //转化houseid

  // BASE_API: '"http://api-gateway.uat.cn-shenzhen.alicontainer.com"',  　　？
  wxConfig: '"http://webapp.uat.zanjiahao.com/api/WxInfo/wxDetails"',
}
