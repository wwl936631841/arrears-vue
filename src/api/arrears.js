import service from '@/utils/service'
// import {arrearsPath} from '@/api/env'





// 催缴

export const cancelFollow = data => {
  return service({
    url: '/attention/cancelFollow/',
    method: 'get',
    params: data
  })
}

// 获取短信催缴记录
export const getRecord = data => {
  return service({
    url: '/arrears/message/records/',
    method: 'get',
    params: data
  })
}
