/**
 * 订单表数据维护
 */
var db = require('../../conn').connection;

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'order_code AS orderCode,' +
                    'order_description AS orderDescription,' +
                    'FORMAT(order_time,\'yyyy-mm-dd\') AS orderTime,' +
                    'order_source AS orderSource ' +
                'FROM ' +
                    '[order]',
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
            orderTime = req.body.orderTime,
            sql =
                'SELECT ' +
                    'order_code AS orderCode, ' +
                    'order_description AS orderDescription, ' +
                    'Format(order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                    'order_source AS orderSource ' +
                'FROM ' +
                    '[order] ' +
                'WHERE ' +
                    'order_code LIKE \'%' + orderCode + '%\' ' +
                    'AND Format(order_time,"yyyy-mm-dd") LIKE \'%' + orderTime + '%\' ',
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
        var orderCode = req.body.orderCode;
        var sql =
            'SELECT ' +
                'order_code AS orderCode, ' +
                'order_description AS orderDescription, ' +
                'FORMAT(order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                'order_source AS orderSource ' +
            'FROM ' +
                '[order] ' +
            'WHERE ' +
                'order_code = \'' + orderCode + '\' ';
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
        var orderCode = req.body.orderCode,
            orderDescription = req.body.orderDescription,
            orderTime = req.body.orderTime,
            orderSource = req.body.orderSource;
        var sql =
                'INSERT INTO ' +
                    '[order]( ' +
                        'order_code, ' +
                        'order_description, ' +
                        'order_time, ' +
                        'order_source ' +
                    ') ' +
                'VALUES ( ' +
                '"' + orderCode + '", ' +
                '"' + orderDescription + '", ' +
                '#' + orderTime + '#, ' +
                '"' + orderSource + '") ',
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
        var orderCode = req.body.orderCode,
            orderDescription = req.body.orderDescription,
            orderTime = req.body.orderTime,
            orderSource = req.body.orderSource;
        var sql =
            'UPDATE ' +
                '[order] ' +
            'SET ' +
                'order_code=\'' + orderCode + '\', ' +
                'order_description=\'' + orderDescription + '\', ' +
                'order_time=#' + orderTime + '#, ' +
                'order_source=\'' + orderSource + '\' ' +
            'WHERE ' +
                'order_code = \'' + orderCode + '\' ';
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
        var orderCode = req.body.orderCode;
        var sql =
            'DELETE ' +
            'FROM ' +
                '[order] ' +
            'WHERE ' +
                'order_code = \'' + orderCode + '\' ';
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