export default class sharingManu{
   app=getApp();
  constructor(_p) {
    this._p=_p
    this.data = {
      showModalStatus: false,
      animationData:{},
      path:''
    }
  }

  open_menu(){
    console.log(123, this._p)
    this._p.setData({
      showModalStatus: true
    })
  };
showModal(){
  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  //this._p.animation = animation
  animation.translateY(300).step()
  this._p.setData({
    animationData: animation.export(),
    showModalStatus: true
  })
  console.log("animation", animation)
  setTimeout(function () {
    animation.translateY(0).step()
    this._p.setData({
      animationData: animation.export()
    })
    console.log("animationData", this._p.animationData)
  }.bind(this), 200)
};
hideModal(){
  // 隐藏遮罩层
  console.log("隐藏")
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  console.log("animation", animation)
  //this._p.animation = animation
  animation.translateY(300).step()
  this._p.setData({
    animationData: animation.export(),
  })
 
  setTimeout(function () {
    animation.translateY(0).step()
    this._p.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
    console.log("animationData", this._p.animationData)
  }.bind(this), 200)
 };

 //生成分享图片
//  generate(){
 
//   wx.navigateTo({
//     url: '../drawCanvas/drawCanvas',
//   })
//  };
 //预览图片
 drawCanvas(_fail) {
   let system=this.app.globalData.systemInfo
   console.log(system)
   wx.downloadFile({
     url: 'http://dtznminiapp-1254344927.coscd.myqcloud.com/share.png', //仅为示例，并非真实的资源
     success: function (res) {
       // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
       if (res.statusCode === 200) {
         let imgsrc = res.tempFilePath

         let qr_code = "../../image/qr_code.jpg"

         const ctx = wx.createCanvasContext('attendCanvasId');
         ctx.save();
         // ctx.setFillStyle('#ffffff')
         // ctx.fillRect(0, 0, 305, 453)
         // ctx.restore();
         console.log('system.windowWidth',system.windowWidth)
         ctx.drawImage(imgsrc, 0, 0, system.windowWidth, system.windowHeight);
         ctx.drawImage(qr_code, (system.windowWidth - system.windowWidth * 0.344) / 2, (system.windowHeight - system.windowWidth * 0.144) / 2, system.windowWidth * 0.344, system.windowWidth * 0.344);
         ctx.draw();
         //等待压缩图片生成
         var st = setTimeout(function () {
           if ('function' == typeof _fail) _fail();
           //_p.prodImageOpt();
           clearTimeout(st);
         }, 3000);
       }
     }
   })


 };
 
 prodImageOpt(_fail) {// 获取生成图片路径
   wx.canvasToTempFilePath({
     canvasId: 'attendCanvasId',
     success: (res)=> {
       console.log(res)
       this._p.setData({
         path: res.tempFilePath
       })
       console.log(this._p.data.path)
       if ('function' == typeof _fail) _fail();
     },
   });
 };
 //预览分享图片
 generate(_fail) {
   var current = this._p.data.path
   let array = []
   array.push(current)
   console.log(array)
   wx.previewImage({
     current: current, // 当前显示图片的http链接
     urls: array // 需要预览的图片http链接列表
   })
   if ('function' == typeof _fail) _fail();
 };
}