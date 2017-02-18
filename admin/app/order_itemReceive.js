/**
 * 订单明细表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection,
    moment = require('moment');

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'order_item_id AS orderItemId, ' +
                    'order_item.order_code AS orderCode, ' +
                    'order_item.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'product_demand_number AS productDemandNumber, ' +
                    'order_item_note as orderItemNote ' +
                'FROM ' +
                    'order_item ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'order_item.product_code = product.product_code ',
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
        var orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            sql =
                'SELECT ' +
                    'order_item_id AS orderItemId, ' +
                    'order_item.order_code AS orderCode, ' +
                    'order_item.product_code AS productCode, ' +
                    'product.product_name  AS productName, ' +
                    'product_demand_number AS productDemandNumber, ' +
                    'order_item_note AS orderItemNote ' +
                'FROM ' +
                    'order_item ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'order_item.product_code = product.product_code '+
                'WHERE ' +
                    'order_code LIKE \'%' + orderCode + '%\' ' +
                    'AND order_item.product_code LIKE \'%' + productCode + '%\' ',
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
        var orderItemId = req.body.orderItemId;
        var sql =
            'SELECT ' +
                'order_item_id AS orderItemId,' +
                'order_item.order_code AS orderCode,' +
                'order_item.product_code AS productCode,' +
                'product.product_name AS productName,' +
                'product_demand_number AS productDemandNumber,' +
                'order_item_note AS orderItemNote ' +
            'FROM ' +
                'order_item ' +
                'LEFT JOIN product ' +
                    'ON ' +
                        'order_item.product_code = product.product_code '+
            'WHERE ' +
                'order_item_id = \'' + orderItemId + '\' ';
        var jsonObj = {
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

    //插入数据
    add = function (req, res) {
        var now = moment(),
            orderItemId = now.format('YYYYMMDDHHmmssSSS'),
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            productDemandNumber = req.body.productDemandNumber,
            orderItemNote = req.body.orderItemNote;
        var sql =
                'INSERT INTO ' +
                    'order_item(' +
                        'order_item_id, ' +
                        'order_code, ' +
                        'product_code, ' +
                        'product_demand_number, ' +
                        'order_item_note ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + orderItemId + '", ' +
                    '"' + orderCode + '", ' +
                    '"' + productCode + '", ' +
                    '"' + productDemandNumber + '", ' +
                    '"' + orderItemNote + '") ',
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
        var orderItemId = req.body.orderItemId,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            productDemandNumber = req.body.productDemandNumber,
            orderItemNote = req.body.orderItemNote;
        var sql =
            'UPDATE ' +
                'order_item ' +
            'SET ' +
                'order_item_id=' + orderItemId + ', ' +
                'order_code=\'' + orderCode + '\', ' +
                'product_code=\'' + productCode + '\', ' +
                'product_demand_number=\'' + productDemandNumber + '\', ' +
                'order_item_note=\'' + orderItemNote + '\' ' +
            'WHERE ' +
                'order_item_id = \'' + orderItemId + '\' ';
        var jsonObj = {
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
        var orderItemId = req.body.orderItemId;
        var sql =
            'DELETE ' +
            'FROM ' +
                'order_item ' +
            'WHERE ' +
                'order_item_id = \'' + orderItemId + '\' ';
        var jsonObj = {
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