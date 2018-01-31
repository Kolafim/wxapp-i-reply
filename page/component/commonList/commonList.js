Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 接收属性
    compData: {
      type: Object,
      value: {},
      observer:function(...e){
        //数据发生改变时执行该函数
        if(e[0]){
          if(e[0].list && e[0].list.length > 0){
            e[0].list = this.initListData(e[0].list);
          }
          this.setData({
            newData: e[0]
          });
        }else{
          console.warn('observer:',e);
        }
      }
    },
    //'i':index , 'd':detail , 'c':comment
    mode:{
      type:String,
      value:'',
      observer:function(...e){
        //数据发生改变时执行该函数
        console.log('mode observer:',e);
      }
    },
    loadHide:{
      type:Boolean,
      value:false,
      // observer:function(...e){
      //   console.log('loadHide observer:',e);
      // }
    }
  },
  data: {
    newData:{},
    page_count:5
  },
  created(){
    //在组件实例进入页面节点树时执行，此方法内不能调用setData
    console.log('com this:',this.data);
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
    itemTap(e){
      // console.log('itemTap:',e.currentTarget.dataset);
      if(this.data.mode != 'd' && 'function' == typeof this.data.newData.itemTap) {
        this.data.newData.itemTap(e.currentTarget.dataset);
      }
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
    }
  }
})
