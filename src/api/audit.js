import service from '@/utils/service'
import * as url from '@/api/env'


// 获取审计列表
export const auditTaskList = data => {
  return service({
    url: url + '/audit/car/queryPersonTaskList',
    method: 'get',
    params: data
  })
}

