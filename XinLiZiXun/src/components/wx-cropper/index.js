import WeCropper from './we-cropper.js'

Component({
  /**
   * 组件的属性列表
   */

  properties: {
    cropperOpt: {
      type: Object,
      value: {},
    },
    src: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      this.triggerEvent('start', {e})
    },
    touchMove(e) {
      this.triggerEvent('move', {e})
    },
    touchEnd(e) {
      this.triggerEvent('end', {e})
    },
    getCropperImage() {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('cropper', myEventDetail, myEventOption)
    },
    uploadTap() {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('upload', myEventDetail, myEventOption)
    }
  },
  ready() {
    const { cropperOpt } = this.data
    cropperOpt.compoent = this
    // console.log(cropperOpt)
    cropperOpt.src = this.properties.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()  
  }
})
