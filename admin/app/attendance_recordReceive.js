/**
 * 考勤记录表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection,
    moment = require('moment');

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'attendance_record.attendance_record_id AS attendanceRecordId, ' +
                    'FORMAT(attendance_record.attendance_record_date,\'yyyy-mm-dd\') AS attendanceRecordDate, ' +
                    'attendance_record.attendance_record_type AS attendanceRecordType, ' +
                    'attendance_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'attendance_record.length_number AS lengthNumber, ' +
                    'attendance_record.attendance_content AS attendanceContent, ' +
                    'attendance_record.remark ' +
                'FROM ' +
                    'attendance_record ' +
                    'LEFT JOIN worker ' +
                        'ON '+
                            'attendance_record.worker_code = worker.worker_code ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                //res.send(JSON.stringify(data.records, null, '  '));
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
        var attendanceRecordDate = req.body.attendanceRecordDate,
            attendanceRecordType = req.body.attendanceRecordType,
            workerCode = req.body.workerCode,
            sql =
                'SELECT ' +
                    'attendance_record.attendance_record_id AS attendanceRecordId, ' +
                    'FORMAT(attendance_record.attendance_record_date,"yyyy-mm-dd") AS attendanceRecordDate, ' +
                    'attendance_record.attendance_record_type AS attendanceRecordType, ' +
                    'attendance_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'attendance_record.length_number AS lengthNumber, ' +
                    'attendance_record.attendance_content AS attendanceContent, ' +
                    'attendance_record.remark ' +
                'FROM ' +
                    'attendance_record ' +
                    'LEFT JOIN worker ' +
                        'ON '+
                            'attendance_record.worker_code = worker.worker_code ' +
                'WHERE ' +
                    'FORMAT(attendance_record_date,"yyyy-mm-dd") LIKE \'%' + attendanceRecordDate + '%\' ' +
                    'AND attendance_record_type LIKE \'%' + attendanceRecordType + '%\' ' +
                    'AND attendance_record.worker_code LIKE \'%' + workerCode + '%\' ',
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
        var attendanceRecordId = req.body.attendanceRecordId;
        var sql =
            'SELECT ' +
                'attendance_record.attendance_record_id AS attendanceRecordId, ' +
                'FORMAT(attendance_record.attendance_record_date,"yyyy-mm-dd") AS attendanceRecordDate, ' +
                'attendance_record.attendance_record_type AS attendanceRecordType, ' +
                'attendance_record.worker_code AS workerCode, ' +
                'worker.worker_name AS workerName, ' +
                'attendance_record.length_number AS lengthNumber, ' +
                'attendance_record.attendance_content AS attendanceContent, ' +
                'attendance_record.remark ' +
            'FROM ' +
                'attendance_record ' +
                'LEFT JOIN worker ' +
                    'ON '+
                        'attendance_record.worker_code = worker.worker_code ' +
            'WHERE ' +
                'attendance_record_id = \'' + attendanceRecordId + '\' ';
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
            attendanceRecordId = now.format('YYYYMMDDHHmmssSSS'),
            attendanceRecordDate = req.body.attendanceRecordDate,
            attendanceRecordType = req.body.attendanceRecordType,
            workerCode = req.body.workerCode,
            lengthNumber = req.body.lengthNumber,
            attendanceContent = req.body.attendanceContent,
            remark = req.body.remark;
        var sql =
                'INSERT INTO ' +
                    'attendance_record( ' +
                    'attendance_record_id, ' +
                    'attendance_record_date, ' +
                    'attendance_record_type, ' +
                    'worker_code, ' +
                    'length_number, ' +
                    'attendance_content, ' +
                    'remark ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + attendanceRecordId + '", ' +
                    '"' + attendanceRecordDate + '", ' +
                    '"' + attendanceRecordType + '", ' +
                    '"' + workerCode + '", ' +
                    '"' + lengthNumber + '", ' +
                    '"' + attendanceContent + '", ' +
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
        var attendanceRecordId = req.body.attendanceRecordId,
            attendanceRecordDate = req.body.attendanceRecordDate,
            attendanceRecordType = req.body.attendanceRecordType,
            workerCode = req.body.workerCode,
            lengthNumber = req.body.lengthNumber,
            attendanceContent = req.body.attendanceContent,
            remark = req.body.remark;
        var sql =
            'UPDATE ' +
                'attendance_record ' +
            'SET ' +
                'attendance_record_id=' + attendanceRecordId + ', ' +
                'attendance_record_date= #' + attendanceRecordDate + '#, ' +
                'attendance_record_type=\'' + attendanceRecordType + '\', ' +
                'worker_code=\'' + workerCode + '\', ' +
                'length_number=\'' + lengthNumber + '\', ' +
                'attendance_content=\'' + attendanceContent + '\', ' +
                'remark=\'' + remark + '\' ' +
            'WHERE ' +
                'attendance_record_id = \'' + attendanceRecordId + '\' ';
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
        var attendanceRecordId = req.body.attendanceRecordId;
        var sql =
            'DELETE ' +
            'FROM ' +
                'attendance_record ' +
            'WHERE ' +
                'attendance_record_id = \'' + attendanceRecordId + '\' ';
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