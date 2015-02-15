define(function(require,exports,module){

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        }
    };

    require.async(window.isIE == true ? "$_JQ" : "$",function($){

        window.jQuery = window.$ = $;

        var loader = require("loader");

        var temp;

         if( $(document).width() <= 1000){
             temp = "./static/img/all@2x.png";
         }
        else{
             temp = "./static/img/all.png";
         }

    var imgList = [
        temp,
        "./static/img/bottom.jpg",
        "./static/img/all-font.png",
        "./static/img/banner/bg-01.jpg",
        "./static/img/banner/bg-02.jpg",
        "./static/img/banner/bg-03.jpg"
    ];


    if(!window.isIE){
        //图片加载器
        new loader.loadermsk(imgList, "#415f9d",function(){
            init();
        });
    }
    else{
        init();
    }


//
//    var ld = new loader.loader(imgList);
//    ld.loadend(function(i){
//
//    }).complete(function(){
//        alert("完成");
//    });



    //业务加载
    function init(){
        var Slider = require("service/index/opacity");
        new Slider("#bg-list","#bg-timeline");

        //绑定下载按钮
        var  $down = $("#downList");

	var  androidUrl  ="http://imzhiliao.com/zhiliao.apk";
	var iosUrl = "https://itunes.apple.com/cn/app/id948591472?mt=8";
	var  $button = $down.find("button");

        $button.eq(0).attr("url",iosUrl);
        $button.eq(1).attr("url",androidUrl);


//        var  tempImg = ' <img src="'+codeImg+'"  id="code" width="121" height="121"/> <p>扫二维码下载</p>';

        //加载二维码图片
//        $("#code").html(tempImg);



//        //logo 彩蛋
//        var $logo = $("#logo");
//        $logo[0].addEventListener("webkitAnimationEnd", function(){
//            $logo.css({"-webkit-animation" : "none"});
//        }, false);
//
//        setInterval(function(){
//            $logo.css({"-webkit-animation" : " shake 1s  ease 0.3s 1 both"});
//        },1 * 1000 * 10);
//
//        //首次执行
//        $logo.css({"-webkit-animation" : " shake 1s  ease 0.3s 1 both"});


        function IsPC() {
            var system = {
                win : false,
                mac : false,
                xll : false
            };
            //检测平台
            var p = navigator.platform;
            system.win = p.indexOf("Win") == 0;
            system.mac = p.indexOf("Mac") == 0;
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
            //跳转语句
            if (system.win || system.mac || system.xll) { //转向电脑端
                return true; //是电脑
            } else {
                return false; //是手机
            }
        }


        var  flagPc= IsPC();
        var  flagIOS = isMobile.iOS();


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



        var  eventType =  flagPc == true ? "click" : "tap";



        $down.find("button").on(eventType,dowload);

        function dowload(){
            var $this  = $(this);
            var other = isOtherBrow();
            if(!other.status){
                alert(other.message);
            }
            else{

                window.location.href = $this.attr("url");
            }
        }

        if(!flagPc){
            var  h = $("body").height();
            var mg = (h - 0 - 94)/2;

            //height
            $(".bg-01").css({
                "margin-top" :  "-"+mg+"px"
            });


            var $down = $(".downBtn");

            for(var i=0;i<$down.length;i++){
                var  db = $down[i];

                db.addEventListener("touchstart", function(event){
//                alert("ddd");
                    var other = isOtherBrow();
                    if(!other.status){
                        alert(other.message);
                    }
                    else{

                        if(flagIOS){
                            window.location.href = iosUrl;
                        }
                        else{
                            window.location.href = androidUrl;
                        }
                    }




                }, false);

            }


        }
        else{

            $(".downBtn").on("click", function(){
                window.location.href= "#downList";
            }, false);
        }


        //开启
       $("#main").show();

    }


    });

});
