import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home'
import vueTest from '../components/template/vueTest'


Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/vueTest',
      component: vueTest,
      name: 'vueTest',
    },
    {
      path: '/',
      component: Home,
      name: 'home',
    },
    {
      path: '/operationIndex',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/index'),
      name: 'operationIndex',
    },
    // 项目汇总
    {
      path: '/summaryPage',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/summaryPage'),
      name: 'summaryPage',
    },
    // 项目汇总指标解释
    {
      path: '/summaryPage/summaryExplain',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/summaryExplain'),
      name: 'summaryExplain',
    },
    {
      path: '/chargeRecord',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/chargeRecord'),
      name: 'chargeRecord',
    },
    {
      path: '/financeAI',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/financeAI'),
      name: 'financeAI',
    },
    {
      path: '/parkingLotAI',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/parkingLotAI'),
      name: 'parkingLotAI',
    },
    {
      path: '/operation',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/operation'),
      name: 'operation',
    },
    {
      path: '/auditTaskList',
      name: 'auditTaskList',
      component: () => import(/* webpackChunkName: "audit" */  '@/components/audit/auditTaskList'),
      meta: {},
    },
    {
      // path: '/auditRecordList/:id',
      path: '/auditRecordList',
      name: 'auditRecordList',
      component: () => import(/* webpackChunkName: "audit" */  '@/components/audit/auditRecordList'),
      meta: {
        formAuditTask: true,
      },
    },
    {
      path: '/auditReport/:id',
      name: 'auditReport',
      // component: A,
      component: () => import(/* webpackChunkName: "audit" */  '@/components/audit/auditReport'),
      meta: {},
    },
    {
      path: '/auditing/:taskId',
      name: 'auditing',
      component: () => import(/* webpackChunkName: "audit" */  '@/components/audit/auditing'),
    },
    {
      path: '/urgePayment',
      name: 'urgePayment',
      component: () => import(/* webpackChunkName: "audit" */  '@/components/urgePayment/paymentIndex'),
    },
    {
      path: '/paymentReport',
      name: 'paymentReport',
      component: () => import(/* webpackChunkName: "audit" */  '@/components/urgePayment/paymentReport'),
    },
    // 催缴重构 begin
    {
      path: '/arrears',
      name: 'arrears',
      component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/arrearsContainer'),
      children:[
        // 启动催缴
        {
          path: 'urgePaymentOpen',
          name: 'urgePaymentOpen',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/urgePaymentOpen/urgePaymentOpen'),
        },
        // 催缴任务
        {
          path: 'reminderTask',
          name: 'reminderTaskIndex',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/reminderTask/Index'),
          children:[
          ]
        },
        // vant
        {
          path: 'vant',
          name: 'vant',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/homePayment/vant'),
        },
        // 上门
        {
          path: 'visit',
          name: 'visit',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/homePayment/visit'),
        },
        // 上门反馈
        {
          path: 'feedBack',
          name: 'feedBack',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/homePayment/feedBack'),
        },
        // 催缴记录
        {
          path: 'arrearsRecord/:taskId',
          name: 'arrearsRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/homePayment/arrearsRecord'),
        },
        // 上门催缴详情：  公用
        {
          path: 'arrearsDetail/:taskId/:houseId',
          name: 'arrearsDetail',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/common/arrearsDetail'),
          beforeEnter: (to, from, next) => {
            // 执行权限检查
            console.log('permission:', to)
            if(Vue.prototype.$_hasBtn() || Vue.prototype.$_ifFromApp()){
                next()
            }
          }
        },
        // 上门催缴反馈记录
        {
          path: 'recordDetail',
          name: 'recordDetail',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/homePayment/recordDetail'),
        },
        // 短信催缴详情
        {
          path: 'smsReminder/smsDetail',
          name: 'smsDetail',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/smsReminder/smsDetail'),
          beforeEnter: (to, from, next) => {
            // 执行权限检查
            if(Vue.prototype.$_hasBtn() || Vue.prototype.$_ifFromApp()){
                next()
            }
          }
        },
        // 短信催缴记录
        {
          path: 'smsReminder/recordReminder',
          name: 'recordReminder',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/smsReminder/recordReminder'),
        },
        // 电话催缴详情
        {
          path: 'reminderTask/phoneDetail',
          name: 'phoneDetail',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/phoneReminder/phoneDetail'),
          beforeEnter: (to, from, next) => {
            // 执行权限检查
            if(Vue.prototype.$_hasBtn() || Vue.prototype.$_ifFromApp()){
                next()
            }
          }
        },
        // 电话拨打反馈
        {
          path: 'reminderTask/phoneDetail/phoneRecord',
          name: 'phoneRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/phoneReminder/phoneRecord'),
        },
        // 电话拨打记录
        {
          path: 'reminderTask/phoneDetail/phoneBackRecord',
          name: 'phoneBackRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/phoneReminder/phoneBackRecord'),
        },
        // 电话反馈
        {
          path: 'reminderTask/phoneDetail/phoneBack',
          name: 'phoneBack',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/phoneReminder/phoneBack'),
        },
        // 我的关注
        {
          path: 'reminderTask/myFoucs',
          name: 'myFoucsIndex',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/myFoucs/Index'),
        },
        // // 我的关注设置
        {
          path: 'reminderTask/foucsSetting',
          name: 'foucsSetting',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/myFoucs/foucsSetting'),
        },
        // 催缴报告记录
        {
          path: 'reminderTask/goVistRecord',
          name: 'goVistRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/goVistRecord'),
        },
        {
          path: 'reminderTask/goPhoneRecord',
          name: 'goPhoneRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/goPhoneRecord'),
        },
        {
          path: 'reminderTask/goSmsRecord',
          name: 'goSmsRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/goSmsRecord'),
        },
        {
          path: 'reminderTask/RecordList',
          name: 'RecordList',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/RecordList'),
        },
        // 发送邮件等待页面
        {
          path: 'reminderTask/sendEmail',
          name: 'sendEmail',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/sendEmail'),
        },
        // 打印跳转页面
        {
          path: 'reminderTask/printer',
          name: 'printer',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/printer'),
        },
        // 预览
        {
          path: 'reminderTask/preview',
          name: 'preview',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/preview'),
        },
        //  催收函记录
        {
          path: 'reminderTask/collectionRecord',
          name: 'collectionRecord',
          component: () => import(/* webpackChunkName: "arrears" */  '@/components/urgePayment/record/collectionRecord'),
        },
      ]
    },
    {
      path: '/indicatorExplain',
      component: () => import(/* webpackChunkName: "operationIndex" */  '@/components/operationIndex/indicatorExplain'),
      name: 'indicatorExplain',
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x:0 ,y:0}
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {                         //如果未匹配到路由
    //alert('路由匹配失败  准备回跳')
    from.name ? next({name: from.name}) : next('/');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  } else {
    next();                                            //如果匹配到正确跳转
  }
})
router.beforeResolve((to,from,next) => {
  next()
})
router.afterEach((to, from) => {

})

export default router
// export default new Router({
//     // base: process.env.BASE_URL,
//     routes,
//     strict: process.env.NODE_ENV !== 'production'
// })
