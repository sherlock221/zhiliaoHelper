/**
 * 扩展原生
 * @param scope
 * @returns {Function}
 */

Function.prototype.delegate = function(scope){
    var that = this;
    return function(){
        that.apply(scope, arguments);
    };
};


Function.prototype.noop = function(){};