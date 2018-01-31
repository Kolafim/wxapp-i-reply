Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 接收属性
    list: {
      type: Object,
      value: [],
      observer:function(...e){
        //数据发生改变时执行该函数
        // if(e[0].list && e[0].list.length > 0){
        //   e[0].list = this.initListData(e[0].list);
        // }
        // this.setData({
        //   newData: e[0]
        // });
        console.log(e);
        // console.warn('this',this);

        let _card_list = e[0], app = getApp(), _p = this;
        // console.log(_card_list);
        if(_card_list && _card_list.length > 0){
          app.each(_card_list,(_k,_v)=>{
            _card_list[_k].swiper_scale = 1;
            _card_list[_k].swiper_width = _p.swiper_item_width;
            _card_list[_k].swiper_translate = 0-(_k * _p.swiper_item_width - (app.globalData.systemInfo.windowWidth - _p.swiper_item_width)/2);
          });
          console.log('card_list:',_card_list);
          _p.setData({
            panel_width : app.globalData.systemInfo.windowWidth*_card_list.length+'px',
            translate : _card_list[_p.data.index].swiper_translate,
            card_list : _p.initScale(_p.data.index,_card_list)
          });
        }
      }
    }
  },
  data: {
    width:74,//卡片宽度 x%
    index:1,//初始下标
    translate:0,//px
    duration:0,//ms
    panel_width:'100%',
    card_list:[]
  },
  created(){
    //在组件实例进入页面节点树时执行，此方法内不能调用setData
    console.log('swiper this:',this.data);

    let app = getApp(), _p = this;

    _p.touch = {
      min_scale:0.8,//scale最小值
      touchmove_iv:7, //touchmove事件执行间隔时间
      touchmove_timer:0,
      start:[0,0],
      move:[0,0],
      end:[0,0]
    };

    if(!app.globalData.systemInfo.windowHeight) {
      app.globalData.systemInfo = wx.getSystemInfoSync();
    }

    _p.swiper_item_width = _p.data.width / 100 * app.globalData.systemInfo.windowWidth;
  },
  attached(){
    //在组件实例进入页面节点树时执行
  },
  ready(){
    //在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）

  },
  moved(){
    //在组件实例被移动到节点树另一个位置时执行

  },
  detached(){
    //在组件实例被从页面节点树移除时执行

  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){
      console.log(this);
    },
    initListData(_list) {
        let app = getApp();
        let new_list = [];
        if (_list && _list.length > 0) {
            app.each(_list, (_k, _v) => {
                new_list[_k] = {
                    id: _v.id,
                    headimage: _v.headimage ? (_v.headimage.replace(/^\/+group1/, (app.globalData.imghost + '/group1'))) : '',
                    uname: _v.nickname || _v.uname,
                    content: _v.content,
                    readnum: _v.readnum,
                    sex: _v.sex,
                    islike: _v.islike,
                    like_count: _v.likeCount,
                    com_count: _v.commentCount || _v.com_count || 0,
                    create_time: _v.screatetime,
                    time: _v.time ? app.getDateDiff(_v.time) : 0,
                    uid: _v.uid,
                    isfollow:_v.isfollow
                }
                if (_v.type) new_list[_k].type = _v.type;
            });
        }
        return new_list;
    },
    swiper_touchstart(e){
      let _p = this;
      try{
        let _touches = _p.get_touches(e);
        _p.touch.translate = _p.data.translate;
        _p.touch.start = [_touches[0].clientX, _touches[0].clientY];
        _p.touch.move = [_touches[0].clientX, _touches[0].clientY];
        _p.setData({
          duration:0,
        })
      }catch(err){
        console.warn("get_touches 出错",err);
      }
    },
    swiper_touchmove(e){
      let _p = this;
      if(_p.touch.touchmove_timer) return;
      _p.touch.touchmove_timer = setTimeout(()=>{
        _p.touch.touchmove_timer = 0;
      },_p.touch.touchmove_iv);
      let _touches = _p.get_touches(e);
      _p.touch.move[0] =_touches[0].clientX;
      _p.touch.move[1] = _touches[0].clientY;
      let _n = _p.touch.translate + _p.touch.move[0] - _p.touch.start[0];
      // console.log(_p.touch.translate,_n);

      let __data = {
        translate:_n,
      };
      // console.log('_n:',_n);
      __data = _p.getScale(__data,_n);

      _p.setData(__data);

    },
    swiper_touchend(e){
      let _p = this, _x = 0 - (_p.touch.move[0] - _p.touch.start[0]);
      let _n = _p.touch.translate + _x;

      let _index = _p.data.index;
      if(Math.abs(_x) > 60){
        if(Math.abs(_x) > _p.swiper_item_width){
          _index += Math.floor(_x / _p.swiper_item_width);
        }else{
          if(_x>0){
            _index += 1;
          }else{
            _index -= 1;
          }
        }

        if(_index < 0){
          _index = 0;
        }else if(_index > _p.data.card_list.length-1){
          _index = _p.data.card_list.length-1;
        }
      }

      _p.setData({
        index:_index,
        duration:300,
        translate:_p.data.card_list[_index].swiper_translate,
        ..._p.initScale(_index)
      })

    },
    get_touches(e){
      return (e.changedTouches.length>0?e.changedTouches:e.touches);
    },
    getScale(data = {},_n){
      let _p = this;
      for(let i=0;i<_p.data.card_list.length;i++){
        let _diff = _n - _p.data.card_list[i].swiper_translate;
        // console.log([_n, _p.data.card_list[i].swiper_translate]);
        // console.log('diff:',_diff);
        if(Math.abs(_diff) <= _p.swiper_item_width){
          let _scale = Math.abs(_diff)/_p.swiper_item_width;
          if(_scale > 1) _scale = 1;
          // if(_scale < _p.touch.min_scale) _scale = _p.touch.min_scale;
          // console.log(Math.abs(_diff),_scale);
          if(i-1 >= 0){
            data['card_list['+(i-1)+'].swiper_scale'] = _scale * (1-_p.touch.min_scale) + _p.touch.min_scale;
          }

          if(i+1 <= _p.data.card_list.length-1){
            data['card_list['+(i+1)+'].swiper_scale'] = _scale * (1-_p.touch.min_scale) + _p.touch.min_scale;
          }
          data['card_list['+i+'].swiper_scale'] = (1-_scale) * (1-_p.touch.min_scale) + _p.touch.min_scale;
          // console.log([_scale * (1-_p.touch.min_scale) + _p.touch.min_scale, (1-_scale) * (1-_p.touch.min_scale) + _p.touch.min_scale]);
          break;
        }
      }
      return data;
    },
    initScale(_index = 1, _list){
      if(_list){
        if(_index-1 >= 0){
          _list[_index-1].swiper_scale = this.touch.min_scale;
        }
        if(_index+1 <= _list.length-1){
          _list[_index+1].swiper_scale = this.touch.min_scale;
        }
        _list[_index].swiper_scale = 1;
        return _list;
      }else{
        let _s_data = {};
        if(_index-1 >= 0){
          _s_data['card_list['+(_index-1)+'].swiper_scale'] = this.touch.min_scale;
        }

        if(_index+1 <= this.data.card_list.length-1){
          _s_data['card_list['+(_index+1)+'].swiper_scale'] = this.touch.min_scale;
        }
        _s_data['card_list['+_index+'].swiper_scale'] = 1;
        return _s_data;
      }
    }
  },

})
