/**
 * 分享js
 */
define(function (require, exports, module) {
    var tp = require("tmp");


    tp.helper('$head', function (head) {
        if (head) {
            return  head;
        }
        else {
            return  "./static/img/head.png";
        }

    });


    var $name = "$";
    if(navigator.appName == "Microsoft Internet Explorer"){
  	  window.isLtIE8 = true;
  	  $name = "$_JQ";
    }
    else{
  	  window.isLtIE8 = false;
  	  $name = "$";
    }
    
    require.async($name,function($){
  	  window.$ = $;
  	  window.jQuery = window.$
  	  
    
    
    var UI = {
        mask: $("#mask"),
        listTem: $("#listTemplate"),
        list: $("#list")
    }



    var refreshList = function (data, listTem, append) {
        //data表示服务端返回的json格式数据，这里需要把data转换成瀑布流块的html格式，然后返回给回到函数
        //console.log(data);
        // 预编译模板
        var tm = tp.compile(listTem.html());
        // 匹配json内容
        var html = tm(data);
        return html;
    }

    var loadData = function (classId) {
        $.ajax({
            url: Server.url.uc + "/school/getSharePageInfoByClassId",
            data: {classId: classId},
            dataType: "json",
            async: false,
            success: function (result) {
                var html = refreshList(result.bizData, UI.listTem);
                UI.list.html(html);
            }
        });

    }


    var isPC = function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }

    var isPc = isPC();


    var trigger = isPc == true ? "click" : "tap";


    var isOtherBrow = function () {
        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.indexOf("qq/") > -1) {
            return {"message": "qq下载请点击右上角在浏览器中打开", "status": false}
        }
        else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return {"message": "微信下载请点击右上角在浏览器中打开", "status": false}
        }
        else {
            return {"status": true};
        }
    }
    
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
        }

    var Event = {
        init: function () {
        		
        	//获得url的值
        	var cid = getQueryString("classId") || 0;
        	if(cid == 0){
        		alert("没有查到此班级信息！");
        	}
        	
            //loadData
            loadData(cid);
            	
            
            var domHeight = $("body").height();




            var  iosUrl = "https://itunes.apple.com/cn/app/id948591472?mt=8";
            var  androidUrl  ="http://imzhiliao.com/zhiliao.apk";
            var  $downList =  $("#dowload_list");

            $downList.find("button").eq(0).attr("url",iosUrl);
            $downList.find("button").eq(1).attr("url",androidUrl);


            $downList.find("button").on(trigger,function(){
                window.location.href =  $(this).attr("url");
            });




            //ui
            UI.alert = $("#alert");
            UI.dowload = $("#dowload");
            UI.copyCode = $("#copyCode");
            UI.addClass = $("#addClass");
            UI.topDom = $("#topDom");


            //css hack
            UI.mask.height(domHeight);

            var zcErro = true;
            	
            
            if(!window.isLtIE8){
//            	 ZeroClipboard.config({
//                     swfPath: "../static/other/parse/ZeroClipboard.swf"
//                 });
//
//                 var client = new ZeroClipboard(UI.copyCode);
//                 //剪切板
//                 client.on("ready", function (readyEvent) {
//                     client.on("aftercopy", function (event) {
//                         alert("成功复制到剪切板上！");
//                     });
//                 });
//
//                 client.on('error', function (event) {
//                     zcErro = true;
//                     // alert( '您的浏览器不支持剪切板 "' + event.name + '": ' + event.message );
//                     ZeroClipboard.destroy();
//                 });
            }


            var isMobile = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i) ? true : false;
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
                }
            };


            UI.mask.on(trigger,function(){
                UI.alert.hide();
                UI.mask.hide();
                UI.topDom.hide();
            });

            UI.dowload.on(trigger, function () {
                var obj = isOtherBrow();
                if (!obj.status) {
                    UI.topDom.show();
                    return false;
                }


                if (isMobile.iOS()) {
                    window.location.href = iosUrl;
                } else {
                    window.location.href = androidUrl;
                }

            });

            UI.copyCode.on(trigger, function (event) {
                if (zcErro) {
                    alert("您的浏览器不支持自动复制,请手动复制左侧班级码.");
                    return;
                }
            });


            UI.addClass.on(trigger, function () {
                toggleLayer(true);
            });


        }
    };


    var toggleLayer = function (isShow) {

        if (isShow) {
            UI.alert.show();
            UI.mask.show();
        }
        else {
            UI.alert.hide();
            UI.mask.hide();
            UI.topDom.hide();
        }

    }


    $(function () {
        Event.init();
    });

    
    });

});