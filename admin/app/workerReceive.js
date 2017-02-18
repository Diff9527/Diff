/**
 * 劳动者表数据维护
 * 获取劳动者列表逻辑处理
 */
var db = require('../../conn').connection;

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'worker_code AS workerCode, ' +
                    'worker_name AS workerName, ' +
                    'worker_post AS workerPost, ' +
                    'FORMAT(attendance_date_start,\'yyyy-mm-dd\') AS attendanceDateStart, ' +
                    'base_rest_number AS baseRestNumber ' +
                'FROM ' +
                    'worker ',
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
        var workerCode = req.body.workerCode,
            workerName = req.body.workerName,
            workerPost = req.body.workerPost,
            attendanceDateStart = req.body.attendanceDateStart,
            sql =
                'SELECT ' +
                    'worker_code AS workerCode, ' +
                    'worker_name AS workerName, ' +
                    'worker_post AS workerPost, ' +
                    'Format(attendance_date_start,\'yyyy-mm-dd\') AS attendanceDateStart, ' +
                    'base_rest_number as baseRestNumber ' +
                'FROM ' +
                    'worker ' +
                'WHERE ' +
                    'worker_code LIKE \'%' + workerCode + '%\' ' +
                    'AND worker_name LIKE \'%' + workerName + '%\' ' +
                    'AND worker_post LIKE \'%' + workerPost + '%\' ' +
                    'AND Format(attendance_date_start,"yyyy-mm-dd") LIKE \'%' + attendanceDateStart + '%\' ',
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
        var workerCode = req.body.workerCode,
            sql =
                'SELECT ' +
                    'worker_code AS workerCode, ' +
                    'worker_name AS workerName, ' +
                    'worker_post AS workerPost, ' +
                    'Format(attendance_date_start,"yyyy-mm-dd") AS attendanceDateStart, ' +
                    'base_rest_number AS baseRestNumber ' +
                'FROM ' +
                    'worker ' +
                'WHERE ' +
                    'worker_code = \'' + workerCode + '\' ',
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

    //查询劳动者对象数据给Combo控件提供数据
    queryForCombo = function (req, res) {
        var sql =
                'SELECT ' +
                    'worker_code AS workerCode, ' +
                    'worker_name AS workerName, ' +
                    'worker_code & \' | \' & worker_name AS workerCombo, ' +
                    'FORMAT(attendance_date_start,\'yyyy-mm-dd\') AS attendanceDateStart, ' +
                    'base_rest_number AS baseRestNumber ' +
                'FROM ' +
                    'worker ',
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
        var workerCode = req.body.workerCode,
            workerName = req.body.workerName,
            workerPost = req.body.workerPost,
            attendanceDateStart = req.body.attendanceDateStart,
            baseRestNumber = req.body.baseRestNumber,
            sql =
                'INSERT INTO ' +
                    'worker(' +
                        'worker_code, ' +
                        'worker_name, ' +
                        'worker_post, ' +
                        'attendance_date_start, ' +
                        'base_rest_number ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + workerCode + '", ' +
                    '"' + workerName + '", ' +
                    '"' + workerPost + '", ' +
                    '#' + attendanceDateStart + '#, ' +
                    '"' + baseRestNumber + '") ',
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
        var workerCode = req.body.workerCode,
            workerName = req.body.workerName,
            workerPost = req.body.workerPost,
            attendanceDateStart = req.body.attendanceDateStart,
            baseRestNumber = req.body.baseRestNumber,
            sql =
                'UPDATE ' +
                    'worker ' +
                'SET ' +
                    'worker_code=\'' + workerCode + '\', ' +
                    'worker_name=\'' + workerName + '\', ' +
                    'worker_post=\'' + workerPost + '\', ' +
                    'attendance_date_start=#' + attendanceDateStart + '#, ' +
                    'base_rest_number=\'' + baseRestNumber + '\' ' +
                'WHERE ' +
                    'worker_code = \'' + workerCode + '\' ',
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
        var workerCode = req.body.workerCode,
            sql =
                'DELETE ' +
                'FROM ' +
                    'worker ' +
                'WHERE ' +
                    'worker_code = \'' + workerCode + '\' ',
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
            case 'queryForCombo':
                queryForCombo(req, res);
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