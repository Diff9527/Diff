/**
 * 生产报表统计查询业务逻辑
 */
var db = require('../../conn').connection,
    nodeExcel = require('excel-export');

//报表默认查询
var defaultQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
            sql =
                'SELECT ' +
                    'production_record.production_record_id AS productionRecordId, ' +
                    'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') AS productionRecordDate, ' +
                    'production_record.order_code AS orderCode, ' +
                    'FORMAT(oiop.order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                    'oiop.product_demand_number AS productDemandNumber, ' +
                    'production_record.finish_number AS finishNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(finishSum_pr.finish_number)),0,SUM(finishSum_pr.finish_number)) ' +
                    'FROM ' +
                        'production_record AS finishSum_pr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', finishSum_pr.production_record_date, production_record.production_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', finishSum_pr.production_record_date, oiop.order_time) <= 0 ' +
                        'AND finishSum_pr.order_code = production_record.order_code ' +
                        'AND finishSum_pr.product_code = production_record.product_code) AS finishSum, ' +
                    '(oiop.product_demand_number ' +
                    '- ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(lastDemand_pr.finish_number)),0,SUM(lastDemand_pr.finish_number)) ' +
                    'FROM ' +
                        'production_record AS lastDemand_pr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', lastDemand_pr.production_record_date, production_record.production_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', lastDemand_pr.production_record_date, oiop.order_time) <= 0 ' +
                        'AND lastDemand_pr.order_code = production_record.order_code ' +
                        'AND lastDemand_pr.product_code = production_record.product_code)) AS lastDemandNumber, ' +
                    'production_record.product_code AS productCode, ' +
                    'oiop.product_name AS productName, ' +
                    'production_record.pass_rate AS passRate, ' +
                    'production_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'production_record.remark ' +
                'FROM ' +
                    '(production_record ' +
                    'INNER JOIN ' +
                        '(select ' +
                            'order_item.order_item_id, ' +
                            'order_item.product_demand_number, ' +
                            'order_item.order_code, ' +
                            'FORMAT(order.order_time,\'yyyy-mm-dd\') AS order_time, ' +
                            'order_item.product_code, ' +
                            'product.product_name ' +
                        'FROM ' +
                            '(order_item ' +
                            'INNER JOIN [order] ' +
                                'ON ' +
                                    'order_item.order_code = order.order_code) ' +
                            'INNER JOIN product ' +
                                'ON ' +
                                    'order_item.product_code = product.product_code) AS oiop ' +
                            'ON ' +
                                'production_record.order_code = oiop.order_code ' +
                                'AND production_record.product_code = oiop.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'production_record.worker_code = worker.worker_code ',
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
            productionRecordDateBegin = req.body.productionRecordDateBegin || req.query.productionRecordDateBegin,
            productionRecordDateEnd = req.body.productionRecordDateEnd || req.query.productionRecordDateEnd,
            orderCode = req.body.orderCode || req.query.orderCode,
            productCode = req.body.productCode || req.query.productCode,
            workerCode = req.body.workerCode || req.query.workerCode,
            sql =
                'SELECT ' +
                    'production_record.production_record_id AS productionRecordId, ' +
                    'FORMAT(production_record.production_record_date,\'yyyy-mm-dd\') AS productionRecordDate, ' +
                    'production_record.order_code AS orderCode, ' +
                    'FORMAT(oiop.order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                    'oiop.product_demand_number AS productDemandNumber, ' +
                    'production_record.finish_number AS finishNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(finishSum_pr.finish_number)),0,SUM(finishSum_pr.finish_number)) ' +
                    'FROM ' +
                        'production_record AS finishSum_pr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', finishSum_pr.production_record_date, production_record.production_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', finishSum_pr.production_record_date, oiop.order_time) <= 0 ' +
                        'AND finishSum_pr.order_code = production_record.order_code ' +
                        'AND finishSum_pr.product_code = production_record.product_code) AS finishSum, ' +
                    '(oiop.product_demand_number ' +
                    '- ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(lastDemand_pr.finish_number)),0,SUM(lastDemand_pr.finish_number)) ' +
                    'FROM ' +
                        'production_record AS lastDemand_pr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', lastDemand_pr.production_record_date, production_record.production_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', lastDemand_pr.production_record_date, oiop.order_time) <= 0 ' +
                        'AND lastDemand_pr.order_code = production_record.order_code ' +
                        'AND lastDemand_pr.product_code = production_record.product_code)) AS lastDemandNumber, ' +
                    'production_record.product_code AS productCode, ' +
                    'oiop.product_name AS productName, ' +
                    'production_record.pass_rate AS passRate, ' +
                    'production_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'production_record.remark ' +
                'FROM ' +
                    '(production_record ' +
                    'INNER JOIN ' +
                        '(select ' +
                            'order_item.order_item_id,' +
                            'order_item.product_demand_number,' +
                            'order_item.order_code,' +
                            'FORMAT(order.order_time,\'yyyy-mm-dd\') AS order_time, ' +
                            'order_item.product_code, ' +
                            'product.product_name ' +
                        'FROM ' +
                            '(order_item ' +
                                'INNER JOIN [order] ' +
                                    'ON ' +
                                        'order_item.order_code = order.order_code) ' +
                                'INNER JOIN product ' +
                                    'ON ' +
                                        'order_item.product_code = product.product_code) AS oiop ' +
                        'ON ' +
                            'production_record.order_code = oiop.order_code ' +
                            'AND production_record.product_code = oiop.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'production_record.worker_code = worker.worker_code ',
            conditionSql =
                'WHERE 2=2 ',
            jsonObj = {
                success: true
            };
        if (productionRecordDateBegin) {
            conditionSql +=
                'AND DATEDIFF(\'d\', production_record.production_record_date, #' + productionRecordDateBegin + '#) <= 0 ';
        }
        if (productionRecordDateEnd) {
            conditionSql +=
                'AND DATEDIFF(\'d\', production_record.production_record_date, #' + productionRecordDateEnd + '#) >= 0 ';
        }
        if (orderCode) {
            conditionSql +=
                'AND production_record.order_code = \'' + orderCode + '\' ';
        }
        if (productCode) {
            conditionSql +=
                'AND production_record.product_code = \'' + productCode + '\' ';
        }
        if (workerCode) {
            conditionSql +=
                'AND production_record.worker_code = \'' + workerCode + '\' ';
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
            name: "productionReport" //非中文
        };
        exportExcelConfig.cols = [{
            caption:'生产记录日期',
            captionStyleIndex: 2,
            type:'string',
            width:12
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
            caption:'计划数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'生产数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'累计完成数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:16
        },{
            caption:'待生产数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:14
        },{
            caption:'合格率(%)',
            captionStyleIndex: 2,
            type:'number',
            width:9
        },{
            caption:'劳动者',
            captionStyleIndex: 2,
            type:'string',
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
            row.push(record.productionRecordDate);
            row.push(record.orderCode);
            row.push(record.productCode);
            row.push(record.productName);
            row.push(record.productDemandNumber);
            row.push(record.finishNumber);
            row.push(record.finishSum);
            row.push(record.lastDemandNumber);
            row.push(record.passRate);
            row.push(record.workerName);
            row.push(record.remark);
            exportExcelConfig.rows.push(row);
        }
        var result = nodeExcel.execute(exportExcelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats; charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI("生产报表") + ".xlsx");
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
    }
};