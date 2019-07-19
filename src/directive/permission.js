import Vue from 'vue'
import store from '../store'

export default {
  // 可扩展  2有权限显示
  inserted(el, binding, vnode) {
    const {roleArr} = binding
    let hasRole = roleArr.some((item) => {
      return item == 2
    })
    if (!hasRole) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

Vue.prototype.$_hasBtn = function (arr) {
  let btnPermissionsArr = store.state.roleArr
  // let btnPermissionsArr = localStorage.getItem("roleArr").split(',')
  return btnPermissionsArr.some((item) => {
    return item == 2
  })
}
Vue.prototype.$_ifFromApp = function () {
  let href = location.href
  let fromPhone = this.$utils.GetUrlParam('fromPhone')
  if ((fromPhone == "android") || (fromPhone == "iOS")) {
    return true
  }
  return false
}


const hasBtn = Vue.directive('hasBtn', {
  inserted: function (el, binding, vnode) {
    // debugger
    if (!Vue.prototype.$_hasBtn()) {
      console.log(el.parentNode)
      console.log(el)
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

export {hasBtn}
