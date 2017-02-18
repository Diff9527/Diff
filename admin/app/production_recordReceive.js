/**
 * 生产记录表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection,
    moment = require('moment');

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'production_record.production_record_id AS productionRecordId, ' +
                    'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') AS productionRecordDate, ' +
                    'production_record.order_code AS orderCode, ' +
                    'production_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'production_record.finish_number AS finishNumber, ' +
                    'production_record.pass_rate AS passRate, ' +
                    'production_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'production_record.remark ' +
                'FROM ' +
                    '((production_record ' +
                    'LEFT JOIN product ' +
                         'ON ' +
                            'production_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'production_record.worker_code = worker.worker_code) ',
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
        var productionRecordDate = req.body.productionRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            workerCode = req.body.workerCode,
            sql =
                'SELECT ' +
                    'production_record.production_record_id AS productionRecordId, ' +
                    'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') AS productionRecordDate, ' +
                    'production_record.order_code AS orderCode, ' +
                    'production_record.product_code AS productCode, ' +
                    'product.product_name as productName ,' +
                    'production_record.finish_number AS finishNumber, ' +
                    'production_record.pass_rate AS passRate, ' +
                    'production_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'production_record.remark ' +
                'FROM ' +
                    '((production_record ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'production_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'production_record.worker_code = worker.worker_code) ' +
                'WHERE '+
                    'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') LIKE \'%' + productionRecordDate + '%\' ' +
                    'AND production_record.order_code LIKE \'%' + orderCode + '%\' ' +
                    'AND production_record.product_code LIKE \'%' + productCode + '%\' ' +
                    'AND production_record.worker_code LIKE \'%' + workerCode + '%\' ',
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
        var productionRecordId = req.body.productionRecordId;
        var sql =
            'SELECT ' +
                'production_record.production_record_id AS productionRecordId, ' +
                'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') AS productionRecordDate, ' +
                'production_record.order_code AS orderCode, ' +
                'production_record.product_code AS productCode, ' +
                'product.product_name AS productName, ' +
                'production_record.finish_number AS finishNumber, ' +
                'production_record.pass_rate AS passRate, ' +
                'production_record.worker_code AS workerCode, ' +
                'worker.worker_name AS workerName, ' +
                'production_record.remark ' +
            'FROM ' +
                '((production_record ' +
                'LEFT JOIN product ' +
                    'ON ' +
                        'production_record.product_code = product.product_code) ' +
                'LEFT JOIN worker ' +
                    'ON ' +
                        'production_record.worker_code = worker.worker_code) ' +
            'WHERE ' +
                'production_record_id = \'' + productionRecordId + '\' ';
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
            productionRecordId = now.format('YYYYMMDDHHmmssSSS'),
            productionRecordDate = req.body.productionRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            finishNumber = req.body.finishNumber,
            passRate = req.body.passRate,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
                'INSERT INTO ' +
                    'production_record( ' +
                        'production_record_id, ' +
                        'production_record_date, ' +
                        'order_code, ' +
                        'product_code, ' +
                        'finish_number, ' +
                        'pass_rate, ' +
                        'worker_code, ' +
                        'remark ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + productionRecordId + '", ' +
                    '"' + productionRecordDate + '", ' +
                    '"' + orderCode + '", ' +
                    '"' + productCode + '", ' +
                    '"' + finishNumber + '", ' +
                    '"' + passRate + '", ' +
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
        var productionRecordId = req.body.productionRecordId,
            productionRecordDate = req.body.productionRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            finishNumber = req.body.finishNumber,
            passRate = req.body.passRate,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
            'UPDATE ' +
                'production_record ' +
            'SET ' +
                'production_record_id=' + productionRecordId + ', ' +
                'production_record_date=#' + productionRecordDate + '#, ' +
                'order_code=\'' + orderCode + '\', ' +
                'product_code=\'' + productCode + '\', ' +
                'finish_number=\'' + finishNumber + '\', ' +
                'pass_rate=\'' + passRate + '\', ' +
                'worker_code=\'' + workerCode + '\', ' +
                'remark=\'' + remark + '\' ' +
            'WHERE ' +
                'production_record_id = \'' + productionRecordId + '\' ';
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
        var productionRecordId = req.body.productionRecordId;
        var sql =
            'DELETE ' +
            'FROM ' +
                'production_record ' +
            'WHERE ' +
                'production_record_id = \'' + productionRecordId + '\' ';
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