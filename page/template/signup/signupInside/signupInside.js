let app = getApp();
export default {
  message_mode_arr : ['red','green','orange'],
  signup_message_timer:0,
  data:{
    signup_phone:'',
    signup_reg:'',
    signupData:{
      signupInsideData:{
        app:app,
        placeholderStatus:0,
        mode:0,
        phoneValue:'',
        phonefocus: false,
        regfocus: false,
        regTime: 0,
        message:{
          str:'',
          mode:0,
          hide:true
        }
      }
    }
  },
//   super:function(__p){
//     _p = __p || this;
//   },
  /*
   * 提示信息
   */
  showMessage(str='',mode=0){
    let _p = this;
    if(str){
      if (_p.signup_message_timer) clearTimeout(_p.signup_message_timer);
      _p.setData({
        'signupData.signupInsideData.message.hide': false,
        'signupData.signupInsideData.message.str':str,
        'signupData.signupInsideData.message.mode':_p.message_mode_arr[mode]
      });
      _p.signup_message_timer = setTimeout(() => _p.setData({'signupData.signupInsideData.message.hide':true}),3000);
    }
  },
  /*
   * 获取验证码
   */
  getReg() {
    let _p = this;
    if (_p.data.signup_phone){
      if (!_p.data.signup_phone.match(/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
        _p.showMessage("手机号格式错误", 0);//显示提示信息
        return;
      }
      app.getData(_p,'/hello/sendSms.dtzn',{phoneNum:_p.data.signup_phone},(res)=>{
        //console.log("发送短信验证");
        _p.showMessage("正在发送短信验证码",2);
        if (res.result==406){
          _p.showMessage("登录频繁，稍后再试", 2);
        }
      });
      _p.setData({
        "signupData.signupInsideData.regTime": 60
      });
      _p.timeDown();

    }else{
      _p.showMessage("请输入手机号",0);
    }
  },
  /*
   * 注册 / 登录
   */
  signupSubmit() {
    let _p = this;
    // app.setUserInfo(100536, 18025498563, '652A1A776F4BA9BD60FB253DE76D592AF4558109293A27BE8FE2A8EABC846C07');
    // _p.closeSignup();
    // if ('function' == typeof _p.signup_callback_var) _p.signup_callback_var.call(_p, {});
    // return;

    if (_p.data.signup_phone){
      if (!_p.data.signup_phone.match(/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
        _p.showMessage("手机号格式错误", 0);//显示提示信息
        return;
      }
      if(_p.data.signup_reg){
        wx.showLoading({
          title: '登录中'
        });
        app.getData(_p,'/user/login.dtzn',{yid:'xiaochengxu',uname:_p.data.signup_phone,code:_p.data.signup_reg,registrationid:'xiaochengxu', apptype:1},(res)=>{
          wx.hideLoading();
          if(res.result == 200){
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
           
            _p.closeSignup();
            app.setUserInfo(res.data.uid, res.data.uname, res.data.token, (res.data.user.wechatimg ? res.data.user.wechatimg:res.data.user.headimg));
            console.log('app.globalData.v_userInfo', app.globalData.v_userInfo)

            /* if (app.globalData.v_userInfo.avatarUrl){
              _p.upHeadImg();
            } */
              
            
           
            if('function' == typeof _p.signup_callback_var) _p.signup_callback_var.call(_p,res);
          }else{
            _p.showMessage(res.msg,0);
          }
        });
      }else{
        _p.showMessage("请输入验证码",0);//显示提示信息
      }
    }else{
      _p.showMessage("请输入手机号",0);//显示提示信息
    }
  },
  /**
   * 助力
   */
   helpUserSubmit(){
    let _p = this;
     if (_p.data.signup_phone || app.helpUserData.tempPhone){
       if (!(_p.data.signup_phone || app.helpUserData.tempPhone).match(/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
         _p.showMessage("手机号格式错误", 0);//显示提示信息
         return;
       }
       if(_p.data.signup_reg){
         wx.showLoading({
           title: '助力中'
         });
         _p.getData('/bigprice/helpUser.dtzn', ()=>({ phonenum: (_p.data.signup_phone || app.helpUserData.tempPhone), uname: _p.data.phone, prizeid: _p.data.pgid, smscode: _p.data.signup_reg}),(res)=>{
           wx.hideLoading();
           console.log("助力成功 callback");
           console.log(res);

           if(res.result == 419){
             wx.showToast({
               title: '无助力次数',
               image: '../../image/cha.png',
               duration: 2600
             });
             _p.closeSignup();

           }else if(res.result == 200){

             try{
               console.log("助力成功");
               app.setUserInfo(res.data.uid, (_p.data.signup_phone || app.helpUserData.tempPhone), res.data.token);
               console.log('app.globalData.v_userInfo', app.globalData.v_userInfo)
               
               _p.getData('/bigprice/getBigPriceInfo.dtzn', () => ({
                 uid: app.user_info.id,
                 token: app.user_info.token
               }), (res) => {
                 console.log(res);
                 if (res.result == 200 || res.result == 413) {
                   console.log('开团成功');
                   app.isgohome = ()=>{
                     wx.redirectTo({
                       url: 'index'
                     })
                   };
                    _p.openAlert(2, () => {
                     //_p.checkSignup()
                     console.log("點擊按鈕后");
                     /* if (app.globalData.v_userInfo.avatarUrl) {
                       _p.upHeadImg();
                     } */
                     wx.redirectTo({
                       url: 'index'
                     })
                     
                    });
                    _p.setData({
                      'user_state.help': false
                    })

                 }else{
                   //提示res.msg
                   app.failToast(res.msg);

                 }
               })  //助力成功之后就立马开启新团

               

             }catch(e){
               console.log(`助力 callback 方法出错：${e.message}`);
             }
             //_p.closeSignup();
             //app.setHelpUserPhone(_p.data.signup_phone || app.helpUserData.tempPhone);
             //if('function' == typeof _p.signup_callback_var) _p.signup_callback_var.call(_p,res);
           }else{
             _p.showMessage(res.msg,0);
           }
         }, (e) => {
          //  console.log(e);
           wx.hideLoading();
           wx.showToast({
             title: e.msg,
             image: '../../image/cha.png',
             duration: 2600
           });
         });
       }else{
         _p.showMessage("请输入验证码",0);//显示提示信息
       }
     }else{
       _p.showMessage("请输入手机号",0);//显示提示信息
     }
   },
  /*
   * 倒计时
   */
  timeDown(){
    let _p = this;
    if (app.signup_timer) {
      clearInterval(app.signup_timer);
    }
    app.signup_timer = setInterval(()=>{
      let _rt = _p.data.signupData.signupInsideData.regTime - 1;
      if(_rt <= 0){
        clearInterval(app.signup_timer);
        app.signup_timer = 0;
      }
      _p.setData({
        "signupData.signupInsideData.regTime":_rt
      });
    },1000);
    
  },
  signupPhoneInput(e){
    let _p = this;
    _p.data.signup_phone = e.detail.value;
    //console.log('phoneValue:', _p.data.signupData.signupInsideData.phoneValue);
  },
  signupRegInput(e){
    let _p = this;
    _p.data.signup_reg = e.detail.value;
  },
  clearPhoneInput(){
    let _p = this;
    _p.data.signup_phone = '';
    _p.setData({
      'signupData.signupInsideData.phoneValue': '',
      'signupData.signupInsideData.phonefocus': true,
    });
  },
  

}
