// let app = getApp(), _p, slider_width = 0,bgam;

export default class audioList {
  _p;
  bgam;
  slider_css = '.slider-cell .mu-slider';
  auto_timer = 0;
  currentTime_temp = -1;
  touchend_timer = 0;
  audio_ctr_timer = 0;
  audio_ended = 0;
  slider_width = 0;
  touchData = {
    touchmove_iv:6, //touchmove事件执行间隔时间
    touchmove_timer:0,
    istouch:0,
    start:[0,0],
    move:[0,0],
    end:[0,0]
  };
  data = {
    app:getApp(),
    audio_run_index:-1,
    list:[]
  };
  audio_star_event = 0;
  constructor(page,mode=1,op){
    let _t = this;
    _t._p = page;

    if(op && 'function' == typeof op.start) _t.audio_star_event = op.start;

    if (mode == 1) _t.bgam = wx.createInnerAudioContext();
    else _t.bgam = wx.getBackgroundAudioManager();
    _t.bgam.onPlay(()=>{_t.audioOnPlay()});
    _t.bgam.onPause(()=>{_t.audioOnPause()});
    _t.bgam.onTimeUpdate(()=>{_t.audioOnTimeUpdate()});
    _t.bgam.onEnded(()=>{_t.audioOnEnded()});
    _t.bgam.onWaiting(()=>{_t.audioOnWaiting()});
    _t.bgam.onStop(()=>{_t.audioOnStop()});

    _t.event();
  }
  audioOnPlay(){
    //audio 播放事件
    let _t = this;
    console.log("播放事件");
    //_p.audio_ended = 0;
    if('function' == typeof _t.audio_star_event) _t.audio_star_event();
    if('object' == typeof _t._p && 'object' == typeof _t._p.rbgam) _t._p.rbgam.pause();
  }
  audioOnPause(){
    //audio 暂停事件
    console.log("暂停事件");
  }
  audioOnStop(){
    //audio 暂停事件
    //_p.audio_ended = 0;
    console.log("停止事件");
    // if(!_t.touchData.istouch){
    // _t._p.setData({
    //   'audioData.audio_run_index':-1
    // });
    // }
  }
  audioOnTimeUpdate(){
    //audio 播放进度更新事件
    let _t = this;
    // console.log(_t);
    if(_t.bgam.duration <= 0) return false;
    let _floor = Math.floor(_t.bgam.currentTime);
    if(_t.currentTime_temp != _floor){
      _t.currentTime_temp = _floor;
      _t.audioRun(_floor,_t.bgam.duration);
      console.log("播放进度更新事件::",_t.bgam.currentTime + ' / ' + _t.bgam.duration);
    }
  }
  audioOnEnded(){
    //audio 自然播放结束事件
    let _t = this;
    _t.audio_ended = 1;
    let __index = _t._p.data.audioData.audio_run_index;
    let _d = {
      ['audioData.list['+__index+'].audio.time'] : (_t.touchData.istouch?_t.data.app.min_time(_t._p.data.audioData.list[__index].audio.time[2]):['00','00',0]),
      'audioData.audio_run_index' : (_t.touchData.istouch?__index:-1),
      // ['audioData.list['+__index+'].audio.animat'] : 0
    };
    console.log(_t.touchData.istouch);
    if(!_t.touchData.istouch) {
      //自动播放进度条已读完
      _d['audioData.list['+__index+'].audio.slider'] = 0;
      // console.log("24444444444444");
      // bgam.stop();
      _t.bgam.src = '';
      // _t._p.setData({
      //   'audioData.audio_run_index' : -1
      // });
    }
    _t._p.setData(_d);
  }
  audioOnWaiting(){
    //audio 加载中事件，当音频因为数据不足，需要停下来加载时会触发
    console.log("加载中事件");
  }

  audioCtr(e){
    let _t = this;
    if(_t.audio_ctr_timer) return false;
    _t.audio_ctr_timer = setTimeout(()=>{
      _t.audio_ctr_timer = 0;
    },300);
    try{
      let _index = _t.get_event_index(e);
      console.log('ctr index:',_index);
      if(_t._p.data.audioData.audio_run_index == _index){
        //stop
        console.log("ctr stop!");
        _t._p.setData({
          'audioData.audio_run_index':-1
        },()=>{
          _t.bgam.pause();
        });
      }else{
        //run
        console.log("ctr run");
        // console.log("run bgam.src:", bgam.src);
        // console.log("run audio.src:", _p.data.audioData.list);
        _t._p.setData({
          'audioData.audio_run_index':_index
        },()=>{
          if(_t.bgam.src != _t._p.data.audioData.list[_index].audio.src) {
            _t.bgam.src = _t._p.data.audioData.list[_index].audio.src;
            _t.bgam.startTime = _t._p.data.audioData.list[_index].audio.time[2];
            console.log('startTime arr',_t._p.data.audioData.list[_index].audio.time);
            console.log('startTime',_t._p.data.audioData.list[_index].audio.time[2]);
          }
          _t.bgam.play();
          // console.log('audioData.audio_run_index:',_t._p.data.audioData.audio_run_index);
        });
      }
    }catch(_e){
      console.warn("audioCtr 错误：",_e);
    }

  }
  audioRun(ct,d){
    let _t = this;
    if(_t._p.data.audioData.audio_run_index < 0) return false;
    let _ct = _t.data.app.min_time(ct);
    let _d = {
      ['audioData.list['+_t._p.data.audioData.audio_run_index+'].audio.time']:_ct,
      // ['audioData.list['+_t._p.data.audioData.audio_run_index+'].audio.animat']:!_t.touchData.istouch
    };
    if(!_t._p.data.audioData.list[_t._p.data.audioData.audio_run_index].audio.maxTimeInit) {
      _d['audioData.list['+_t._p.data.audioData.audio_run_index+'].audio.maxTimeInit'] = 1;
      _d['audioData.list['+_t._p.data.audioData.audio_run_index+'].audio.maxTime'] = _t.data.app.min_time(Math.floor(d));
    }
    if(!_t.touchData.istouch && _ct[2] > 0) _d['audioData.list['+_t._p.data.audioData.audio_run_index+'].audio.slider'] = ct/d;
    _t._p.setData(_d);
  }
  /**
   * mode  -  0:只更新进度条不更新时间（动画变短）  1：进度条和时间均更新（动画变短）
   */
  setAudio(_s,mode=1){
    let _t = this;
    console.log('setAudio _s:',_s);

    let _index = _t._p.data.audioData.audio_run_index;
    let _d = {};
    if(_s <= 0){
      _d = {
        ['audioData.list['+_index+'].audio.slider']:0,
        // ['audioData.list['+_index+'].audio.animat']:0
      };
      //if(mode) _d['audioData.list['+_index+'].audio.time'] = ['00','00',0];
      if(mode) {
        _t.setAudioStartTime(0,()=>{
          _t._p.setData(_d);
        });
      }else{
        _t._p.setData(_d);
      }

      return false;
    }else if(_s >= _t._p.data.audioData.list[_index].audio.maxTime[2]){
      _d = {
        ['audioData.list['+_index+'].audio.slider']:1,
        // ['audioData.list['+_index+'].audio.animat']:0
      };
      // if(mode) _d['audioData.list['+_index+'].audio.time'] = _t._p.data.audioData.list[_index].audio.maxTime;
      if(mode) _t.setAudioStartTime(_t._p.data.audioData.list[_index].audio.maxTime[2]);
      _t._p.setData(_d);

      return false;
    }else{
      _d = {
        ['audioData.list['+_index+'].audio.slider']:(_s-0)/_t._p.data.audioData.list[_index].audio.maxTime[2],
        // ['audioData.list['+_index+'].audio.animat']:0
      };
      // if(mode) _d['audioData.list['+_index+'].audio.time'] = _s;
      console.log('setAudio mode:',mode);
      if(mode) {
        _t.setAudioStartTime(_s,()=>{
          _t._p.setData(_d);
        });
      }else{
        _t._p.setData(_d);
      }
      return true;
    }
  }
  setAudioStartTime(_s,callback){
    let _t = this;
    let _index = _t._p.data.audioData.audio_run_index;
    console.log('go to index =>',_index);
    console.log('go to s =>',_s);
    // bgam.stop();
    // bgam.pause();
    let _d = {
      ['audioData.list['+_index+'].audio.time']:_t.data.app.min_time(_s),
      // ['audioData.list['+_index+'].audio.animat']:0
    };
    _t._p.setData(_d,()=>{
      // _t.touchData.istouch = 0;
      if('function' == typeof callback) callback();
    });
    console.log("go to :",_t._p.data.audioData.list[_index].audio.time[2]);
    console.log(_t.bgam.src, _t._p.data.audioData.list[_index].audio.src);
    if(_t.bgam.src != _t._p.data.audioData.list[_index].audio.src) {
      _t.bgam.src = _t._p.data.audioData.list[_index].audio.src;
      _t.bgam.startTime = _s;
      setTimeout(()=>{
        // _t.bgam.seek(_s);
        _t.bgam.play();
      },50);
    }else{
      _t.bgam.seek(_s);
      setTimeout(()=>{
        _t.bgam.play();
      },50);
    }

    if(_t.touchend_timer) clearTimeout(_t.touchend_timer);
    _t.touchend_timer = setTimeout(()=>{
      _t.touchData.istouch = 0;
    },100);
  }
  hasAudioChange(_index){
    let _t = this;
    if(_index < 0){
      //audio stop

      return true;
    }else if(_t._p.data.audioData.audio_run_index == _index){
      return false;
    }else{
      console.warn('audio change');
      _t._p.setData({
        'audioData.audio_run_index' : _index
      });
      //audio change
      console.log("change time:",_t._p.data.audioData.list[_index].audio.time[2]);
      return true;
    }
  }
  time_touchstart(e){
    let _t = this;
    if(_t.touchend_timer) clearTimeout(_t.touchend_timer);
    _t.touchData.istouch = 1;
    try{
      let _index = _t.get_event_index(e);
      //console.log('index:',_index);
      _t.hasAudioChange(_index);
      // console.log('touchstart:',e);
      let _touches = _t.get_touches(e);

      _t.touchData.start = [_touches[0].clientX, _touches[0].clientY];
      _t.touchData.move = [_touches[0].clientX, _touches[0].clientY];
    }catch(err){
      console.warn("get_touches 出错",err);
    }
  }
  time_touchmove(e){
    let _t = this;
    console.log('_t',_t);
    // console.log('touchmove:',e);
    if(_t.touchData.touchmove_timer) return;
    _t.touchData.touchmove_timer = setTimeout(()=>{
      _t.touchData.touchmove_timer = 0;
    },_t.touchData.touchmove_iv);
    let _touches = _t.get_touches(e);
    let _x = _t.touchData.move[0] =_touches[0].clientX;
    _t.touchData.move[1] = _touches[0].clientY;
    let _s = _t.trans_time(_x,e);
    _t.setAudio(_s,0);
  }
  time_touchend(e){
    let _t = this;
    let _x = _t.touchData.move[0],
        _y = _t.touchData.move[1],
        _y_abs_diff = Math.abs(_t.touchData.start[1] - _y);
    if(_y_abs_diff <= 10 || Math.abs(_t.touchData.start[0] - _x)*1.25 > _y_abs_diff){
      let _s = _t.trans_time(_x,e);
      _t.setAudio(_s,1);
    }else{
      _t.setAudio(_t._p.data.audioData.list[_t._p.data.audioData.audio_run_index].audio.time[2],0);
      _t.bgam.pause();
      _t._p.setData({
        'audioData.audio_run_index' : -1
      });
      console.log('x轴*1.25 小于 y轴，不予触发拖动');
    }
    // if(_t.touchend_timer) clearTimeout(_t.touchend_timer);
    // _t.touchend_timer = setTimeout(()=>{
    //   _t.touchData.istouch = 0;
    // },100);
  }
  // time_touchtap(e){
  //   if(_t.touchend_timer) clearTimeout(_t.touchend_timer);
  //   _t.touchData.istouch = 1;
  //   try{
  //     let _index = _t.get_event_index(e);
  //     //console.log('index:',_index);
  //     _t.hasAudioChange(_index);
  //     // console.log('touchstart:',e);
  //     let _touches = _t.get_touches(e);
  //     let _s = _t.trans_time(_touches[0].clientX,e);
  //     _t.setAudio(_s,1);
  //   }catch(err){
  //     console.warn("get_touches 出错",err);
  //   }
  // },
  get_event_index(e){
    return e.currentTarget.dataset.index == 'undefined' ? e.target.dataset.index : e.currentTarget.dataset.index;
  }
  get_touches(e){
    return (e.changedTouches.length>0?e.changedTouches:e.touches);
  }
  trans_time(_x,e){
    //坐标 转 秒
    let _t = this;
    console.log('trans_time:',_t.slider_width);
    if(!_t._p.data.audioData.list[_t._p.data.audioData.audio_run_index].audio.maxTime[2]) return 0;
    //return Math.floor(_t._p.data.audioData.list[_t._p.data.audioData.audio_run_index].audio.maxTime * (_x - e.currentTarget.offsetLeft) / (_t.data.app.globalData.systemInfo.windowWidth - e.currentTarget.offsetLeft * 2));
    return Math.floor((_x - e.currentTarget.offsetLeft) / _t.slider_width * _t._p.data.audioData.list[_t._p.data.audioData.audio_run_index].audio.maxTime[2]);
  }
  updata(callback){
    let _t = this;
    let query = wx.createSelectorQuery().select(_t.slider_css);
    console.log('query:',query);
    query.boundingClientRect((rect)=>{
      try {
        console.log('rect.width:',rect);
        if(rect.width > 0 ) _t.slider_width = rect.width;
        else console.warn("获取滑动条宽度为0");
      } catch (err) {
        console.log('播放条信息出错',err);
        if('function' == typeof callback) callback();
      }
    }).exec();
  }
  pageHide(){
    let _t = this;
    _t.bgam.stop();
    _t.bgam.src="";
    _t._p.setData({
      'audioData.audio_run_index' : -1
    });
  }
  noEvent(){
    return false;
  }
  //跳转查看详情
  see_details(e){
    console.log(e);
    let h_details_sid = e.currentTarget.dataset.sid
    wx.navigateTo({
      url: '../details/details?h_details_sid=' + h_details_sid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  /**
   * 事件导入
   */
  event(){
    let _t = this;
    _t._p.audioCtr = (e)=>{
      _t.audioCtr(e);
    }
    _t._p.time_touchstart = (e)=>{
      _t.time_touchstart(e);
    }
    _t._p.time_touchmove = (e)=>{
      _t.time_touchmove(e);
    };
    _t._p.time_touchend = (e)=>{
      _t.time_touchend(e);
    };
    _t._p.see_details = (e)=>{
      _t.see_details(e);
    };
    _t._p.noEvent = ()=>{
      _t.noEvent();
    };
  }

  //播放记录
  playback_record(e) {

  }

}
