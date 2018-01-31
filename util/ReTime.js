/**
 * 倒计时
 * new ReTime()
 * .uploadEndDate(endtime) 更新截止时间
 */
export default class ReTime {
  constructor(){
    this.date = {
      default:0,
      isUpdate:1,
      redate:0,
      endTimeLoading:0,
      timeend:-1
    }
    this.uploadDate();
    setInterval(()=>this.uploadDate(),5000);
  }
  /**
   * 更新本地时间
   */
   uploadDate(){
     this.date.default = new Date().getTime();
     this.date.isUpdate = 1;
   }
   /**
    * 更新截止时间
    */
    uploadEndDate(end=0){
      if(end){
        this.date.timeend = end;
      }
    }
  /**
   * 计算时间
   */
   setTime(timer){
     if(!this.date.default) {
       console.log('获取本地时间出错');
       return {mode:0,msg:'获取本地时间出错'};
     }

     if(!this.date.redate || this.date.isUpdate) {
       this.date.redate = this.date.default;
       this.date.isUpdate = 0;
     }

     let diff = this.date.timeend - this.date.redate

     if(diff > 0){
       let t_d = Math.floor(diff / 1000 / 3600 / 24);
       let t_s = 0, t_m = 0,t_h = 0;
       if(t_d < 1){
         t_s = Math.floor(diff / 1000 % 60);
         t_m = Math.floor(diff / 1000 / 60 % 60);
         t_h = Math.floor(diff / 1000 / 3600 % 24);
       }
       this.date.redate += 1000;

       return {mode:1,d:t_d,h:this.formatnum(t_h), m:this.formatnum(t_m), s:this.formatnum(t_s)};
     }else if(this.date.endTimeLoading){
       return {mode:2,msg:'更新时间'}
     } else if (this.date.timeend == -1) {
       return { mode: 2, msg: '每周六22:00开奖' }
     }else if(!this.date.timeend){
       return {mode:2,msg:'获取截止时间出错'}
     }else{
       if(timer) {
         clearInterval(timer);
         timer = 0;
       }
       return {mode:0,msg:'已过期'}
     }
   }
  formatnum(num){
    return num<10?("0"+num):num
  }
  // util.js  
//时间戳转换成日期时间  

  getDateDiff(dateTimeStamp) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();


  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12){
      var dateta = new Date(dateTimeStamp)
      result = "" + parseInt(monthC) + "月前";
    }
      
      // var month = dateta.getMonth() + 1;
      // var date = dateta.getDate();

      // dateta = month + "月" + date + "日";

      // console.log(dateta)
     
    else {
       var dateta = new Date(dateTimeStamp)
       var year = dateta.getFullYear();
       var month = dateta.getMonth() + 1;
       var date = dateta.getDate();
      // var hour = dateta.getHours();
      // var minute = dateta.getMinutes();
      // var second = dateta.getSeconds();

      dateta = year + "年" + month + "月" + date + "日";
      result = dateta;
       //console.log(dateta)
     // result = "" + parseInt(monthC / 12) + "年前";
    }
  }
  else if (weekC >= 1) {
    var dateta = new Date(dateTimeStamp)
    var month = dateta.getMonth() + 1;
    var date = dateta.getDate();

    dateta = month + "月" + date + "日";

    console.log(dateta)
    result = dateta;
  }
  else if (dayC >= 1) {
    var dateta = new Date(dateTimeStamp)
    var month = dateta.getMonth() + 1;
    var date = dateta.getDate();

    dateta = month + "月" + date + "日";
    result = dateta
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }

  return result;
  }
}
