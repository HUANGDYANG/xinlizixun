// import WeCropper from '../../models/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (option) {
    const { src } = option
    if(src) {
      this.setData({
        src: src
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  touchStart(e) {
    this.wecropper.touchStart(e.detail.e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e.detail.e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e.detail.e)
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        // console.log(src);
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.wecropper.pushOrign(src)
      }
    })
  },
  getCropperImage() {
    this.wecropper.getCropperImage((src) => {
      // 接收一个路径参数
      if (src) {
        //  获取到裁剪后的图片
        // wx.redirectTo({
        //   url: `../index/index?avatar=${avatar}`
        // })
        let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[pages.length - 2]
        // prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
        // prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        //   tempFilePaths: src
        // })
        prevPage.updateTempFilePaths(src)
        //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
        //最后就是返回上一个页面。
        wx.navigateBack({
          delta: 1 // 返回上一级页面。
        })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  
})