'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"http://192.168.3.24:7300"', // 测试环境接口
  BASE_API: '"http://api-gateway.cba0c8564f4854aee954cc244799b71ab.cn-shenzhen.alicontainer.com"', // 测试环境接口
  projById: '"http://api.dev.zanjiahao.com/public/threshold/villageInfos"',     // 绍兴开发  运营指标进入首页调用的接口
  auditAndUrgeEntry: '"http://webapp.test.zanjiahao.com/companyservice/Dispatch/dispatchlist"',   // 贵贤开发
  pageUrl: '"http://192.168.3.101"',
  arrearsUrl: '"https://webapp.test.zanjiahao.com/fee/reminder/start"',   // 去催缴 催缴中

  houseId:'"http://api.dev.zanjiahao.com/public/payment/cottageId"',  //转化houseid

  wxConfig: '"http://webapp.test.zanjiahao.com/api/WxInfo/wxDetails"',  // 微信分享
})
