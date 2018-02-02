Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    commData: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (...e) { 
        console.log(e)     
      } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    //commData: String // 简化的定义方式
   },
  data: {
    content: '',
    commData:{},
    animationData: {},   //评论弹出动画
  },
  methods: { 
    customMethod: function () {
      console.log(this);
    },
    bindTextAreaBlur: function(even){    //自动获取输入框的值
      let _p=this
      console.log(even)
      if (even){  
        _p.setData({content: even.detail.value})
      }
    },

    out: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', this.data.content)
    },

    //  hahah
    // comment:function() {
    //   console.log('关闭')
    //   this.setData({
    //     'commData.eject': 'none',
    //     'commData.circle': 'circles'
    //   })
    //  }
   },
  
  
})