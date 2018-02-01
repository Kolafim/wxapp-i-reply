var app = getApp(), _p;
// import signup from '../template/signup/signup.js';
Page({
  pageData:{
    page_count:5, //每页数量
    page:1,
    isrun:0,
    isend:0
  },
  data: {
    app:app,
    list:[],
    loadHide:false
  },
  onLoad: function (options) {
    _p = this;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // if(!app.globalData.systemInfo.windowHeight) {
    //   app.globalData.systemInfo = wx.getSystemInfoSync();
    // }

    let _list = [
      {
        id:1001,
        uid:201,
        camp:0,
        uname:'gggg',
        content:'嘎嘎哇嘎娃娃',
        time:1516777021816,
        com_count:105,
        last_com_user:'酸菜肥肠',
        isfollow:1,
        headimage:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLVqgbS8xic3kTAGWCl5NHP3PvDxffX656sdoX1tSIEewSTGuydWePWMCnuuPlmlYs6wYJNicIkuDmw/0"
      },
      {
        id:1002,
        uid:202,
        camp:1,
        uname:'gggg',
        content:'gh嘎嘎嘎娃娃头吞吞吐吐',
        time:1516777021816,
        com_count:105,
        last_com_user:'酸菜肥肠',
        isfollow:1,
        headimage:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLVqgbS8xic3kTAGWCl5NHP3PvDxffX656sdoX1tSIEewSTGuydWePWMCnuuPlmlYs6wYJNicIkuDmw/0"
      },
      {
        id:1003,
        uid:203,
        camp:0,
        uname:'gggg',
        content:'agawh黑色适合1嘎嘎嘎嘎嘎嘎特',
        time:1516777021816,
        com_count:105,
        last_com_user:'酸菜肥肠',
        isfollow:1,
        headimage:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLVqgbS8xic3kTAGWCl5NHP3PvDxffX656sdoX1tSIEewSTGuydWePWMCnuuPlmlYs6wYJNicIkuDmw/0"
      }
    ];

    _p.setData({
      list: _p.initListData(_list)
    })

    // _p.getlist();
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
    // _p.getlist(1,()=>{
    //   wx.hideNavigationBarLoading(); //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // })
    // _p.getRandom();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.warn("bottom load!!!!!!");
    // _p.getlist();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title:'',
      path:'',
      imageUrl: "../../image/fenxiang1.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  textevent(){
    _p.setData({
      loadHide: !_p.data.loadHide
    })
  },
  getlist:(page,_fail)=>{
    if(_p.pageData.isrun || _p.pageData.isend && !page) return false;
    _p.pageData.isrun = 1;
    app.getData(_p,'/spred/getUserHomePage.dtzn', () => ({
      token: app.user_info.token,
      uid: app.user_info.id,
      start: page?((page-1)*_p.pageData.page_count):((_p.pageData.page-1) * _p.pageData.page_count),
      countNum: _p.pageData.page_count,
      spredclass: 0
    }), (res) => {
      _p.pageData.isrun = 0;
       console.log(res)
      if(res.result == 200){
        if(page){
          _p.pageData.page = page + 1;
        }else{
          _p.pageData.page += 1;
        }
        console.log('listSpred', res.data.listSpred.length)
        if (res.data.listSpred.length < _p.pageData.page_count){
          console.log("已到页尾");
          _p.pageData.isend = 1;
          _p.setData({
            loadHide:true
          });

          if (res.data.listSpred.length <= 0) return false;
        }else{
          _p.pageData.isend = 0;
        }

        for (let i = 0; i<res.data.listSpred.length;i++){

          if (res.data.listSpred[i].scontent.length > 56) {
            res.data.listSpred[i].scontent = res.data.listSpred[i].scontent.substring(0, 56)
            res.data.listSpred[i].scontent = res.data.listSpred[i].scontent + '...'
          }
        }


        let _list = app.initAudioList(res.data.listSpred);
        let m_list = app.mergeJSON((page?[]:_p.data.audioData.list), _list, -1);
        console.log(m_list);
        _p.setData({
          'audioData.list':m_list,
        },()=>{
          if (res.data.listSpred.length > 0 && !_p.sliderInit) {
            _p.sliderInit = 1;
            console.log('audioData.list:',_p.data.audioData.list);
            audioList.updata();//更新进度条长度
          }
        });

      }else{
        console.log("请求出错:",res);
      }
    },()=>{
      _p.pageData.isrun = 0;
      console.log("请求错误");
    })
    if ('function' == typeof _fail) _fail()
  },
  //点赞
  help(e){
    let id = e.currentTarget.dataset.id
    let list = _p.data.audioData.list
    let laud = list[id].islike
    if (app.user_info.id && app.user_info.token) {
      console.log(e)
      app.getData(_p,'/comment/spredLike.dtzn', () => ({
        sid: e.currentTarget.dataset.item.sid,
        token: app.user_info.token,
        uid: app.user_info.id,
        tradetype: '1',
        type: laud,
      }), (res) => {
        console.log(res)
        if (res.result == 200) {
          console.log('list[id]', list)
          if (laud) {
            list[id].like_count--
            list[id].islike = 0
            _p.setData({
              'audioData.list': list
            })
            app.suToast('已取消', 1500)
          } else {
            list[id].like_count++
            list[id].islike = 1
            _p.setData({
              'audioData.list': list
            })
            app.suToast('已点赞', 1500)
          }
        }
      })
    } else {

      _p.openSignup(() => {
        console.log('app.user_info',app.user_info)

        app.getData(_p,'/comment/spredLike.dtzn', () => ({
          sid: e.currentTarget.dataset.item.sid,
          token: app.user_info.token,
          uid: app.user_info.id,
          tradetype: '1',
          type: laud,
        }), (res) => {
          console.log(res)
          if (res.result == 200) {
            console.log('list[id]', list)
            if (laud) {
              list[id].like_count--
              list[id].islike = 0
              _p.setData({
                'audioData.list': list
              })
              app.suToast('已取消', 1500)
            } else {
              list[id].like_count++
              list[id].islike = 1
              _p.setData({
                'audioData.list': list
              })
              app.suToast('已点赞', 1500)
            }
          }
        })

      });

    }
  },
  initListData(_list) {
    let app = getApp();
    let new_list = [];
    if (_list && _list.length > 0) {
        app.each(_list, (_k, _v) => {
            new_list[_k] = {
                id: _v.id,
                camp: _v.camp || 0,
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
  }
})
