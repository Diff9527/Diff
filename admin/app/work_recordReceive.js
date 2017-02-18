/**
 * 工作记录表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection,
    moment = require('moment');

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'work_record.work_record_id AS workRecordId, ' +
                    'FORMAT(work_record.work_record_date,\"yyyy-mm-dd\") AS workRecordDate, ' +
                    'work_record.order_code AS orderCode, ' +
                    'work_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'work_record.step_code AS stepCode, ' +
                    'step.step_name AS stepName, ' +
                    'step.step_quota AS stepQuota, ' +
                    'work_record.piece_number AS pieceNumber, ' +
                    'work_record.hours_number AS hoursNumber, ' +
                    'work_record.pass_rate AS passRate, ' +
                    'work_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName,' +
                    'work_record.remark ' +
                'FROM ' +
                    '((work_record ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'work_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'work_record.worker_code = worker.worker_code) ' +
                    'LEFT JOIN step ' +
                        'ON ' +
                            'work_record.step_code = step.step_code ',
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
        var workRecordDate = req.body.workRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            stepCode = req.body.stepCode,
            workerCode = req.body.workerCode,
            sql =
                'SELECT ' +
                    'work_record.work_record_id AS workRecordId, ' +
                    'FORMAT(work_record.work_record_date,\'yyyy-mm-dd\') AS workRecordDate, ' +
                    'work_record.order_code AS orderCode, ' +
                    'work_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'work_record.step_code AS stepCode, ' +
                    'step.step_name AS stepName, ' +
                    'step.step_quota AS stepQuota, ' +
                    'work_record.piece_number AS pieceNumber, ' +
                    'work_record.hours_number AS hoursNumber, ' +
                    'work_record.pass_rate AS passRate, ' +
                    'work_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'work_record.remark ' +
                'FROM ' +
                    '((work_record ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'work_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'work_record.worker_code = worker.worker_code) ' +
                    'LEFT JOIN step ' +
                        'ON ' +
                            'work_record.step_code = step.step_code ' +
                'WHERE ' +
                    'FORMAT(work_record_date,\'yyyy-mm-dd\') LIKE \'%' + workRecordDate + '%\' ' +
                    'AND order_code LIKE \'%' + orderCode + '%\' ' +
                    'AND work_record.product_code LIKE \'%' + productCode + '%\' ' +
                    'AND work_record.step_code LIKE \'%' + stepCode + '%\' ' +
                    'AND work_record.worker_code LIKE \'%' + workerCode + '%\' ',
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
        var workRecordId = req.body.workRecordId;
        var sql =
            'SELECT ' +
                'work_record.work_record_id AS workRecordId, ' +
                'FORMAT(work_record.work_record_date,\"yyyy-mm-dd\") AS workRecordDate, ' +
                'work_record.order_code AS orderCode, ' +
                'work_record.product_code AS productCode, ' +
                'product.product_name AS productName, ' +
                'work_record.step_code AS stepCode, ' +
                'step.step_name AS stepName, ' +
                'step.step_quota AS stepQuota, ' +
                'work_record.piece_number AS pieceNumber, ' +
                'work_record.hours_number AS hoursNumber, ' +
                'work_record.pass_rate AS passRate, ' +
                'work_record.worker_code AS workerCode, ' +
                'worker.worker_name AS workerName, ' +
                'work_record.remark ' +
            'FROM ' +
                '((work_record ' +
                'LEFT JOIN product ' +
                    'ON ' +
                        'work_record.product_code = product.product_code) ' +
                'LEFT JOIN worker ' +
                    'ON ' +
                        'work_record.worker_code = worker.worker_code) ' +
                'LEFT JOIN step ' +
                    'ON ' +
                        'work_record.step_code = step.step_code ' +
            'WHERE ' +
                'work_record_id = \'' + workRecordId + '\' ';
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
            workRecordId = now.format('YYYYMMDDHHmmssSSS'),
            workRecordDate = req.body.workRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            stepCode = req.body.stepCode,
            pieceNumber = req.body.pieceNumber,
            hoursNumber = req.body.hoursNumber,
            passRate = req.body.passRate,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
                'INSERT INTO ' +
                    'work_record( ' +
                        'work_record_id, ' +
                        'work_record_date, ' +
                        'order_code, ' +
                        'product_code, ' +
                        'step_code, ' +
                        'piece_number, ' +
                        'hours_number, ' +
                        'pass_rate, ' +
                        'worker_code, ' +
                        'remark ' +
                    ') ' +
                'VALUES ( ' +
                '"' + workRecordId + '", ' +
                '"' + workRecordDate + '", ' +
                '"' + orderCode + '", ' +
                '"' + productCode + '", ' +
                '"' + stepCode + '", ' +
                '"' + pieceNumber + '", ' +
                '"' + hoursNumber + '", ' +
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
        var workRecordId = req.body.workRecordId,
            workRecordDate = req.body.workRecordDate,
            orderCode = req.body.orderCode,
            productCode = req.body.productCode,
            stepCode = req.body.stepCode,
            pieceNumber = req.body.pieceNumber,
            hoursNumber = req.body.hoursNumber,
            passRate = req.body.passRate,
            workerCode = req.body.workerCode,
            remark = req.body.remark;
        var sql =
            'UPDATE ' +
                'work_record ' +
            'SET ' +
                'work_record_id=' + workRecordId + ', ' +
                'work_record_date= #' + workRecordDate + '# , ' +
                'order_code=\'' + orderCode + '\', ' +
                'product_code=\'' + productCode + '\', ' +
                'step_code=\'' + stepCode + '\', ' +
                'piece_number=\'' + pieceNumber + '\', ' +
                'hours_number=\'' + hoursNumber + '\', ' +
                'pass_rate=\'' + passRate + '\', ' +
                'worker_code=\'' + workerCode + '\', ' +
                'remark=\'' + remark + '\' ' +
            'WHERE ' +
            'work_record_id = \'' + workRecordId + '\' ';
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
        var workRecordId = req.body.workRecordId;
        var sql =
            'DELETE ' +
            'FROM ' +
                'work_record ' +
            'WHERE ' +
                'work_record_id = \'' + workRecordId + '\' ';
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