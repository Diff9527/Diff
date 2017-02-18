/**
 * 产品效率报表统计查询业务逻辑
 */
var db = require('../../conn').connection,
    nodeExcel = require('excel-export');

//报表默认查询
var defaultQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
            sql =
                'SELECT ' +
                    'opt_wr.order_code AS orderCode, ' +
                    'opt_wr.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'opt_wr.pieceSum, ' +
                    'opt_wr.ratedHoursSum ' +
                'FROM ' +
                    '((SELECT ' +
                        'work_record.order_code, ' +
                        'work_record.product_code, ' +
                        'IIF(ISNULL(SUM(work_record.piece_number)),0,SUM(work_record.piece_number))  AS pieceSum, ' +
                        'IIF(ISNULL(SUM(work_record.piece_number/step.step_quota)),0,ROUND(SUM(work_record.piece_number/step.step_quota),2)) AS ratedHoursSum ' +
                    'FROM ' +
                        '((work_record ' +
                        'INNER JOIN [order] ' +
                            'ON ' +
                                'work_record.order_code = order.order_code) ' +
                        'INNER JOIN product ' +
                            'ON ' +
                                'work_record.product_code = product.product_code) ' +
                        'INNER JOIN step ' +
                        'ON ' +
                        'work_record.step_code = step.step_code ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', work_record.work_record_date, order.order_time) <= 0 ' +
                    'GROUP BY ' +
                        'work_record.order_code, ' +
                        'work_record.product_code) AS opt_wr ' +
                'INNER JOIN [order] ' +
                    'ON ' +
                        'opt_wr.order_code = order.order_code) ' +
                'INNER JOIN product ' +
                    'ON ' +
                        'opt_wr.product_code = product.product_code ',
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
            orderCode = req.body.orderCode || req.query.orderCode,
            productCode = req.body.productCode || req.query.productCode,
            sql =
                sql =
                    'SELECT ' +
                        'opt_wr.order_code AS orderCode, ' +
                        'opt_wr.product_code AS productCode, ' +
                        'product.product_name AS productName, ' +
                        'opt_wr.pieceSum, ' +
                        'opt_wr.ratedHoursSum ' +
                    'FROM ' +
                        '((SELECT ' +
                            'work_record.order_code, ' +
                            'work_record.product_code, ' +
                            'IIF(ISNULL(SUM(work_record.piece_number)),0,SUM(work_record.piece_number))  AS pieceSum, ' +
                            'IIF(ISNULL(SUM(work_record.piece_number/step.step_quota)),0,ROUND(SUM(work_record.piece_number/step.step_quota),2)) AS ratedHoursSum ' +
                        'FROM ' +
                            '((work_record ' +
                            'INNER JOIN [order] ' +
                                'ON ' +
                                    'work_record.order_code = order.order_code) ' +
                            'INNER JOIN product ' +
                                'ON ' +
                                    'work_record.product_code = product.product_code) ' +
                            'INNER JOIN step ' +
                                'ON ' +
                                    'work_record.step_code = step.step_code ' +
                        'WHERE ' +
                            'DATEDIFF(\'d\', work_record.work_record_date, order.order_time) <= 0 ' +
                        'GROUP BY ' +
                            'work_record.order_code, ' +
                            'work_record.product_code) AS opt_wr ' +
                    'INNER JOIN [order] ' +
                        'ON ' +
                            'opt_wr.order_code = order.order_code) ' +
                    'INNER JOIN product ' +
                        'ON ' +
                            'opt_wr.product_code = product.product_code ',
            conditionSql =
                'WHERE 2=2 ',
            jsonObj = {
                success: true
            };
        if (orderCode) {
            conditionSql +=
                'AND opt_wr.order_code = \'' + orderCode + '\' ';
        }
        if (productCode) {
            conditionSql +=
                'AND opt_wr.product_code = \'' + productCode + '\' ';
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
            name: "productEfficiencyReport" //非中文
        };
        exportExcelConfig.cols = [{
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
            caption:'计件数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'额定工时',
            captionStyleIndex: 2,
            type:'number',
            width:8
        }];
        exportExcelConfig.rows = [];
        while (data.records.length){
            record = data.records.shift();
            row = [];
            row.push(record.orderCode);
            row.push(record.productCode);
            row.push(record.productName);
            row.push(record.pieceSum);
            row.push(record.ratedHoursSum);
            exportExcelConfig.rows.push(row);
        }
        var result = nodeExcel.execute(exportExcelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats; charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI("产品效率报表") + ".xlsx");
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