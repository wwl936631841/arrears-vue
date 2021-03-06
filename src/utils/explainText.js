export default {
  AI: {
    title: '财务AI分析',
    list: [
      {
        title: '本年收缴率：',
        content: '本年收缴率=实收本年累计（含本月）/本年累计应收（含本月） 。 数据统计到当前时间前一天。'
      },{
        title: '本月收缴率：',
        content: '本月收缴率=实收本月/本月应收   。 数据统计到当前时间前一天。'
      },{
        title: '综合收缴率:',
        content: '综合收缴率=（实收本年累计（含本月）+实收往年累计（含本月））/（本年累计应收+年初往年应收）。数据统计到当前时间前一天。'
      },{
        title: '清欠率：',
        content: '清欠率=实收往年累计/年初往年应收 。 数据统计到当前时间前一天。'
      },{
        title: '实收本月：',
        content: '仅指实际收到本月的费用，不含本月实收本年往月的费用，不含本月预收下月的预收款，包含往月预收结转至本月的抵扣款。数据统计到当前时间前一天。'
      },{
        title: '项目排名：',
        content: '按本年年度收缴率排名，含所有管辖项目，按降序排名。  数据统计到当前时间前一天。'
      },{
        title: '楼栋排名：',
        content: '按选择项目中楼栋本年收缴率排名，低于项目收缴率阀值的楼栋按由低到高的顺序展示前10的楼栋在不达标模块，高于项目收缴率阀值的楼栋按由高到底的顺序展示前10的楼栋在达标模块。  数据统计到当前时间前一天。'
      },{
        title: '指标分析：',
        content: '展示本年收缴率低于阀值的项目。'
      }
    ]
  },
  Record: {
    title: '实收记录',
    list: [
      {
        title: '实收本年累计（含本月）：',
        content: '指本年累计到当月的实收款，包含本月实收本年往月的费用，不含本月预收下月的预收款，包含往月结转至本月的抵扣款。（仅指常规收费，含住宅物业费、空调费、能耗费、车位管理费、专项维修基金、多种经营等费用）。数据统计到当前时间前一天。<br/>实收本年累计（含本月）=实收本月累加（含往月预收抵扣到本月的，不含本月预收下月及下下月的）+本月实收本年往月累加。'
      },{
        title: '实收往年累计：',
        content: '指本年累计到当月实际收到以前年度的费用，不含实收本年的费用。数据统计时间本年到当前时间前一天。'
      },{
        title: '实收本月：',
        content: '仅指实际收到本月的费用，不含本月实收本年往月的费用，不含本月预收下月的预收款，包含往月预收结转至本月的抵扣款。'
      },{
        title: '实收往月：',
        content: '指本月收回往月的费用，含本月实收本年往月 及 本月实收往年的费用。'
      },{
        title: '住宅物业费：',
        content: '常规物业管理费。'
      },{
        title: '空调使用费：',
        content: '超时使用空调费，以及超时空调管理费'
      },{
        title: '多种经营费：',
        content: '出租场地费、广告位等获取的费用。'
      },{
        title: '能耗费用：',
        content: '消耗水电所产生的费用。'
      },{
        title: '车位费：',
        content: '停车管理费、月租费、临停费用。'
      },{
        title: '代收类：',
        content: '包含专项维修基金'
      },{
        title: '年初往年应收：',
        content: '指截至上年末的累计欠费。'
      },{
        title: '实收往年累计：',
        content: '指本年累计到当月实际收到以前年度的费用，不含实收本年的费用。数据统计时间本年到当前时间前一天。'
      },{
        title: '往年欠费：',
        content: '截止当前时间的前一天，还未收回的往年欠款。<br/>往年欠费=年初往年欠款- 已收往年欠款'
      },{
        title: '收费方式占比：',
        content: '计算本年截止上月的常规收费的收费方式占比。'
      }
    ]
  },
  Parking: {
    title: '停车场AI分析',
    list: [
      {
        title: '厂商数量：',
        content: '含目前已经采集到数据的小蜜蜂，壹媒介2个厂商的数据。'
      },{
        title: '车场数量：',
        content: '采集到厂商对应的车场数量。'
      },{
        title: '车位数量：',
        content: '车场所含车位总数。'
      },{
        title: '月卡数量：',
        content: '车场所含有效月卡总数。'
      },{
        title: '今日应收：',
        content: '当日客户应缴费用合计。'
      },{
        title: '今日实收：',
        content: '当日实收费用合计。'
      },{
        title: '免费放行情况：',
        content: '<br />1）金额含免费放行金额及未缴费出场金额。<br />2）免费放行数量，包含免费放行数量，以及抬杆数量，未交费出场数量。'
      },{
        title: '收费情况：',
        content: '上月现金收费，与整体收费的比值。'
      },{
        title: '停车出入情况：',
        content: '上月平均每小时出场数量。'
      },{
        title: '车位使用率：',
        content: '上月平均每小时车位使用情况。'
      },{
        title: '指标分析：',
        content: '展示低于或者高于阀值的项目。'
      }
    ]
  },
}