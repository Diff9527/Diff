/**
 * 劳动效率报表统计查询业务逻辑
 */
var db = require('../../conn').connection,
    nodeExcel = require('excel-export');

//报表默认查询
var defaultQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
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
                    'ROUND((work_record.piece_number/step.step_quota),2) AS ratedHours, ' +
                    'work_record.hours_number AS hoursNumber, ' +
                    'work_record.pass_rate AS passRate, ' +
                    'work_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'work_record.remark ' +
                'FROM ' +
                    '(((work_record ' +
                    'INNER JOIN [order] ' +
                        'ON ' +
                            'work_record.order_code = order.order_code) ' +
                    'INNER JOIN product ' +
                        'ON ' +
                            'work_record.product_code = product.product_code) ' +
                    'INNER JOIN step ' +
                        'ON ' +
                            'work_record.step_code = step.step_code) ' +
                    'INNER JOIN worker ' +
                        'ON ' +
                            'work_record.worker_code = worker.worker_code ',
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
            workRecordDateBegin = req.body.workRecordDateBegin || req.query.workRecordDateBegin,
            workRecordDateEnd = req.body.workRecordDateEnd || req.query.workRecordDateEnd,
            orderCode = req.body.orderCode || req.query.orderCode,
            productCode = req.body.productCode || req.query.productCode,
            stepCode = req.body.stepCode || req.query.stepCode,
            workerCode = req.body.workerCode || req.query.workerCode,
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
                    'ROUND((work_record.piece_number/step.step_quota),2) AS ratedHours, ' +
                    'work_record.hours_number AS hoursNumber, ' +
                    'work_record.pass_rate AS passRate, ' +
                    'work_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'work_record.remark ' +
                'FROM ' +
                    '(((work_record ' +
                    'INNER JOIN [order] ' +
                        'ON ' +
                            'work_record.order_code = order.order_code) ' +
                    'INNER JOIN product ' +
                        'ON ' +
                            'work_record.product_code = product.product_code) ' +
                    'INNER JOIN step ' +
                        'ON ' +
                            'work_record.step_code = step.step_code) ' +
                    'INNER JOIN worker ' +
                        'ON ' +
                            'work_record.worker_code = worker.worker_code ',
            conditionSql =
                'WHERE 2=2 ',
            jsonObj = {
                success: true
            };
        if (workRecordDateBegin) {
            conditionSql +=
                'AND DATEDIFF(\'d\', work_record.work_record_date, #' + workRecordDateBegin + '#) <= 0 ';
        }
        if (workRecordDateEnd) {
            conditionSql +=
                'AND DATEDIFF(\'d\', work_record.work_record_date, #' + workRecordDateEnd + '#) >= 0 ';
        }
        if (orderCode) {
            conditionSql +=
                'AND work_record.order_code = \'' + orderCode + '\' ';
        }
        if (productCode) {
            conditionSql +=
                'AND work_record.product_code = \'' + productCode + '\' ';
        }
        if (stepCode) {
            conditionSql +=
                'AND work_record.step_code = \'' + stepCode + '\' ';
        }
        if (workerCode) {
            conditionSql +=
                'AND work_record.worker_code = \'' + workerCode + '\' ';
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
            name: "workerEfficiencyReport" //非中文
        };
        exportExcelConfig.cols = [{
            caption:'工作记录日期',
            captionStyleIndex: 2,
            type:'string',
            width:12
        },{
            caption:'劳动者',
            captionStyleIndex: 2,
            type:'string',
            width:8
        },{
            caption:'订单编码',
            captionStyleIndex: 2,
            type:'string',
            width:15
        },{
            caption:'产品编码',
            captionStyleIndex: 2,
            type:'string',
            width:20
        },{
            caption:'产品名称',
            captionStyleIndex: 2,
            type:'string',
            width:20
        },{
            caption:'工序名称',
            captionStyleIndex: 2,
            type:'string',
            width:15
        },{
            caption:'工序配额',
            captionStyleIndex: 2,
            type:'number',
            width:8
        },{
            caption:'计件数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'额定工时',
            captionStyleIndex: 2,
            type:'number',
            width:8
        },{
            caption:'实际工时',
            captionStyleIndex: 2,
            type:'number',
            width:8
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
            row.push(record.workRecordDate);
            row.push(record.workerName);
            row.push(record.orderCode);
            row.push(record.productCode);
            row.push(record.productName);
            row.push(record.stepCode);
            row.push(record.stepName);
            row.push(record.stepQuota);
            row.push(record.pieceNumber);
            row.push(record.ratedHours);
            row.push(record.hoursNumber);
            row.push(record.remark);
            exportExcelConfig.rows.push(row);
        }
        var result = nodeExcel.execute(exportExcelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats; charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI("劳动效率报表") + ".xlsx");
        res.end(result, 'binary');
    };

exports.handler = function (req, res) {
    try {
        var action = req.body.action || req.query.action ||  'defaultQuery';

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
    }
};