var app = getApp(), _p, sm;

// import signup from '../template/signup/signup.js';
// import sharingMenu from '../template/sharingMenu/sharingMenu.js';

Page({

  data: {
    commData:{
      eject:'none',
      circle:'circle'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _p=this;

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
  bindTextAreaBlur: (even) => {    //自动获取输入框的值
    console.log(even)
    _p.setData({
      content: even.detail.value
    })
  },
  onMyEvent: function (e) {
     // 自定义组件触发事件时提供的detail对象
    console.log("e.detail", e.detail)

  },
 //打开评论框
  openSignup:function(){
    this.setData({
       'commData.eject': 'bolck',
       'commData.circle': 'circle'
     })  
  },
  close:function(){
    console.log('关闭')
    this.setData({
      
       'commData.circle': 'circles'
        }) 
    setTimeout(function () {
      this.setData({
        'commData.eject': 'none'
      })
    
    }.bind(this), 500)
    
  }
})
