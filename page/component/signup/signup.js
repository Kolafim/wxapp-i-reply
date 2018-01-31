let _p;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 接收属性
    options: {
      type: Object,
      value: {
        status:0
      },
      observer:function(...e){
        //数据发生改变时执行该函数
        console.log(e);
      }
    }
  },
  data: {
    message_mode_arr : ['red','green','orange'],
    signup_timer:0,
    signup_message_timer:0,
    signup_phone:'',
    signupData:{
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
  },
  created: function(){
    _p = this;
    // console.log(_p);

    //_p.getLocationPhone();
  },
  methods: {
    /*
     * 提示信息
     */
    showMessage:(str='',mode=0)=>{
      if(str){
        if (_p.data.signup_message_timer) clearTimeout(_p.data.signup_message_timer);
        _p.setData({
          'signupData.message.hide': false,
          'signupData.message.str':str,
          'signupData.message.mode':_p.data.message_mode_arr[mode]
        });
        _p.data.signup_message_timer = setTimeout(() => _p.setData({'signupData.message.hide':true}),3000);
      }
    },
    /*
     * 获取手机号缓存
     */
    getLocationPhone:()=>{
      wx.getStorage({
        key: 'signup_phone',
        success: function (_lp) {
          console.log('signup_phone:' + _lp.data);
          if (_lp.data) {
            _p.data.signup_phone = _lp.data;
            _p.setData({
              'signupData.phoneValue': _lp.data
            });
          }else{
            _p.setData({
              'signupData.phonefocus': true
            });
          }
        }
      });
    },
    /*
     * 存储登录手机号
     */
    setLocationPhone: () => {
      if(_p.data.signup_phone){
        wx.setStorage({
          key: 'signup_phone',
          data: _p.data.signup_phone
        });
      }
    },
    /*
     * 获取验证码
     */
    getReg: () => {
      if (_p.data.signup_phone){
        _p.setData({
          "signupData.regTime": 60
        });
        _p.timeDown();
        _p.setLocationPhone();
      }else{
        _p.showMessage("请填写手机号",2);
      }
    },
    /*
     * 检查验证码
     */
    matchReg: () => {

    },
    /*
     * 登录
     */
    signupSubmit: () => {

      _p.showMessage("错误信息");

    },
    /*
     * 倒计时
     */
    timeDown: () => {
      _p.data.signup_timer = setInterval(()=>{
        let _rt = _p.data.signupData.regTime - 1;
        if(_rt <= 0){
          clearInterval(_p.data.signup_timer);
        }
        _p.setData({
          "signupData.regTime":_rt
        });
      },1000);
    },
    signupPhoneInput: e => {
      _p.data.signup_phone = e.detail.value;
    },
    clearPhoneInput:()=>{
      _p.data.signup_phone = '';
      _p.setData({
        'signupData.phoneValue': '',
        'signupData.phonefocus': true,
      });
    }
  }
})
