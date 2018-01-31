let app = getApp();
import signupInside from 'signupInside/signupInside.js'
export default {
  ...signupInside,
  signup_p_timer:0,
  alert_callback_var:0,
  signup_callback_var:0,
  data:{
    ...signupInside.data,
    signupData:{
      ...signupInside.data.signupData,
      status:0,
      animat:'zoomIn',
      signup_hidden:true
    }
  },
  super:function(__p){
    // _p = __p;
    // signupInside.super(_p);
  },
  /**
   * 打开注册层
   */
  openSignup(callback,mode=0){
      let _p = this;
    if(_p.signup_p_timer) {
      clearTimeout(_p.signup_p_timer);
      _p.signup_p_timer = 0;
    }
    

    if('function' == typeof callback) _p.signup_callback_var = callback;

    console.log('mode:',mode);
    if(mode){
      app.getStorageEndList[2] = function(){
        _p.setData({
          "signupData.signupInsideData.app":app
        });
      };
      _p.setData({
        "signupData.signupInsideData.mode": 1,
        'signupData.signupInsideData.phoneValue': app.helpUserData.tempPhone,
        'signupData.signupInsideData.regValue':''
      });
      if (app.helpUserData.tempPhone) _p.signupPhoneInput({ detail: { value: app.helpUserData.tempPhone } });
    }else{
      app.getStorageEndList[0] = function(){
        _p.setData({
          "signupData.signupInsideData.app":app
        });
      };
      _p.setData({
        "signupData.signupInsideData.mode": 0,
        'signupData.signupInsideData.phoneValue': app.user_info.phone,
        'signupData.signupInsideData.regValue': ''
      });
      _p.signupPhoneInput({ detail: { value: app.user_info.phone}});
    }
  
    _p.setData({
      "signupData.status":0,
      "signupData.signup_hidden":false,
      "signupData.animat":'zoomIn',
      'signupData.signupInsideData.placeholderStatus':0
    })

    setTimeout(()=>{
      _p.setData({
        'signupData.signupInsideData.placeholderStatus': 1
      })
    },530);
  },
  /**
   * 打开回馈层
   */
  openAlert(_status = 0, callback = 0){
    let _p = this;
    if(_status == 1 || _status == 2 || _status == 3){
      if(_p.signup_p_timer) {
        clearTimeout(_p.signup_p_timer);
        _p.signup_p_timer = 0;
      }

      _p.alert_callback_var = callback;

      _p.setData({
        "signupData.status":_status,
        "signupData.signup_hidden":false,
        "signupData.animat":'zoomIn'
      })
    }
  },
  /**
   * 关闭注册层
   */
  closeSignup(){
    let _p = this;
    if ('function' == typeof app.isgohome) {
      app.isgohome.call();
      app.isgohome = 0;
    }
    _p.setData({
      "signupData.animat": 'zoomOut'
    });
    _p.signup_p_timer = setTimeout(()=>{
      _p.setData({
        "signupData.signup_hidden": true
      });
    },510);
    
  },
  /**
   *
   */
   alertCallBack(){
    let _p = this;
     if('function' == typeof _p.alert_callback_var) _p.alert_callback_var.call();

   },
   eventFalse(){

   }
}
