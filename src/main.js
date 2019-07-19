import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';        //  先全局导入
import 'vant/lib/index.css';
import { Toast, Actionsheet } from 'vant'
import rem from './utils/rem'
import index from './components/common/index'
import VConsole from 'vconsole';
// 数据埋点
import { buryPoint } from './utils/index'
Vue.prototype.$buryPoint = buryPoint
// debug
if(process.env.NODE_ENV != 'production'){
  var vConsole = new VConsole();
}

// 时间过滤器
import moment from 'moment/moment'
Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value);
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt;
});

Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  // return moment(value).format(formatString); // value可以是普通日期 20170723
  return moment.unix(value).format(formatString); // 这是时间戳转时间
});

// directive
import hasBtn from './directive/permission'

Vue.use(Vant);
Vue.use(Toast);
Vue.use(Actionsheet);
import * as utils from '@/assets/js/base'

import envConfigObj from '@/api/env'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.axios = axios
Vue.prototype.$toast = Toast
Vue.prototype.$envConfigObj = envConfigObj


new Vue({
  // el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app')
