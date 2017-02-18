/**
 * 通用方法类
 */
Ext.define('js.lib.Common', {
    alias: ['PMS.Common'],  //静态别名测试不可行
    alternateClassName: [ 'MD.Common'], //静态备用名测试不可行
    statics: {
        /**
         * 对象相加，返回相加后的对象
         * @param {Objetc} obj1 主要的对象
         * @param {Objetc} obj2 附加的对象
         * @return {Object} 相加后的对象
         */
        MixObject: function(obj1, obj2) {
            if (typeof obj2 !== 'object')
                obj2 = {};
            if (typeof obj1 === 'object' && typeof obj2 === 'object') {
                for (var p in obj2) {
                    obj1[p] = obj2[p];
                }
            };
            //  obj2 = null;
            delete obj2;
            return obj1;
        }
    }
    //constructor: function() { ... }//构造函数
});