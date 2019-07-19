let conditionParam = {
  orderColumn: 'visit_suggest',   // 默认值
  orderType: 'DESC',
  ownId: '',
  pageNo: 1,
  pageSize: 10,
  // type: 3,  // 1:短信催缴,2:电话催缴,3:上门催缴
  houseId: '',
  customName: '',
  status: '',
}
let activeStatus = {
  moneyUp: true,  // 欠费金额
  timeUp: true,   // 逾期时长
  iconToggle: true, // 状态
  bodyLock: false,   // 状态选择
}

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  },
  // 查询公共条件
  conditionParam,
  roleArr: [],
  activeStatus,
}


export default state
