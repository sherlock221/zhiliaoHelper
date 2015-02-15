define(function(require,exports,module){


    //默认配置
    var  defautl  = {
        auto : false
    }



    var  Slider = function(selectorBg,selectorTimeline,options){

        options  = $.extend({},defautl,options);

        var $manList = $(selectorBg);
        var $bgline = $(selectorTimeline);

        var maxLenght = 0;
        var maxLenghtTemp = 0;


        //记录当前的图片轮播序号
        var currentIndex = 1;

        var autoInterval;

        //初始化
        (function init (){

            //获得屏幕宽度
            var width = $(document).width();

            var $temps = $manList.find(".bg-main");
            var $timeLine =$bgline.find("ul>li>a");

            maxLenght = $temps.length;
            maxLenghtTemp = $temps.length;

            for(var i=0; i<$temps.length;i++){
                var $bg = $($temps[i]);
                var url = $bg.attr("url");
                $bg.attr("data-id",maxLenghtTemp--);
                $bg.css({"backgroundImage": "url("+url+")"});

                //时间点添加标识

                var $tline = $timeLine.eq(i);
                $tline.attr("data-id",i+1);
                if(i == 0){
                    $tline.addClass("active");
                    currentIndex = i+1;
                }
            }
        }());
        //切换
        function toggle(index){
            //优化性能
            if(index == currentIndex){
                console.log("ddd");
                return;
            }


            var _next =  $manList.find("[data-id='"+index+"']");
            var _current = $manList.find("[data-id='"+currentIndex+"']");

            var cssCur = {
                "opacity"  : "0",
                "visibility":"hidden"
            };

            var cssStrNext = {
                "opacity"  : "1",
                "visibility":"visible"
            };
            _current.css(cssCur);
            _next.css(cssStrNext);

            //点播图切换
            $bgline.find("a").removeClass("active");
            $bgline.find("[data-id='"+index+"']").addClass("active");

            currentIndex = index;
        }


        //自动轮播
        function auto(start){
            start = start || 1;
            start++;

            autoInterval = setInterval(function(){
                toggle(start);
                if(start >= maxLenght){
                    start = 0;
                }
                start++;
            },3000);

        }



        $(function(){

            //绑定单击触发
            $bgline.on("click","a",function(){
                var $this = $(this);
                var dataId = $this.attr("data-id");
                toggle(dataId);
                console.log(dataId);

                //auto下处理
                if(autoInterval){
                    clearInterval(autoInterval);
                }

            });



            if(!window.isIE){
                    //触摸屏滑动触发
                    var hammertime = new Hammer($manList[0]);
                    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL,threshold : 5});
                    hammertime.on("swipe",function(evt){
                       // alert("swipe");
                        console.log(evt.deltaX);
                        if(evt.deltaX < 0){
                            var temIndex = currentIndex;
                            currentIndex = temIndex;
                            page(++temIndex);
                        }
                        else{
                            var temIndex = currentIndex;
                            currentIndex = temIndex;
                            page(--temIndex);
                        }



                    });
            }

            //自动滑动
//            if(options.auto){
                auto();
//            }

        });

        function page(index){
            //auto下处理
            if(autoInterval){
                clearInterval(autoInterval);
            }
            if(index  > maxLenght){
                console.log("最大了!...");
                index  = maxLenght;

            }
            else if(index <= 0){
                console.log("xiaole1!...");
                index = 1;
            }
            toggle(index);
        }

    }

    module.exports = Slider;

});