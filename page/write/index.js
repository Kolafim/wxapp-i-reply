var app = getApp(), _p;

Page({
  message_mode_arr : ['red','green','orange'],
  message_timer:0,
  path:'',
  duration:0,
  textarea_val:'',
  isuploadfile:0,
  fileList:[],
  req_run:0,
  data: {
    maxlength:200,
    cursor:0,
    message:{
      hide:true,
      str:'',
      mode:'green'
    }
  },
  onLoad: function (options) {
    _p = this;
    if(options.path) _p.path = options.path;
    try{
      _p.duration = wx.getStorageSync(_p.path);
    }catch(e){
      console.warn("获取 duration 出错:",e);
    }
    console.log("path:",_p.path);
    console.log("duration:",_p.duration);

    wx.getSavedFileList({
      success: function (res) {
        console.log(res.fileList);
        _p.fileList = res.fileList;
      }
    });

  },

  onReady: function () {
    // _p.openSignup();
  },
  onShow: function () {

  },

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
  onShareAppMessage: function (res) {
       if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title:'i回复',
      path:'/page/index/index',
      imageUrl: "../../image/fenxiang1.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  textareChange:(e)=>{
    // console.log(e);
    _p.textarea_val = e.detail.value
    _p.setData({
      cursor:e.detail.cursor
    });
  },
  sendData:()=>{
    console.log({path:_p.path,duration:_p.duration,text:_p.textarea_val});

    // wx.navigateTo({
    //   url: '../wafer2-quickstart-nodejs-master/client/pages/index/index'
    //   // ?path=' + savepath
    // });

    if(!_p.path){
      _p.path = _p.fileList[0].filePath;
    }
    console.log("new path:",_p.path);

    if(!_p.textarea_val || _p.textarea_val.replace(/^\s+|\s+$/g, "").replace(/(\r|\n){3,}/g, '$1').length <= 1){
      console.log("请填写话题内容");
      _p.showMessage_1('请填写话题内容',0);
      return false;
    }

    if(_p.req_run) {
      _p.showMessage_1('正在请求,无需重复发布',2);
      return false;
    }
    _p.req_run = 1;
    _p.showMessage_1('正在发布...',1);

    app.getData(_p,'/spred/addSpredInfo.dtzn',()=>({
      scontent:_p.textarea_val,
      uid: 100000,//app.user_info.id,
      token: '17BCF80CF2966CBF1ED168F0C316934A946CBC6FD619B3ADC376C521D41754B8',//app.user_info.token,
      spredclass:4
    }),(_res)=>{
      _p.req_run = 0;
      // wx.hideLoading();
      if(_res.result == 200){
        console.log("提交成功：",_res);
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2500
        })
        // setTimeout(()=>{_p.tohome(1)},2500);
      }else{
        console.log("发布出错：",_res);
        _p.showMessage_1(_res.msg,0);
      }

    },(_err)=>{
      _p.req_run = 0;
      console.log("请求发布失败：",_err);
      _p.showMessage_1('请求发布失败',0);
    });
  },
  tohome:(mode=0)=>{
    console.log("to home");
    //跳转
    // wx.navigateTo({
    //   url: '../index/index'
    // });
    if(mode == 1){
      // wx.setStorageSync('isreload', 1);
    }else{
      // app.globalData.is_recoding_end = 1;
    }
    wx.reLaunch({
      url: '/page/index/index'
    });
  },
  showMessage_1:(str='',mode=0)=>{
    if(str){
      if (_p.message_timer) clearTimeout(_p.message_timer);
      _p.setData({
        message:{
          hide:false,
          str:str,
          mode:_p.message_mode_arr[mode]
        }
      });
      _p.message_timer = setTimeout(() => _p.setData({'message.hide':true}),4000);
    }
  },
})
