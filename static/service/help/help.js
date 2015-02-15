/**
 * 分享js
 */
define(function (require, exports, module) {
    var tp = require("tmp");


    var refreshList = function (data, listTem, append) {
        //data表示服务端返回的json格式数据，这里需要把data转换成瀑布流块的html格式，然后返回给回到函数
        // 预编译模板
        var tm = tp.compile(listTem.innerHTML);
        // 匹配json内容
        var html = tm(data);
        return html;
    }


    var  html = refreshList(helpData,document.querySelector("#catalogTemplate"));
    document.querySelector("#catalog").innerHTML = html;


});