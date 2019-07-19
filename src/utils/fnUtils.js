
// 节流
export function throttle(fn, threshhold) {
  let timeout
  let start = new Date
  threshhold = threshhold || 160    // 默认值  时间间隔
  return function () {
    let context = this, args = arguments
    let curr = new Date() - 0   // 当前时间戳
    clearTimeout(timeout)
    if (curr - start >= threshhold) {
      console.log('now', curr, curr - start)
      fn.apply(context,args)
      start = curr
    }else{   // 脱离事件也要执行一次
      timeout = setTimeout(function () {
        fn.apply(context,args)
      },threshhold)
    }
  }
}

//  去弹跳
export function debounce(fn,delay) {
  let timeout
  return function (e) {
    console.log('清除',timeout,e.target.value)
    clearTimeout(timeout)
    let context = this, args = arguments
    console.log('新的',timeout, e.target.value)
    timeout = setTimeout(function () {     //  过delay执行
      console.log('---')
      fn.apply(context,args)
    }, delay)
  }
}

