/**
 * 物料记录表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection,
    moment = require('moment');

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'material_record.material_record_id AS materialRecordId, ' +
                    'FORMAT(material_record.material_record_date,\'yyyy-mm-dd\') AS materialRecordDate, ' +
                    'material_record.order_code AS orderCode, ' +
                    'material_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'material_record.pick_number AS pickNumber, ' +
                    'material_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'material_record.remark ' +
                'FROM ' +
                    '(material_record ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'material_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'material_record.worker_code = worker.worker_code',
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
        var materialRecordDate = req.body.materialRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            workerCode = req.body.workerCode,
            sql =
                'SELECT ' +
                    'material_record.material_record_id AS materialRecordId, ' +
                    'FORMAT(material_record.material_record_date,\'yyyy-mm-dd\') AS materialRecordDate, ' +
                    'material_record.order_code AS orderCode, ' +
                    'material_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'material_record.pick_number AS pickNumber, ' +
                    'material_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'material_record.remark ' +
                'FROM ' +
                    '(material_record ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'material_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'material_record.worker_code = worker.worker_code ' +
                'WHERE ' +
                    'FORMAT(material_record_date,"yyyy-mm-dd") LIKE \'%' + materialRecordDate + '%\' ' +
                    'AND order_code LIKE \'%' + orderCode + '%\' ' +
                    'AND material_record.product_code LIKE \'%' + productCode + '%\' ' +
                    'AND material_record.worker_code LIKE \'%' + workerCode + '%\' ',
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
        var materialRecordId = req.body.materialRecordId;
        var sql =
            'SELECT ' +
                'material_record.material_record_id AS materialRecordId, ' +
                'FORMAT(material_record.material_record_date,\'yyyy-mm-dd\') AS materialRecordDate, ' +
                'material_record.order_code AS orderCode, ' +
                'material_record.product_code AS productCode, ' +
                'product.product_name AS productName, ' +
                'material_record.pick_number AS pickNumber, ' +
                'material_record.worker_code AS workerCode, ' +
                'worker.worker_name AS workerName, ' +
                'material_record.remark ' +
            'FROM ' +
                '(material_record ' +
                'LEFT JOIN product ' +
                    'ON ' +
                        'material_record.product_code = product.product_code) ' +
                'LEFT JOIN worker ' +
                    'ON ' +
                        'material_record.worker_code = worker.worker_code ' +
            'WHERE ' +
                'material_record_id = \'' + materialRecordId + '\' ';
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
            materialRecordId = now.format('YYYYMMDDHHmmssSSS'),
            materialRecordDate = req.body.materialRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            pickNumber = req.body.pickNumber,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
                'INSERT INTO ' +
                    'material_record(' +
                    'material_record_id, ' +
                    'material_record_date, ' +
                    'order_code, ' +
                    'product_code, ' +
                    'pick_number, ' +
                    'worker_code, ' +
                    'remark ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + materialRecordId + '", ' +
                    '#' + materialRecordDate + '#, ' +
                    '"' + orderCode + '", ' +
                    '"' + productCode + '", ' +
                    '"' + pickNumber + '", ' +
                    '"' + workerCode + '", ' +
                    '"' + remark + '") ',
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
        var materialRecordId = req.body.materialRecordId,
            materialRecordDate = req.body.materialRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            pickNumber = req.body.pickNumber,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
            'UPDATE ' +
                'material_record ' +
                'SET ' +
                    'material_record_id=' + materialRecordId + ', ' +
                    'material_record_date=#' + materialRecordDate + '#, ' +
                    'order_code=\'' + orderCode + '\', ' +
                    'product_code=\'' + productCode + '\', ' +
                    'pick_number=\'' + pickNumber + '\', ' +
                    'worker_code=\'' + workerCode + '\', ' +
                    'remark=\'' + remark + '\' ' +
            'WHERE ' +
                'material_record_id = \'' + materialRecordId + '\' ';
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
        var materialRecordId = req.body.materialRecordId;
        var sql =
            'DELETE ' +
            'FROM ' +
                'material_record ' +
            'WHERE ' +
                'material_record_id = \'' + materialRecordId + '\' ';
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