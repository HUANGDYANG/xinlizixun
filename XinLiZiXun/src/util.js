function goPath(url, method = 'ng') {
  switch (method) {
    case 'ng':
      wx.navigateTo({ url: url })
      break
    case 'rl':
      wx.reLaunch({ url: url })
      break
    case 'rd':
      wx.redirectTo({ url: url })
      break
    case 'st':
      wx.switchTab({ url: url })
      break
    default:
      wx.navigateTo({ url: url })
      break
  }
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res.code)
      }
    })
  })
}

function deleteHtmlTag(str) {
  str = str.replace(/<[^>]+>|&[^>]+;/g, '').trim() // 去掉所有的html标签和&nbsp;之类的特殊符合
  return str
}

function sleep(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise resolved')
    }, s * 1000)
  })
}

function prevPageOnLoad() {
  let pages = getCurrentPages() // 获取当前页面js里面的pages里的所有信息。
  let prevPage = pages[pages.length - 2]
  prevPage.onLoad()
  wx.navigateBack()
}

async function authorization(api) {
  var loginRes = await wxLogin()
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        var data = {
          code: loginRes,
          iv: res.iv,
          encryptedData: res.encryptedData
        }

        wx.request({
          url: api.url, // 开发者服务器接口地址",
          data: data, // 请求的参数",
          method: api.method,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            resolve(res)
          }
        })
      }
    })
  })
}

function authorError(code) {
  if (code === 9000) {
    goPath('/pages/wxInfo')
  }
}

async function checkInfo() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        resolve(res.authSetting['scope.userInfo'])
      }
    })
  })
}

// 周日历
/**
 * 获取该周的所要显示的周和日期的对应数据，数据结构如下
 * var weekDay = {week: '',day: ''}
 * 参数：selectWeek  0为本周，数字代表前几周或者后几周，例如1是下一周
 */
function getWeekDayList(selectWeek, num = 7, push = 0) {
  //  1.获取周一对应得时间
  //  2.用循环七次添加周一到周日对应得周几和几号

  var selectWeekTime =
    getCurrentTimeStamp() + selectWeek * num * 24 * 60 * 60 * 1000

  // 周一的时间 原本的有bug
  var mondayTime =
    selectWeekTime - (getWeekNumber(selectWeekTime) - 1) * 24 * 60 * 60 * 1000
  // issues
  if (getWeekNumber(selectWeekTime) - 1 < 0) {
    mondayTime = selectWeekTime - 6 * 24 * 60 * 60 * 1000
  }

  var timeBean = {
    selectDay: 0,
    yearMonth: '',
    weekDayList: [],
    timeBean: '一二三四五六日',
    today: ''
  }

  for (var i = 0; i < num; i++) {
    var weekDay = {
      week: '',
      day: '',
      expire: false
    }
    weekDay.week = getWeek(mondayTime + i * 24 * 60 * 60 * 1000)
    weekDay.day = getMyDay(mondayTime + i * 24 * 60 * 60 * 1000)
    weekDay.yearMonth = getYearMonth(mondayTime + i * 24 * 60 * 60 * 1000)
    // weekDay.expire = isExpire()
    timeBean.weekDayList.push(weekDay)
  }
  // 判断是否过期
  timeBean.weekDayList.forEach((item, i) => {

    if (item.day < getMyDay(getCurrentTimeStamp())) {
      if (getMonth(item.yearMonth) > getMonth(new Date())) {
        return
      } else if (getYear(item.yearMonth) > getYear(new Date())) {
        return
      }
      timeBean.weekDayList[i].expire = true
    }
  })

  timeBean.today = getMyDay(getCurrentTimeStamp())
  timeBean.yearMonth = getYearMonth(selectWeekTime)
  timeBean.selectDay = +getCurrenrWeek() + 1
  return timeBean
}

// 获取当前时间戳
function getCurrentTimeStamp() {
  var timestamp = new Date().getTime()
  return timestamp
}

// 获取下一个月
function getLastMonth(res) {
  // 获取下个月日期
  var date = new Date(res)
  var month = date.getMonth() + 2
  return month
}
function getLastYear(res) {
  // 获取下个月日期
  var date = new Date(res)
  var year = date.getFullYear()
  return year + 1
}

// 获取当前周几
function getCurrenrWeek() {
  var str = '6012345'.charAt(new Date().getDay())
  return str
}

// 时间戳获得年月
function getYearMonth(res) {
  var time = new Date(res)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  if (m < 10) m = '0' + m
  return y + '-' + m
}

// 时间戳获得月
function getMonth(res) {
  var time = new Date(res)
  var m = time.getMonth() + 1
  if (m < 10) m = '0' + m
  return m
}

// 时间戳获月年
function getYear(res) {
  var time = new Date(res)
  var y = time.getFullYear()
  return y
}

// 时间戳转几号
function getMyDay(res) {
  var time = new Date(res)
  var d = time.getDate()
  return d
}

// 时间戳转周几
function getWeek(res) {
  var time = new Date(res)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return '日一二三四五六'.charAt(new Date(y + '/' + m + '/' + d).getDay())
}

// 时间戳转周几 0123456
function getWeekNumber(res) {
  var time = new Date(res)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return '0123456'.charAt(new Date(y + '/' + m + '/' + d).getDay())
}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

module.exports = {
  goPath,
  authorization,
  checkInfo,
  getWeekDayList,
  prevPageOnLoad,
  sleep,
  deleteHtmlTag,
  getYearMonth,
  getMyDay,
  compareVersion
}
