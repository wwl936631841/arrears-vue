'use strict'
// const merge = require('webpack-merge')
// const devEnv = require('./dev.env')

module.exports = {
  NODE_ENV: '"testing"',
  ENV_CONFIG: '"test"',
  BASE_API: '"http://api-gateway.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com"',   // 接口url
  projById:'"http://api.test.zanjiahao.com/public/threshold/villageInfos"',       // 改了协议
  auditAndUrgeEntry:'"http://webapp.test.zanjiahao.com/companyservice/Dispatch/dispatchlist"',
  pageUrl: '"http://arrears-vue.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com/#/"',
  arrearsUrl: '"http://webapp.test.zanjiahao.com/fee/reminder/start"',

  houseId:'"https://api.test.zanjiahao.com/public/payment/cottageId"',  //转化houseid

  wxConfig: '"http://webapp.test.zanjiahao.com/api/WxInfo/wxDetails"',   // 微信分享
}

