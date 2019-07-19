
export  function thousands(numStr) {
  let re = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g
  let n = numStr.replace(re, "$1,")
  return n
}
