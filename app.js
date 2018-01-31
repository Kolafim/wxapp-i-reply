var class2type = {}; //类型集合辅助对象
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

let aaa = 0;

App({

    user_info: {
        id: '',
        phone: '',
        token: "",
    },
    signup_timer: 0,
    isgohome: 0,
    globalData: {
        aa: 1,
        opt: "",
        failcount: 3,
        systemInfo:{},
        //host:'https://www.aifenqian.cn/note-web-boss',
        host: 'http://120.78.57.191/note-web-boss',
        //host:'http://192.168.8.66',
        //imghost:'http://dtznpic.oss-cn-shenzhen.aliyuncs.com',
        //imghost:'http://120.78.57.191',
        //imghost:'http://120.78.57.191',
        //imghost: 'http://139.159.242.210',
        //cosUrl: 'https://486600360.dtznaiqc.cn/weapp/upload', //正式上传腾讯云链接
        cosUrl: 'https://npeb6omq.qcloud.la/weapp/upload', //测试上传腾讯云链接
        v_userInfo: {},
        user_id: 67,
        is_recoding_end: 0
    },
    helpUserData: {
        phone: '',
        tempPhone: ''
    },
    getStorageEndList: [],
    onLaunch: function (options) {

        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                that.globalData.systemInfo = res
            }
        });

        wx.showShareMenu({
            withShareTicket: true
        });
        this.globalData.opt = options;
        console.log("Path: " + options.scene);
        this.getUserInfo(this.getStorageEnd);

        //console.log('App Launch');
        //this.login();
        // 获取用户信息
        // wx.getSetting({

        //   success: res => {
        //    // console.log(res)
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           console.log(res)
        //           this.globalData.v_userInfo = res.userInfo


        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }else{
        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           //console.log(res)
        //           this.globalData.v_userInfo = res.userInfo
        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
    },
    onShow: function () {

        console.log('App Show');
    },
    onHide: function () {
        console.log('App Hide')
    },
    getStorageEnd: function () {
        console.log("get storage end !");
        console.log(this.getStorageEndList);
        for (let i = 0; i < this.getStorageEndList.length; i++) {
            if ('function' == typeof this.getStorageEndList[i]) this.getStorageEndList[i].call();
        }
    },
    getData: function (_p, url, data, callback, _fail, mode = 1) {
        let _app = this;
        let _data;
        if ("function" == typeof data) _data = data.call();
        else _data = data;

        let __app = this;
        if (!_p) {
            console.log("app.getData 缺少page对象");
            return;
        }
        console.log('app.js -> get_data_run:', _p.get_data_run);
        if (_p.get_data_run == url) return false;
        _p.get_data_run = url;
        wx.request({
            url: this.globalData.host + url,
            data: _data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                _p.get_data_run = 0;
                _p.getFailCount = 0;
                if (res.statusCode == 200) {
                    console.log(res.data);
                    if (res.data.result == 403) {
                        //login
                        console.log("login!!!!!!!!!!!!!!!!!!!!!!!!!");
                        try {
                            _p.openSignup((new_res) => {
                                console.log('login sucess callback!!!!!!!!!!!!!!');
                                console.log(callback);
                                console.log(new_res);
                                console.log(_app.user_info);
                                console.log(url, _data, callback);
                                if (mode == 1) {
                                    console.log("re getData url:", url);
                                    _app.getData(_p, url, data, callback, _fail);
                                } else {
                                    if ('function' == typeof callback) callback.call(_p, res.data);
                                }
                                //if('function'== typeof callback) callback.call(_p,new_res);
                            });
                        } catch (e) {
                            let title = '数据请求失败'
                            wx.showToast({
                                title: '网络请求失败',
                                image: '../../image/cha.png',
                                duration: 2600,

                            })
                            console.log('数据请求失败')
                            //wx.hideLoading()
                        }


                    } else {
                        if ('function' == typeof callback) callback.call(_p, res.data);
                    }
                } else {
                    console.log('请求错误');
                    if ('function' == typeof _fail) _fail.call(_p, res.data);
                }
            },
            fail: function (e) {
                _p.get_data_run = 0;
                // console.log(e);
                if (_p.getFailCount < 3) {
                    console.log('请求超时，重新加载' + _p.getFailCount);
                    _p.getFailCount = _p.getFailCount + 1;
                    _app.getData(_p, url, data, callback, _fail);
                } else {
                    wx.showToast({
                        title: '网络错误',
                        image: '../../image/cha.png',
                        duration: 2600
                    })
                }
            }
        })
    },
    setToken: function (_token) {
        if (_token) {
            this.user_info.token = _token;
            wx.setStorage({
                key: 'user_info',
                data: this.user_info
            });
        } else {
            console.log("app.setToken 没有获取到token参数");
        }
        return this;
    },
    setUserId: function (_uid) {
        if (_uid) {
            this.user_info.id = _uid;
            wx.setStorage({
                key: 'user_info',
                data: this.user_info
            });
        } else {
            console.log("app.setUserId 没有获取到uid参数");
        }
        return this;
    },
    setUserPhone: function (_phone) {
        if (_phone) {
            this.user_info.phone = _phone;
            wx.setStorage({
                key: 'user_info',
                data: this.user_info
            });
        } else {
            console.log("app.setUserPhone 没有获取到phone参数");
        }
        return this;
    },
    setUserInfo: function (_uid, _phone, _token, _headimg) {
        console.log("app.js headimg", _headimg);
        if (_uid && _phone && _token) {
            let _u_d = {
                id: _uid,
                phone: _phone,
                token: _token,
                headimg: _headimg
            };
            this.user_info = _u_d;
            wx.setStorage({
                key: 'user_info',
                data: _u_d
            });
        } else {
            console.log("app.setUserInfo 没有获取到uid参数");
        }
    },
    setHelpUserPhone: function (_phone) {
        if (_phone) {
            wx.setStorage({
                key: 'help_user_phone',
                data: _phone
            });
        } else {
            console.log("app.setHelpUserPhone 没有获取到phone参数");
        }
    },
    getUserInfo: function (success, fail) {
        let __app = this;
        // __app.user_info = wx.getStorageSync('user_info');
        wx.getStorage({
            key: 'user_info',
            success: function (res) {
                __app.user_info = res.data;
                if ('function' == typeof success) success.call();
            }, fail: function () {
                if ('function' == typeof fail) fail.call();
            }
        });
        wx.getStorage({
            key: 'help_user_phone',
            success: function (res) {
                __app.helpUserData.tempPhone = res.data;
            }, fail: function () {
                if ('function' == typeof fail) fail.call();
            }
        });
        return this;
    },
    type: function (obj) {
        if (obj == null) {
            return obj + "";
        }
        if (!class2type) {
            this.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
                class2type["[object " + name + "]"] = name.toLowerCase();
            });
        }
        //'如果是object或者function，先查询集合class2type,如果没有查询到就返回object。
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    },
    isArraylike: function (obj) {
        var length = obj.length,
            type = this.type(obj);
        if (type == 'function' || (obj != null && obj == obj.window)) {
            //function和window都有length属性
            return false;
        }
        if (obj.nodeType == 1 && length) {
            return true;
        }

        return type === 'array' || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
        // typeof length === 'number' && length > 0 && (length - 1) in obj就是针对类数组对象的
        /*类数组对象举例
          *var obj = {'0' : 0,'1' : 1, '2' : 2,'length' : 3}
          */
    },
    each: function (obj, callback) {
        var value,
            _t = this,
            i = 0,
            length = obj.length,
            isArray = _t.isArraylike(obj);

        if (isArray) {    // 处理数组
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        } else {    // 处理对象
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]); // value 为callback的返回值

                if (value === false) {    // 注意这里，当value===false的时候，直接跳出循环了
                    break;
                }
            }
        }
        return obj;
    },
    /**
     * mod = 2 ID倒序
     */
    mergeJSON: function (obj_1, obj_2, mod, new_for) {
        //mod : 1对比成员的id
        var _t = this;
        var _temp_obj = {};
        mod = mod || 0;
        if (obj_1 || obj_2) {
            _t.each(obj_1, function (_k, _v) {
                let _id = _v.id || _v.sid;
                _temp_obj[_id] = _k;
            });
            _t.each(obj_2, function (_k, _v) {
                let _id = _v.id || _v.sid;
                if (mod >= 1) {
                    if ('function' == typeof new_for) {
                        var __v = new_for(_v);
                        if (__v) _v = __v;
                    }
                }
                if ('undefined' != typeof _temp_obj[_id]) {
                    console.log(obj_1[_temp_obj[_id]].id, _v.id);
                    obj_1[_temp_obj[_id]] = obj_2[_k];
                } else {
                    // if (mod == 2) {
                    //   obj_1.unshift(_v);
                    // } else {
                    //   obj_1.push(_v);
                    // }
                    obj_1.push(_v);
                }
            });
            if (mod != -1) {
                obj_1.sort((a, b) => {
                    let __id = [(a.id || a.sid), (b.id || b.sid)];
                    return (mod == 2 ? (__id[1] - __id[0]) : (__id[0] - __id[1]));
                });
            }
            return obj_1;
        } else {
            return false;
        }
    },
    setListObj: function (arr, _key) {
        var new_arr = [];
        wx.getStorage({
            key: _key,
            success: function (res) {
                new_arr = JSON.parse(res.data);
                //console.log("get storage");
                //console.log(new_arr);
            },
            complete: function () {
                for (var _i = 0; _i < arr.length; _i++) {
                    new_arr[arr[_i].id] = arr[_i];
                }
                wx.setStorage({
                    key: _key,
                    data: JSON.stringify(new_arr)
                });
            }
        });
    },
    setArrObj: function (arr, _key, mod) {
        mod = mod || 0;
        this.each(arr, function (_k, _v) {
            if (arr[_k].id) {
                wx.setStorage({
                    key: _key + (mod ? ("_" + arr[_k].t_type + "_") : "_") + arr[_k].id,
                    data: JSON.stringify(arr[_k])
                });
            }
        });
    },
    login: function (callback) {
        var app = this;
        wx.getUserInfo({
            success: function (user_res) {
                app.user_info = user_res.userInfo;
                wx.login({
                    success: function (res) {
                        console.log(res);
                        if (res.code) {
                            console.log('发起网络请求');
                            wx.request({
                                method: 'POST',
                                url: app.globalData.host + '/userapi/auth/weChatAppLogin',
                                data: {
                                    ajax: 1,
                                    code: res.code,
                                    user_info: JSON.stringify(user_res.userInfo)
                                },
                                success: function (r_res) {
                                    //console.log(r_res);
                                    if (r_res.data.code == 1 && r_res.data.data) {
                                        app.login_token = r_res.data.data.login_token;
                                        app.user_info.nickname = r_res.data.data.nickname;
                                        app.user_info.id = r_res.data.data.user_id;
                                        app.user_info.avatar = app.globalData.host + r_res.data.data.avatar;
                                        if ("function" == typeof callback) callback({ code: 1, msg: '登录成功' });
                                    } else {
                                        if ("function" == typeof callback) callback({ code: 0, msg: '请求登录出错' });
                                    }
                                },
                                fail: function () {
                                    console.log("请求登录失败");
                                    if ("function" == typeof callback) callback({ code: 0, msg: '请求登录失败' });
                                }
                            })
                        } else {
                            console.log('获取用户登录态失败！' + res.errMsg)
                            if ("function" == typeof callback) callback({ code: 0, msg: ('获取用户登录态失败！' + res.errMsg) });
                        }
                    },
                    fail: function () {
                        if ("function" == typeof callback) callback(false);
                    }
                });
            },
            fail: function () {
                console.log('wx:获取用户信息失败');
                if ("function" == typeof callback) callback({ code: 0, msg: 'wx:获取用户信息失败' });
            }
        });
    },
    check_user: function (callback) {
        var app = this;
        wx.checkSession({
            success: function () {
                console.log('session 未过期，并且在本生命周期一直有效');
                if ("function" == typeof callback) callback(true);
            },
            fail: function () {
                console.log('登录态过期');
                app.login(callback);
            }
        });
    },
    /*
     * mod: 0 - 4 对应 按照 分钟 - 月 为最大单位语意
     */
    getDateDiff: function (dateTimeStamp, mod = 4) {
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let halfamonth = day * 15;
        let month = day * 30;
        let year = month * 12;
        let now = new Date().getTime();
        if (!(dateTimeStamp - 0)) return false;
        let diffValue = now - dateTimeStamp;
        if (diffValue < 0) { return false; }

        let default_format = 'M月d日';
        if (diffValue / year >= 1) default_format = 'yyyy年M月d日';

        if (mod >= 4) {
            let monthC = parseInt(diffValue / month);
            if (monthC >= 2) {
                return new Date(dateTimeStamp).Format('M月d日');
            } else if (monthC > 1) {
                return monthC + "个月前";
            }
        }
        if (mod >= 3) {
            let weekC = parseInt(diffValue / (7 * day));
            if (mod == 3 && weekC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if (weekC >= 1) return weekC + "周前";
        }
        if (mod >= 2) {
            let dayC = parseInt(diffValue / day);
            if (mod == 2 && dayC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if (dayC >= 1) return dayC + "天前";
        }
        if (mod >= 1) {
            let hourC = parseInt(diffValue / hour);
            if (mod == 2 && hourC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if (hourC >= 1) return hourC + "小时前";
        }
        if (mod >= 0) {
            let minC = parseInt(diffValue / minute);
            if (mod == 2 && minC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if (minC >= 1) {
                return minC + "分钟前";
            } else
                return "刚刚";
        }
        return false;
    },
    phoneCall: function (e) {
        //console.log(e.currentTarget.dataset.tel);
        try {
            if (e.currentTarget.dataset.tel) {
                wx.makePhoneCall({
                    phoneNumber: e.currentTarget.dataset.tel,
                    success: function () {
                        console.log("拨打电话成功！")
                    },
                    fail: function () {
                        console.log("拨打电话失败！")
                    }
                })
            }
        } catch (e) { }
    },
    failToast: function (title) {
        wx.showToast({
            title: title,
            image: '../../image/cha.png',
            duration: 2000
        })
    },
    successToast: function (title) {
        wx.showToast({
            title: title,
            icon: "success",
            duration: 2000
        })
    },
    suToast: function (title, time) {
        wx.showToast({
            title: title,
            icon: 'success',
            duration: time
        })
    },
    min_time(time) {
        if ('string' == typeof time) {
            let _arr = time.split(":");
            if (_arr.length > 1) {
                time = (_arr[0] - 0) * 60 + (_arr[1] - 0);
            } else {
                time = _arr - 0;
            }
        } else {
            time = time - 0;
        }

        // console.log(time);
        if (time >= 0) {
            let _s = Math.floor(time);
            let t_s = Math.floor(_s % 60);
            let t_m = Math.floor(_s / 60 % 60);
            return [t_m < 10 ? ("0" + t_m) : t_m, t_s < 10 ? ("0" + t_s) : t_s, time];
        } else {
            return false;
        }
    },
    //头像跳转主页
    jump_home(e, even, to, _fail) {
        console.log(e)
        let app = this;
        if (even) {
            if (!to) {
                wx.navigateTo({
                    url: '../individual/individual?to_uid=' + e.currentTarget.dataset.uid,
                })
            } else {
                wx.redirectTo({
                    url: '../individual/individual?to_uid=' + e.currentTarget.dataset.uid,
                })
            }

        } else {
            if ('function' == typeof _fail) _fail()
        }

    },

})
