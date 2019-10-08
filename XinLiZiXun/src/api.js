import wepy from 'wepy'
// const baseUrl = 'http://xinli.gzdianhui.cn'
// const baseUrl = 'http://192.168.1.43:8087'
const baseUrl = 'https://miniprogram.careyourfeeling.cn'
// const baseUrl = 'http://192.168.1.22:8087'
// 切换环境
const isDebug = true
let showModal = true
//  拦截器 请求配置 app.wpy => constructor中配置
const requestConfig = {
  // 发出请求时的回调函数
  config(p) {
    wx.showNavigationBarLoading()
    p.timestamp = +new Date()
    if (wx.getStorageSync('token')) {
      p.header = Object.assign({}, p.header, {
        accessToken: wx.getStorageSync('token')
      })
    }

    return p
  },
  success(p) {
    // 可以在这里对收到的响应数据对象进行加工处理
    isDebug && console.log('request success: ', p.data)
    let statusCode = p.statusCode + ''
    let code = p.data.code + ''
    if (statusCode.startsWith('2') && p.data.code === 9000) {
      //   wx.removeStorageSync('token')

      if (!showModal) return
      showModal = false
      wepy
        .showModal({
          content: '请先进行登录操作', // 提示的内容,
          showCancel: false, // 是否显示取消按钮,
          confirmText: '确定', // 确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#2565C3' // 确定按钮的文字颜色,
        })
        .then(res => {
          showModal = true
          wx.redirectTo({
            url: '/pages/wxInfo'
          })
        })

      return false
    }

    if (statusCode.startsWith('2') && !code.startsWith('0')) {
      if (code === '404') {
        return false
      }
      wx.showToast({
        icon: 'none',
        title: p.data.message,
        duration: 1000,
        mask: true
      })
      return false
    }
    // 必须返回响应数据对象，否则后续无法对响应数据进行处理
    return p.data
  },
  fail(p) {
    isDebug && console.log('request fail: ', p)
    return p
  },
  complete(p) {
    // isDebug && console.log('request complete: ', p)
    wx.hideNavigationBarLoading()
  }
}

const $post = (url, data, contentType = true) => {
  contentType
    ?    (contentType = 'application/x-www-form-urlencoded;')
    : (contentType = 'application/json;charset=UTF-8')
  return wepy.request({
    url: baseUrl + url, // 开发者服务器接口地址",
    data: data, // 请求的参数",
    method: 'POST',
    header: {
      'content-type': contentType
    },
    dataType: 'json' // 如果设为json，会尝试对返回的数据做一次 JSON.parse
  })
}

const $get = (url, data) => {
  return wepy.request({
    url: baseUrl + url,
    data: data,
    method: 'GET',
    dataType: 'json'
  })
}

const api = {
  saveFormId(data) {
    return $post('/consultant/saveFormId', data)
  },
  // 首页
  slideshow() {
    return $get('/banner/list')
  },
  getIndexConsultantlist() {
    // 获取首页咨询师列表 走心聊
    return $get('/consultant/recommend/list')
  },
  getIndexCourseList() {
    // 获取首页课程列表
    return $get('/course/recommend/list')
  },
  getIndexEvaluationList() {
    // 获取首页评测列表
    return $get('/evaluation/recommend/list')
  },

  // 咨询师列表 走心聊 搜索
  getConsultantList(data) {
    // 分页
    // { pageNum = '', pageSize = '', minPrice = '', maxPrice = '', beginTime = '', endTime = '', week = '', city = '', type = '', keyword = '' }
    return $get('/consultant/list', data)
  },
  getConsultantDetail(id) {
    // 咨询师详情
    return $get(`/consultant/detail/${id}`)
  },
  favedConsultant(id) {
    // 收藏咨询师(取消收藏也是此接口)
    return $post(`/consultant/faved/${id}`)
  },
  getConsultantScheduleList(data) {
    // 查询咨询师当天排班列表
    return $post('/consultantSchedule/list', data)
  },
  subscribeConsultant(data) {
    // 预约
    return $post('/consultantSchedule/subscribe', data)
  },
  getMemberLastSchedule() {
    // 查询用户的上一次预约记录
    return $post('/memberSchedule/lastSchedule')
  },

  // 课程 知新话
  getCourseList(data) {
    // 获取课程列表 type 分页
    return $get('/course/list', data)
  },
  getCourseDetail(data) {
    // 课程详情
    return $post(`/course/detail/${data.id}`)
  },
  getCourseCommentList({
    pageNum = 1,
    pageSize = 10,
    courseId
  }) {
    // 课程评分列表 分页
    return $post(`/course/comment/list`, {
      pageNum,
      pageSize,
      courseId
    })
  },
  courseComment({
    id,
    grade
  }) {
    // 课程评分
    return $post(`/course/comment/${id}`, {
      grade
    })
  },
  purchaseCourse(id, data) {
    // 购买课程
    return $post(`/course/purchase/${id}`, data)
  },
  userAlready(data) {
    // 用户阅读完课程
    return $post(`/course/user/already`, data)
  },

  // 测评 心自知~
  getEvaluationList({
    payType,
    pageNum = 1,
    pageSize = 10
  }) {
    // 测评列表
    return $get('/evaluation/list', {
      payType,
      pageNum,
      pageSize
    })
  },
  getEvaluationDetail(id) {
    // 测评详情
    return $get(`/evaluation/detail/${id}`)
  },
  getEvaluationExamList(data) {
    // 根据测评Id获取试题列表 分页
    return $post('/evaluation/achieve/examList', data)
  },
  getEvaluationScoreDetail(id) {
    // (用户测评列表的)用户测评结果
    return $post('/evaluationScore/detail/' + id)
  },
  submitSurvey(data) {
    // 保存调查问卷
    return $post('/evaluation/questionnaire/save', data)
  },
  getEvaluationResult(data) {
    // 提交测试答案获取结果
    return $post('/evaluation/achieve/result', data)
  },
  getUserEvaluationList(data) {
    // 用户已测评列表 分页
    return $post('/evaluationScore/list', data)
  },
  getUserEvaluationDetail(id) {
    // (用户测评列表的)用户测评结果
    return $post('/evaluationScore/detail/' + id)
  },
  purchaseEvaluation(id, data) {
    // 购买评测
    return $post('/evaluation/purchase/' + id, data)
  },

  //  新速递
  getNewsList(data) {
    // 分页
    return $get('/news/list', data)
  },
  getNewsDetail(id) {
    return $get(`/news/detail/${id}`)
  },

  // 登录
  getCaptcha(phone) {
    // 获取验证码
    return $post('/outer/captcha', {
      phone
    }, false)
  },
  login(data) {
    // 手机验证码登录 {"phone": "13760684224",// 手机号码"captcha":"751702",// 验证码"openId":"123", // 授权返回的openid"couponCode":"" // 优惠码 可不传}
    return $post('/outer/login', data, false)
  },

  wxLogin: {
    url: `${baseUrl}/wechat/appLogin`,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  },

  // 好像是静态的啊啊啊 这些还没对接的
  getContactusInfo() {
    // 获取联系我们信息 换接口了
    // return $get('/contactus/info')
    return $get('/contactus/aboutUs')
  },
  getNotifyList() {
    // 入驻须知
    return $get('/notify/list')
  },
  getPolicyProtocol() {
    // 入驻协议
    return $get('/policy/enter/protocol')
  },
  getPolicyMaterials() {
    // 获取入驻准备材料信息
    return $get('/policy/enter/materials')
  },
  getInformedProtocol() {
    // 获取知情协议
    return $get('/policy/informed/protocol')
  },
  getMemberCustomizationintro() {
    //  服务介绍
    return $get('/memberCustomization/service/intro')
  },

  /**
   * 个人中心
   */
  getMessageCount() {
    // 查询未读消息数量
    return $post('/message/count')
  },
  applyConsultant(data) {
    // 申请入驻咨询师
    return $post('/consultant/apply', data)
  },
  // 我的收藏
  getUserFavedList(data) {
    // 用户收藏咨询师列表 分页
    return $post('/consultant/faved/list', data)
  },
  // 我的信息
  memberEdit(data) {
    // 编辑资料
    return $post('/member/edit', data)
  },
  getMemberInfo() {
    // 获取用户信息
    return $post('/member/info')
  },
  // 我的咨询
  repaySchedule(data) {
    return $post('/memberSchedule/repay', data)
  },
  getMemberScheduleList(data) {
    // 我的咨询(用户) 分页
    return $post('/memberSchedule/list', data)
  },
  getMemberScheduleDetail(id) {
    // 预约详情
    return $post('/memberSchedule/info/' + id)
  },
  getMemberScheduleTags() {
    // 获取常用标签
    return $post('/memberSchedule/tags')
  },
  addMemberScheduleTags(data) {
    // 添加标签
    return $post('/memberSchedule/add/tag', data)
  },
  delTag(id) {
    return $post(`/tag/delete/${id}`)
  },
  getMemberScheduleCancelNum() {
    // 查询当月预约取消次数
    return $post('/memberSchedule/searchCancelNum')
  },
  cancelSchedule(id) {
    // 用户取消预约
    return $post(`/memberSchedule/cancel/${id}`)
  },

  // 我的测评
  commentMemberSchedule(data) {
    // 评价咨询师
    return $post('/memberSchedule/comment', data)
  },
  getMemberEvaluationList(data) {
    // 获取用户已测评列表 有分页的
    return $post('/evaluationScore/list', data)
  },

  // 我的钱包
  getConsultantWithdrawList(data) {
    return $post('/consultantWithdraw/list', data)
  },
  depositWithdraw(data) {
    // 咨询师提现请求
    return $post('/consultantWithdraw/request', data)
  },
  getConsumeList(data) {
    // 消费明细 分页 获取搜索 都在这一个接口
    return $post('/particulars/consume/list', data)
  },
  delConsume(id) {
    // 删除消费明细
    return $post('/particulars/consume/delete/' + id)
  },
  getMembereSubscribeInfo(id) {
    // 根据预约id获取评论
    return $post(`/memberSchedule/comment/subscribeInfo/${id}`)
  },
  getIncomeList(data) {
    // 咨询师收益明细 分页
    return $post('/particulars/income/list', data)
  },
  // 我的评价
  getMemberCommentList(data) {
    // 用户发出的评价 分页
    return $post('/memberSchedule/comment/list', data)
  },
  getMemberReceiveCommentList(data) {
    // 咨询师收到的评论  分页
    return $post('/memberSchedule/comment/receiveList', data)
  },
  delMemberComment(data) {
    // 咨询师删除评论 id
    return $post('/memberSchedule/comment/delete', data)
  },
  // 排班
  consultantScheduling(data) {
    // 安排排班
    return $post('/consultant/scheduling', data)
  },
  getSchedulingRrecordList(data) {
    // 咨询师的排班记录
    return $post('/consultantSchedule/recordList', data)
  },

  // 咨询列表
  getConsultList(data) {
    // 分页 获取咨询师的咨询列表
    return $post('/consultantSchedule/consult/list', data)
  },
  commentMenber(data) {
    // 咨询师评论用户
    return $post('/consultant/comment/create', data)
  },
  getHistoryCommentlist(data) {
    // 咨询师对某一用户的所有评论(历史评论)
    return $post('/consultant/comment/list', data)
  },
  getCommentMenberInfo(data) {
    // 咨询师查看某一评论
    return $post('/consultant/comment/info', data)
  },
  consultantAbsence(data) {
    // 咨询师--更新咨询状态---缺席
    return $post('/consultantSchedule/absence', data)
  },
  getEvaluationScoreRecord(data) {
    // 获取用户历史测评
    return $post('/evaluationScore/record', data)
  },
  completeConsultantSchedule(data) {
    // 咨询师--更新咨询状态---完成
    return $post('/consultantSchedule/complete', data)
  },

  // 我的消息
  getMessageList(data) {
    // 我的消息 分页
    return $post('/message/list', data)
  },
  getCommentInfo(id) {
    // 根据id获取标签详情
    return $post('/memberSchedule/comment/info/' + id)
  },
  updateReadStatus(id) {
    // 更新阅读状态
    return $post(`/message/updateReadStatus/${id}`)
  },

  // 55
  // 定制服务
  getMemberCustomizationList() {
    // 时间跨度列表 获取价格的
    return $post('/memberCustomization/time/list')
  },
  createMemberCustomization(data) {
    // 定制服务
    return $post('/memberCustomization/create', data)
  },
  getMemberCustomizationDetail(id) {
    // 获取定制详情
    return $post('/memberCustomization/detail/' + id)
  },
  searchMemberCustomizationInfo() {
    // 查询用户是否有定制
    return $post('/memberCustomization/search/info')
  },
  updatesearchMemberCustomization(data) {
    // 修改定制
    return $post('/memberCustomization/update/' + data.id, data)
  },
  refundMemberCustomization(id) {
    // 取消定制
    return $post(`/memberCustomization/refund/${id}`)
  },
  closeMemberOrderCustomization(data) {
    // 关闭订单
    return $post('/memberCustomization/closeOrder', data)
  },

  // 友优惠
  getCouponList(data) {
    // 优惠列表 分页
    return $post('/coupon/list', data)
  },
  purchaseCoupon(id) {
    // 购买优惠
    return $post('/coupon/purchase/' + id)
  },

  // 音频
  getMemberImInfo() {
    // 获取网易云账号
    return $post('/member/imInfo')
  },
  callConsultantSchedule(data) {
    // 用户与咨询师实时音频
    return $post('/consultantSchedule/member/call', data)
  },
  consultantBeginConnect() {
    // 咨询师开始通话
    return $post('/consultant/connect/begin')
  },
  consultantEndConnect(data) {
    //  咨询师结束通话
    return $post('/consultant/connect/end', data)
  },
  getUserImInfo(data) {
    //  根据用户id获取用户网易云账号
    return $post('/member/userImInfo', data)
  },
  // 更改
  consultantOffline() {
    return $post('/consultant/offline')
  },

  // add

  saveGather(data) {
    // 保存测评收集信息
    return $post('/evaluation/gather/save', data)
  },
  getPushEvaluation() {
    // 获取推送测评
    return $post('/member/push/evaluation')
  },
  getQuesteList(data) {
    // 获取测评调查问卷问题列表
    return $post('/evaluation/questionnaire/list', data)
  },
  getRealTimeList(data) {
    return $post('/realTime/order/list', data)
  },
  getConsultRealTimeList(data) {
    return $post('/realTime/order/consult/list', data)
  },
  /**
   * 上传
   * @param {*} file
   */
  upload(file) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${baseUrl}/file/upload`,
        filePath: file,
        header: {
          accessToken: wx.getStorageSync('token')
        },
        success(res) {
          const data = JSON.parse(res.data)
          let statusCode = res.statusCode + ''
          let code = data.code + ''
          if (statusCode.startsWith('2') && code.startsWith('0')) {
            resolve(data)
          }
        },
        name: 'file',
        complete(res) {
          console.log(res)
        }
      })
    })
  }
}

export {
  requestConfig,
  baseUrl,
  isDebug,
  $post,
  $get
}
export default api
