/**
 * 产品表数据维护
 * 获取产品列表逻辑处理
 */
var db = require('../../conn').connection;

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'product_code AS productCode, ' +
                    'product_name AS productName, ' +
                    'product_caption AS productCaption ' +
                'FROM ' +
                    'product ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //条件查询
    conditionQuery = function (req, res) {
        var productCode = req.body.productCode,
            productName = req.body.productName,
            sql =
                'SELECT ' +
                    'product_code AS productCode, ' +
                    'product_name AS productName, ' +
                    'product_caption AS productCaption ' +
                'FROM ' +
                    'product ' +
                'WHERE ' +
                    'product_code LIKE \'%' + productCode + '%\' ' +
                    'AND product_name LIKE \'%' + productName + '%\' ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //据主键查询数据，用于获取表单值
    queryByPK = function (req, res) {
        var productCode = req.body.productCode,
            sql =
                'SELECT ' +
                    'product_code AS productCode, ' +
                    'product_name AS productName, ' +
                    'product_caption AS productCaption ' +
                'FROM ' +
                    'product ' +
                'WHERE ' +
                    'product_code = \'' + productCode + '\' ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.formValue = data.records[0];
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //根据订单编码查询出订单明细项中的产品对象数组
    queryArrayByOrderCode = function (req, res) {
        var orderCode = req.body.orderCode,
            sql =
                'SELECT ' +
                    'product.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'product.product_caption AS productCaption, ' +
                    'order_item.order_code AS orderCode ' +
                'FROM ' +
                    'product ' +
                    'INNER JOIN order_item ' +
                        'ON ' +
                            'product.product_code = order_item.product_code ' +
                'WHERE ' +
                    'order_item.order_code = \'' + orderCode + '\' ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //查询产品对象数据给Combo控件提供数据
    queryForCombo = function (req, res) {
        var sql =
                'SELECT ' +
                    'product_code AS productCode, ' +
                    'product_name AS productName, ' +
                    'product_code & \' | \' & product_name AS productCombo ' +
                'FROM ' +
                    'product ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //根据订单编码查询出订单明细项中的产品对象数组给Combo控件提供数据
    queryArrayForComboByOrderCode = function (req, res) {
        var orderCode = req.body.orderCode,
            sql =
                'SELECT ' +
                    'product.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'product.product_code & \' | \' & product.product_name AS productCombo, ' +
                    'order_item.order_code AS orderCode ' +
                'FROM ' +
                    'product ' +
                    'INNER JOIN order_item ' +
                        'ON ' +
                            'product.product_code = order_item.product_code ' +
                'WHERE ' +
                    'order_item.order_code = \'' + orderCode + '\' ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //插入数据
    add = function (req, res) {
        var productCode = req.body.productCode,
            productName = req.body.productName,
            productCaption = req.body.productCaption,
            sql =
                'INSERT INTO ' +
                    'product( ' +
                        'product_code, ' +
                        'product_name, ' +
                        'product_caption ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + productCode + '", ' +
                    '"' + productName + '", ' +
                    '"' + productCaption + '") ',
            jsonObj = {
                success: true
            };
        db
            .execute(sql)
            .on('done', function (data) {
                jsonObj.msg = '产品录入成功！';
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '产品录入失败！';
                res.send(jsonObj);
            });
    },

    //更新数据
    edit = function (req, res) {
        var productCode = req.body.productCode,
            productName = req.body.productName,
            productCaption = req.body.productCaption,
            sql =
                'UPDATE ' +
                    'product ' +
                'SET ' +
                    'product_code=\'' + productCode + '\', ' +
                    'product_name=\'' + productName + '\', ' +
                    'product_caption=\'' + productCaption + '\' ' +
                'WHERE ' +
                    'product_code = \'' + productCode + '\' ',
            jsonObj = {
                success: true
            };
        db
            .execute(sql)
            .on('done', function (data) {
                jsonObj.msg = '产品更新成功！';
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '产品更新失败！';
                res.send(jsonObj);
            });
    },
    //删除数据
    del = function (req, res) {
        var productCode = req.body.productCode,
            sql =
                'DELETE ' +
                'FROM ' +
                    'product ' +
                'WHERE ' +
                    'product_code = \'' + productCode + '\' ',
            jsonObj = {
                success: true
            };
        db
            .execute(sql)
            .on('done', function (data) {
                jsonObj.msg = '产品删除成功！';
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '产品删除失败！';
                res.send(jsonObj);
            });
    };

exports.handler = function (req, res) {
    try {
        var action = req.body.action || 'query';

        switch (action) {
            case 'query':
                query(req, res);
                break;
            case 'conditionQuery':
                conditionQuery(req, res);
                break;
            case 'queryByPK':
                queryByPK(req, res);
                break;
            case 'queryArrayByOrderCode':
                queryArrayByOrderCode(req, res);
                break;
            case 'queryForCombo':
                queryForCombo(req, res);
                break;
            case 'queryArrayForComboByOrderCode':
                queryArrayForComboByOrderCode(req, res);
                break;
            case 'add':
                add(req, res);
                break;
            case 'edit':
                edit(req, res);
                break;
            case 'del':
                del(req, res);
                break;
            default:
                break;
        }
    } catch (err) {
    }
};