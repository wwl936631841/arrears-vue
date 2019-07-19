import axios from 'axios'
import {Toast} from 'vant';
// import {arrearsPath} from '../api/env'
// import qs from "QS"
/**
 * 封装axios，实现发送/响应接口的拦截，来实现统一提示等效果  状态码啊
 */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 *  失败回调
 */
const error = () => {
  Toast.fail({
    type: 'fail',
    message: `失败信息：`,
  });
}

/**
 *  加载中
 */
const startLoading = () => {
  let loading = Toast.loading({
    mask: true,
    message: '加载中...'
  });
}
/**
 * 加载结束
 */
const endLoading = () => {
  Toast.clear()
}


const service = axios.create({   //  自定义配置
  // baseURL: process.env.BASE_API,
  baseURL: this.$envConfigObj.cuiJiaoPath,
  timeout: 5000 // 请求超时时间限制
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    // if(config.type == 'formData' || config.method != 'post'){
    //   return config
    // }
    // config.data = qs.stringify(config.data)
    startLoading()
    return config
  },
  err => {
    endLoading()
    error()
    return Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    endLoading()
    return response.data
  },
  err => {
    endLoading()
    error()
    return Promise.reject(err)
  }
)

export default service
