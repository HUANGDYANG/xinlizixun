// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function sleep (s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise resolved')
    }, s * 1000)
  })
}
/**
 * 封装toast
 */
function showToast (type, text, obj) {
  let param = { duration: (obj && obj.duration) || 1500, mask: (obj && obj.isMask) || false }
  switch(type) {
    case 'text': {
      param['title'] = text || ''
      param['icon'] = 'none'
      break
    }
    case 'loading': {
      param['title'] = text || ''
      param['icon'] = 'loading'
      break
    }
    case 'success': {
      param['title'] = text || ''
      param['icon'] = 'success'
      break
    }
    case 'error': {
      param['title'] = text || ''
      param['image'] = '/images/emoji.png'
      break
    }
    default: {
      break
    }
  }
  wx.showToast(param)
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  showToast: showToast,
  formatDate,
  formatNumber,
  formatTime1,
  sleep
}
