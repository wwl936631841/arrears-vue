const mutations = {
  saveAdminInfo(state, adminInfo) {
    state.adminInfo = adminInfo;
  },
  // 变更查询参数
  changeConditionParam(state, obj) {
    state.conditionParam = obj
  },
  // 权限设置
  setRoleArr(state, arr) {
    state.roleArr = arr
  },
  // 切换item激活状态
  changeActiveStatus(state, obj) {
    // debugger
    state.activeStatus[obj.key] = obj.flag
    console.log(state.activeStatus)
  },
  // 状态恢复默认
  setDefaultStatus(state, obj) {
    state.activeStatus = obj
  },
  defaultParam() {
    return {
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
  }
}

export default mutations
