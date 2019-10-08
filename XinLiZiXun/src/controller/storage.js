export default class TimeStorge {
  setRealTime() {
      wx.setStorageSync('RealTime', 111)
  }
  judge() {
    return wx.getStorageSync('turnEndTime') < +new Date()
  }
}

// export default TimeStorge
