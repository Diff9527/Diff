/**
 * 考勤报表统计查询业务逻辑
 */
var db = require('../../conn').connection,
    nodeExcel = require('excel-export');

//报表默认查询
var defaultQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
            sql =
                'SELECT ' +
                    'attendance_record.attendance_record_id AS attendanceRecordId, ' +
                    'FORMAT(attendance_record.attendance_record_date,\'yyyy-mm-dd\') AS attendanceRecordDate, ' +
                    'attendance_record.attendance_record_type AS attendanceRecordType, ' +
                    'attendance_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'attendance_record.length_number AS lengthNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(overtime_ar.length_number)),0,SUM(overtime_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS overtime_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', overtime_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', overtime_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND overtime_ar.attendance_record_type = \'overtime\' ' +
                        'AND overtime_ar.worker_code = attendance_record.worker_code) AS overtimeSum, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(rest_ar.length_number)),0,SUM(rest_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS rest_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', rest_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', rest_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND rest_ar.attendance_record_type = \'rest\' ' +
                        'AND rest_ar.worker_code = attendance_record.worker_code) AS restSum, ' +
                    '(IIF(ISNULL(worker.base_rest_number),0,worker.base_rest_number) ' +
                    '+ ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(less_overtime_ar.length_number)),0,SUM(less_overtime_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS less_overtime_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', less_overtime_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', less_overtime_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND less_overtime_ar.attendance_record_type = \'overtime\' ' +
                        'AND less_overtime_ar.worker_code = attendance_record.worker_code) ' +
                    '- ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(less_rest_ar.length_number)),0,SUM(less_rest_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS less_rest_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', less_rest_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', less_rest_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND less_rest_ar.attendance_record_type = \'rest\' ' +
                        'AND less_rest_ar.worker_code = attendance_record.worker_code)) AS lastRestSum, ' +
                    'attendance_record.attendance_content AS attendanceContent, ' +
                    'attendance_record.remark ' +
                'FROM ' +
                    'attendance_record ' +
                    'INNER JOIN worker ' +
                        'ON ' +
                            'attendance_record.worker_code = worker.worker_code ' +
                            'AND DATEDIFF(\'d\', attendance_record.attendance_record_date, worker.attendance_date_start) <= 0 ',
            jsonObj = {
                success: true
            };
        db
            .query(sql)
            .on('done', function (data) {
                if(actionType == 'excel'){
                    exportExcelProcess(req, res, data);
                }
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //报表条件查询
    conditionQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
            attendanceRecordDateBegin = req.body.attendanceRecordDateBegin || req.query.attendanceRecordDateBegin,
            attendanceRecordDateEnd = req.body.attendanceRecordDateEnd || req.query.attendanceRecordDateEnd,
            attendanceRecordType = req.body.attendanceRecordType || req.query.attendanceRecordType,
            workerCode = req.body.workerCode || req.query.workerCode,
            sql =
                'SELECT ' +
                    'attendance_record.attendance_record_id AS attendanceRecordId, ' +
                    'FORMAT(attendance_record.attendance_record_date,\'yyyy-mm-dd\') AS attendanceRecordDate, ' +
                    'attendance_record.attendance_record_type AS attendanceRecordType, ' +
                    'attendance_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'attendance_record.length_number AS lengthNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(overtime_ar.length_number)),0,SUM(overtime_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS overtime_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', overtime_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', overtime_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND overtime_ar.attendance_record_type = \'overtime\' ' +
                        'AND overtime_ar.worker_code = attendance_record.worker_code) AS overtimeSum, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(rest_ar.length_number)),0,SUM(rest_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS rest_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', rest_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', rest_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND rest_ar.attendance_record_type = \'rest\' ' +
                        'AND rest_ar.worker_code = attendance_record.worker_code) AS restSum, ' +
                    '(IIF(ISNULL(worker.base_rest_number),0,worker.base_rest_number) ' +
                    '+ ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(less_overtime_ar.length_number)),0,SUM(less_overtime_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS less_overtime_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', less_overtime_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', less_overtime_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND less_overtime_ar.attendance_record_type = \'overtime\' ' +
                        'AND less_overtime_ar.worker_code = attendance_record.worker_code) ' +
                    '- ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(less_rest_ar.length_number)),0,SUM(less_rest_ar.length_number)) ' +
                    'FROM ' +
                        'attendance_record AS less_rest_ar ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', less_rest_ar.attendance_record_date, attendance_record.attendance_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', less_rest_ar.attendance_record_date, worker.attendance_date_start) <= 0 ' +
                        'AND less_rest_ar.attendance_record_type = \'rest\' ' +
                        'AND less_rest_ar.worker_code = attendance_record.worker_code)) AS lastRestSum, ' +
                    'attendance_record.attendance_content AS attendanceContent, ' +
                    'attendance_record.remark ' +
                'FROM ' +
                    'attendance_record ' +
                    'INNER JOIN worker ' +
                        'ON ' +
                            'attendance_record.worker_code = worker.worker_code ' +
                            'AND DATEDIFF(\'d\', attendance_record.attendance_record_date, worker.attendance_date_start) <= 0 ',
            conditionSql =
                'WHERE 2=2 ',
            jsonObj = {
                success: true
            };
        if (attendanceRecordDateBegin) {
            conditionSql +=
                'AND DATEDIFF(\'d\', attendance_record.attendance_record_date, #' + attendanceRecordDateBegin + '#) <= 0 ';
        }
        if (attendanceRecordDateEnd) {
            conditionSql +=
                'AND DATEDIFF(\'d\', attendance_record.attendance_record_date, #' + attendanceRecordDateEnd + '#) >= 0 ';
        }
        if (attendanceRecordType) {
            conditionSql +=
                'AND attendance_record.attendance_record_type = \'' + attendanceRecordType + '\' ';
        }
        if (workerCode) {
            conditionSql +=
                'AND attendance_record.worker_code = \'' + workerCode + '\' ';
        }
        sql += conditionSql;
        db
            .query(sql)
            .on('done', function (data) {
                if(actionType == 'excel'){
                    exportExcelProcess(req, res, data);
                }
                jsonObj.jsonData = data.records;
                res.send(jsonObj);
            })
            .on('fail', function (data) {
                jsonObj.success = false;
                jsonObj.msg = '获取数据失败！';
                res.send(jsonObj);
            });
    },

    //导出Excel处理
    exportExcelProcess = function (req, res, data) {
        var row=[], record, exportExcelConfig = {
            stylesXmlFile: "excel-export_styles.xml",
            name: "attendanceReport" //非中文
        };
        exportExcelConfig.cols = [{
            caption:'劳动者编码',
            captionStyleIndex: 2,
            type:'string',
            width:10
        },{
            caption:'劳动者名称',
            captionStyleIndex: 2,
            type:'string',
            width:10
        },{
            caption:'考勤记录日期',
            captionStyleIndex: 2,
            type:'string',
            width:12
        },{
            caption:'考勤类型',
            captionStyleIndex: 2,
            type:'string',
            width:8,
            beforeCellWrite:function(row, cellData, eOpt){
                if (cellData == 'overtime') {
                    return '加班';
                } else if (cellData == 'rest') {
                    return '调休';
                } else if (cellData == 'holiday') {
                    return '请假';
                } else if (cellData == 'other') {
                    return '其他';
                }
                return cellData;
            }
        },{
            caption:'时间长度(小时)',
            captionStyleIndex: 2,
            type:'number',
            width:14
        },{
            caption:'累计加班时长(小时)',
            captionStyleIndex: 2,
            type:'number',
            width:18
        },{
            caption:'累计调休时长(小时)',
            captionStyleIndex: 2,
            type:'number',
            width:18
        },{
            caption:'剩余调休时长(小时)',
            captionStyleIndex: 2,
            type:'number',
            width:18
        },{
            caption:'考勤记录内容体',
            captionStyleIndex: 2,
            type:'string',
            width:30
        },{
            caption:'备注',
            captionStyleIndex: 2,
            type:'string',
            width:30
        }];
        exportExcelConfig.rows = [];
        while (data.records.length){
            record = data.records.shift();
            row = [];
            row.push(record.workerCode);
            row.push(record.workerName);
            row.push(record.attendanceRecordDate);
            row.push(record.attendanceRecordType);
            row.push(record.lengthNumber);
            row.push(record.overtimeSum);
            row.push(record.restSum);
            row.push(record.lastRestSum);
            row.push(record.attendanceContent);
            row.push(record.remark);
            exportExcelConfig.rows.push(row);
        }
        var result = nodeExcel.execute(exportExcelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats; charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename="+encodeURI("考勤报表")+".xlsx");
        res.end(result, 'binary');
    };

exports.handler = function (req, res) {
    try {
        var action = req.body.action || req.query.action || 'defaultQuery';
        switch (action) {
            case 'defaultQuery':
                defaultQuery(req, res);
                break;
            case 'conditionQuery':
                conditionQuery(req, res);
                break;
            default:
                break;
        }
    } catch (err) {
        //res.send(cError(err));
    }
};