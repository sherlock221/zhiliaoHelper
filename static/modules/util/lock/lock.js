/**
 * lock 的工具类
 */
define(function (require, exports, module) {
    var lock = {};
    var  $ = require("$");

    lock.cookie = {
        getCookie: function (key) {
            var reg = new RegExp('(^|\\s+)' + key + '=([^;]*)(;|$)');
            var regResult = document.cookie.match(reg);
            if (regResult) {
                return unescape(regResult[2]);
            } else {
                return '';
            }
        },
        setCookie: function (key, value, expires) {
            var cookieItem = key + '=' + escape(value);
            if (expires) {
                if (typeof(expires) == 'number') {
                    expires = new Date(expires);
                }
                cookieItem += ';expires=' + expires.toGMTString();
            }
            document.cookie = cookieItem;
        }
    };


    lock.lg = {
        get : function(key){
            return localStorage.getItem(key);
        },
        put : function(key,value){
            localStorage.setItem(key,value);
            return this;
        },
        getObj : function(key){
            if(localStorage.getItem(key)){
                return JSON.parse(localStorage.getItem(key));
            }
                return null;
        },
        putObj : function(key,obj){
           localStorage.setItem(key,JSON.stringify(obj));
            return this;
        }
    };

    lock.os = {

        getOS: function () {
            //定义结果变量
            var name = 'Other';
            var version = '';
            //获取userAgent
            var ua = navigator.userAgent;
            //移动平台iOS探测
            var reg = /like Mac OS X|Android|Windows Phone|Symbian/ig;
            var regResult = reg.exec(ua);
            if (!regResult) {
                reg = /Mac OS X|Windows NT|Linux/ig;
                regResult = reg.exec(ua);
            }
            if (!regResult) {
                //返回UNKNOWN
                return name;
            } else {
                //操作系统检测
                switch (regResult[0]) {
                    case 'like Mac OS X':
                        name = 'iOS';
                        reg = /(iPhone|iPod|iPad).*?OS\s*(\d*[\_|\.\d]*)/ig;
                        break;
                    case 'Android':
                        name = 'Android';
                        reg = /(Android)\s*(\d*[\.\d]*)/ig;
                        break;
                    case 'Windows Phone':
                        name = 'Windows Phone';
                        reg = /(Windows Phone)\s*[OS]*\s*(\d*[\.\d]*)/ig;
                        break;
                    case 'Symbian':
                        name = 'Symbian';
                        reg = /(Symbian)\s*[OS]*\/*\s*(\d[\.\d]*)/ig;
                        break;
                    case 'Mac OS X':
                        name = 'OS X';
                        reg = /(Mac OS X)\s*(\d*[\_|\.\d]*)/ig;
                        break;
                    case 'Windows NT':
                        name = 'Windows NT';
                        reg = /(Windows NT)\s*(\d*[\_|\.\d]*)/ig;
                        break;
                    case 'Linux':
                        name = 'Linux';
                        reg = /(Linux)\s*(i*\d*)/ig;
                        break;
                }
                //获取版本号
                regResult = reg.exec(ua);
                if (regResult && regResult.length >= 3) {
                    version = regResult[2].replace(/\_+/ig, '.');
                    reg = /^\d+\.*\d*/ig;
                    regResult = reg.exec(version);
                    if (regResult) {
                        version = regResult[0];
                    }
                }
            }

            //返回操作系统名称+版本号
            return [name, version].join(' ');
        },
        getBrowser: function () {
            //定义结果变量
            var name = 'Other';
            var version = '';
            //获取userAgent
            var ua = navigator.userAgent;
            //移动平台iOS探测
            var reg = /MSIE|Chrome|Firefox|Opera|UCBrowser|UCWEB|Safari/ig;
            var regResult = reg.exec(ua);
            if (!regResult) {
                //返回UNKNOWN
                return name;
            } else {
                //浏览器检测
                switch (regResult[0]) {
                    case 'MSIE':
                        name = 'IE';
                        reg = /MS(IE)[\/|\s]+(\d*[\.\d]*)/ig;
                        break;
                    case 'Chrome':
                        name = 'Chrome';
                        reg = /(Chrome)[\/|\s]+(\d*[\.\d]*)/ig;
                        break;
                    case 'Firefox':
                        name = 'Firefox';
                        reg = /(Firefox)[\/|\s]+(\d*[\.\d]*)/ig;
                        break;
                    case 'Safari':
                        name = 'Safari';
                        reg = /(Safari)[\/|\s]*(\d*[\.\d]*)/ig;
                        break;
                    case 'Opera':
                        name = 'Opera';
                        reg = /(Opera)[\/|\s]+(\d*[\.\d]*)/ig;
                        break;
                    case 'UCBrowser':
                        name = 'UC';
                        reg = /(UCBrowser)[\/|\s]+(\d*[\.\d]*)/ig;
                        break;
                    case 'UCWEB':
                        name = 'UC';
                        reg = /(UCWEB)[\/|\s]*(\d*[\.\d]*)/ig;
                        break;
                }
                //获取版本号
                regResult = reg.exec(ua);
                if (regResult && regResult.length >= 3) {
                    version = regResult[2].replace(/\_+/ig, '.');
                    reg = /^\d+\.*\d*/ig;
                    regResult = reg.exec(version);
                    if (regResult) {
                        version = regResult[0];
                    }
                }
            }

            //返回操作系统名称+版本号
            return [name, version].join(' ');
        }

    }

    lock.WebPage = {

        /** 获得当前屏幕宽高 **/
        getOffset: function () {
            return { width: document.body.offsetWidth, height: document.body.offsetHeight }
        },

        getBF: function () {
            var ua = navigator.userAgent.toLowerCase();
            var scene = (ua.indexOf('micromessenger')) > -1 ? 'weixin' : ((/qq\/([\d\.]+)*/).test(ua) ? 'qq' : 'web');
            return scene;
        },

        /**
         * 返回上一页
         */
        back: function () {
            window.history.go(-1);
        },

        /**
         * 分解DOM名称，已spe分割
         * @param doms  分解dom集合
         * @param spe   分隔符
         * @returns {string}
         */
        sliceName: function (doms, spe) {
            var array = new Array();
            for (var i = 0; i < doms.length; i++) {
                var $obj = $(doms[i]);
                var name = $obj.attr("name");
                array.push(name);
            }

            if (JString.isEmpty(spe)) spe = ",";

            return array.join(spe)
        },

        /**
         * checkbox全选多选
         * @param doms
         * @param selected
         */
        toggleCheckBox: function (cklists, selected) {
            var cklistTemp;
            if (!selected) {
                cklistTemp = cklists.filter(":checked");
            }
            else {
                cklistTemp = cklists.not("input:checked");
            }

            for (var i = 0; i < cklistTemp.length; i++) {
                var ck = cklistTemp[i];
                $(ck).click();
            }
        },


        /**
         * 渲染模板
         *
         * @param $dom
         * @param data
         * @param $template
         */
        refreshTemplate: function ($dom, data, $template, append) {
            // 原生方法
            var source = $template.html();
            // 预编译模板
            var tm = tp.compile(source);
            // 匹配json内容
            var html = tm(data);
            // // 输入模板
            if (append)
                $dom.append(html);

            else
                $dom.html(html);

        },


        /**
         * @description 等待几秒后 刷新页面
         * @param time
         *            等待毫秒数
         */
        reloadPage: function (time) {
            var fn = function () {
                window.location = window.location;
            };
            if (!time) {
                time = 0;
            }
            setTimeout(fn, time)
        },

        /**
         * @description 等待几秒 跳转页面
         * @param url
         *            跳转路径
         * @param time
         *            等待毫秒数
         */
        jumpPage: function (url, time) {
            var fn = function () {
                window.location.href = url;
            };
            if (!time) {
                time = 0;
            }
            setTimeout(fn, time)
        },

        /**
         * 检测横屏 竖屏
         */
        orientationchange: function () {
            if (window.orientation == 0 || window.orientation == 180) {
                //竖
                return  "v";
            } else {
                //横
                return  "h";
            }
        }
    };


    lock.JString = {

        /**
         * @description 判断值是否为undefined
         * @param $dom  dom对象 或者 任意数值
         * @returns {boolean} true : undefined , false  : 非undefined
         */
        isUndefined: function ($dom) {
            if (!$dom) {
                return true
            }
            return false
        },
        /**
         * @description 非空判断(判断以下:undefend,null,"")
         * @param str   字符串
         * @returns {boolean} true : 空 , false  : 非空
         */
        isEmpty: function (str) {
            if (undefined == str || null == str || "" == str) {
                return true;
            }
            return false;
        },

        /**
         * @description 将字符串解析成html标签
         * @param str   带解析的字符串
         * @returns {string}  解析完成后字符串
         */
        parseHtml: function (str) {
            String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
                if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
                } else {
                    return this.replace(reallyDo, replaceWith);
                }
            }
            //str含有HTML标签的文本
            str = str.replaceAll("<", "&lt;");
            str = str.replaceAll(">", "&gt;");
            str = str.replaceAll(" ", "&nbsp;");
            str = str.replaceAll("\n", "<br>");
            str = str.replaceAll("&", "&amp;");
            return str.toString();
        },

        /**
         * @description 替换后缀名(a.mp3 -->b.mp4)
         * @param   str 原始字符
         * @param   identifier 原始标志
         * @param   target  替换标志
         * @return  {string} 替换后字符串
         */
        replaceLastChar: function (str, identifier, target) {
            var last = str.lastIndexOf(identifier);
            return (str.substring(0, last + 1) + target);
        },

        /**
         * @description  去掉字符串中所有空格 is_globa = 'g'
         * @param   str 原始字符
         * @param   identifier 原始标志
         * @param   target  替换标志
         * @result  {{去掉之后的字符串}}
         */
        trimAll: function (str, is_global) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            if (is_global.toLowerCase() == "g")
                result = result.replace(/\s/g, "");
            return result;
        },
        /**
         * @description  去掉左右两边的空格
         * @param   str 原始字符
         * @param   type  l:左边  r:右边  lr : 左右两边
         * @result  {{去掉之后的字符串}}
         */
        trim: function (str, type) {
            var regs = /\s+/g;
            if (type == 'l') {
                regs = /^\s*/;
            }
            else if (type == 'r') {
                regs = /(\s*$)/g;
            }
            else if (type == 'lr') {
                regs = /^\s+|\s+$/g;
            }
            return  str.replace(regs, "");
        },

        /**
         * @description 获得主机地址|项目名|目录地址
         * @returns {{localhost: 主机地址, project: 项目名称 pathName : 目录地址}}
         */
        getUrl: function () {
            var curWwwPath = window.document.location.href;
            var pathName = window.document.location.pathname;          //获取主机地址之后的目录，如： cis/website/meun.htm
            var pos = curWwwPath.indexOf(pathName);                    //获取主机地址，如： http://localhost:8080
            var localhostPaht = curWwwPath.substring(0, pos);          //获取带"/"的项目名，如：/cis
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            var rootPath = localhostPaht + projectName;
            return {
                localhost: pos,
                project: projectName,
                pathName: pathName
            }
        },
        getParamByName: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            {
                return null
            }
            ;
        },


        /**
         * 检查是否是按键值
         * @param key  按键值
         * @returns {boolean} true : 是 ,false :不是
         */
        vdIsKey: function (key) {
            var zz = /^\d$/;
            return zz.test(key);
        },

        /**
         * 判断是否为数字
         * @param num    字符
         * @returns {boolean}  true : 是 , false :不是
         */
        vdIsNum: function (num) {
            var zz = /^\d+$/;
            return zz.test(num);
        },
        /**
         * 判断是否为qq号码
         * @param str qq号
         * @returns {boolean}    true:是 ,false :不是
         */
        isQQ: function (str) {
            if (/^\d{5,14}$/.test(str)) {
                return true;
            }
            return false;
        },

        /**
         * 判断是否为手机
         * @param str 手机号
         * @returns {boolean}    true:是 ,false :不是
         */
        isPhone: function (str) {
            var reg = /^0?1[7358]\d{9}$/;
            return reg.test(str);
        },
        /**
         * 判断是否为邮箱
         * @param str 邮箱
         * @returns {boolean}    true:是 ,false :不是
         */
        isEmail: function (str) {
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(str);
        },
        /**
         * 判断是否正整数
         * @param str 数值
         * @returns {boolean}    true:是 ,false :不是
         */
        isPlusNumber: function (str) {
            var reg = /^[0-9]*[1-9][0-9]*$/;
            return reg.test(str);

        },
        /**
         * 判断是否正数 不包括0
         * @param str 数值
         * @returns {boolean}    true:是 ,false :不是
         */
        isNumric: function (str) {
            var reg = /^(([0-9]+[\.]?[0-9]+)|[1-9])$/;
            return reg.test(str);
        }

    };


    /**
     * transition 动画结束
     * @returns {*}
     */
    var animationEnd = function (dom, callBack) {
        var el = document.createElement('div');
        var transEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'MozAnimation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'animation': 'animationend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                dom.addEventListener(transEndEventNames[name], callBack);
                break;
            }
        }
    };

    /**
     * transition 动画结束
     * @returns {*}
     */
    var transitionEnd = function (dom, callBack) {
        var el = document.createElement('div');
        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'transition': 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                dom.addEventListener(transEndEventNames[name], callBack);
                break;
            }
        }
        return false;
    };


    /**
     * 特效动画
     * @type {{numberScroll: numberScroll}}
     */
    lock.an = {
        /**
         * 数字滚动
         * @param $dom
         * @returns {number}
         */
        numberScroll: function ($dom) {
            var a_num = $dom.attr("data-num") * 1;
            var a = 1;
            var crear_a = ""
            var change_a = function () {
                if (a < a_num) {
                    a += 4;
                    $dom.text(a);
                }
                else {
                    $dom.text(a_num);
                    clearInterval(crear_a);
                }

            }
            crear_a = setInterval(change_a, (3000 / a_num));
            return crear_a;
        },


        /**
         * js动画引擎
         * @returns {Function}
         */
        reAF: function () {
            var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    return setTimeout(callback, 1000 / 60);
                };

            return requestAnimationFrame;
        },

        clAF: function () {
            var cancelAnimationFrame = window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                function (callback) {
                    return clearTimeout(callback, 1000 / 60);
                };

            return cancelAnimationFrame;
        },


        animateEnd: animationEnd,
        transitionEnd: transitionEnd

    }


    lock.ajax = {

        /**
         * 异步提交表单数据(post)
         * @param {Object} url 请求地址
         * @param {Object} form 表单form
         * @param {Object} fn_succes 成功回调函数
         * @param {Object} fn_error  失败回调函数
         * @param {Object} dataType  返回类型(默认json)
         */
        postForm: function (url, form, fn_succes, fn_error, dataType) {
            Lock.AjaxUtil.ajaxForm("post", url, form, fn_succes, fn_error, dataType == undefined ? "json" : dataType);
        },

        /**
         * 异步提交表单数据(get)
         * @param {Object} url 请求地址
         * @param {Object} form 表单form
         * @param {Object} fn_succes 成功回调函数
         * @param {Object} fn_error 失败回调函数
         * @param {Object} dataType 返回类型(默认json)
         */
        getForm: function (url, form, fn_succes, fn_error, dataType) {
            Lock.AjaxUtil.ajaxForm("get", url, form, fn_succes, fn_error, dataType == undefined ? "json" : dataType);
        },

        ajaxForm: function (type, url, form, fn_succes, fn_error, dataType) {
            var seriz;
            if (form instanceof Array)
                seriz = form.serialize(form);
            else
                seriz = form.serialize(form);
            $.ajax({
                type: type,
                url: url,
                data: seriz,
                success: fn_succes,
                error: fn_error,
                dataType: dataType
            });
        },

        /**
         * 异步提交请求(get) 返回json
         * @param {Object} url
         * @param {Object} data
         * @param {Object} fn
         */
        get: function (url, data, fn_succes, fn_error) {
            $.ajax({
                type: "get",
                url: url,
                data: data,
                success: fn_succes,
                error: fn_error,
                dataType: "json"
            });
        },

        /**
         * 异步提交请求(post) 返回json
         * @param {Object} url 请求地址
         * @param {Object} data 请求参数
         * @param {Object} fn   成功回调函数
         */
        post: function (url, data, fn_succes, fn_error) {
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: fn_succes,
                error: fn_error,
                dataType: "json"
            });
        },

        /**
         * 载入并执行js
         * @param {Object} url  js地址
         * @param {Object} fn   成功载入回调函数
         */
        getScript: function (url, fn) {
            $.getScript(url, fn);
        },

        /**
         * 载入json数据
         * @param {Object} jsonUrl json/js地址
         * @param {Object} fn  成功载入回调函数
         */
        getJSON: function (jsonUrl, data, fn) {
            $.getJSON(jsonUrl, data, fn);
        },

        /**
         * 载入html文档
         * @param {Object} htmlUrl 文档url
         * @param {Object} data    数据
         * @param {Object} fn      回调函数
         */
        loadHtml: function (htmlUrl, data, fn) {
            $.load(htmlUrl, data, fn);
        }
    };


//    /**
//     * ajax全局事件
//     * 实现 ajax_global 的方法
//     * 启动全局事件 AJAX_GLOBAL.global();
//     * @class AJAX_GLOBAL
//     */
//    lock.AJAX_GLOBAL = {
//        USER_AJAX_GLOBAL: true,
//        global: function () {
//            $(document).ajaxStart(AJAX_GLOBAL.onStart)
//                .ajaxComplete(AJAX_GLOBAL.onComplete)
//                .ajaxSuccess(AJAX_GLOBAL.onSuccess);
//        },
//        onStart: function () {
//            Load.show();
//        },
//        onComplete: function (evt, data, setting) {
//            Load.hide();
//        },
//        onSuccess: function (evt, data, setting) {
//
//        }
//    };


//服务器异常
    lock.AjaxError = function (error) {
    };


    module.exports = lock;
})
;