/**
 * 物料报表统计查询业务逻辑
 */
var db = require('../../conn').connection,
    nodeExcel = require('excel-export');

//报表默认查询
var defaultQuery = function (req, res) {
        var actionType = req.body.actionType || req.query.actionType || 'grid',
            sql =
                'SELECT ' +
                    'material_record.material_record_id AS materialRecordId, ' +
                    'FORMAT(material_record.material_record_date,\'yyyy-mm-dd\') AS materialRecordDate, ' +
                    'material_record.order_code AS orderCode, ' +
                    'order.order_description AS orderDescription, ' +
                    'FORMAT(order.order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                    'material_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'material_record.pick_number AS pickNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(mr.pick_number)),0,SUM(mr.pick_number)) ' +
                    'FROM ' +
                        'material_record AS mr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', mr.material_record_date, material_record.material_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', mr.material_record_date, order.order_time) <= 0 ' +
                        'AND mr.order_code = material_record.order_code ' +
                        'AND mr.product_code = material_record.product_code) AS pickSum, ' +
                    'material_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'material_record.remark ' +
                'FROM ' +
                    '((material_record ' +
                    'INNER JOIN [order] ' +
                        'ON ' +
                            'material_record.order_code = order.order_code) ' +
                    'INNER JOIN product ' +
                        'ON ' +
                            'material_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'material_record.worker_code = worker.worker_code ',
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
            materialRecordDateBegin = req.body.materialRecordDateBegin || req.query.materialRecordDateBegin,
            materialRecordDateEnd = req.body.materialRecordDateEnd || req.query.materialRecordDateEnd,
            orderCode = req.body.orderCode || req.query.orderCode,
            productCode = req.body.productCode || req.query.productCode,
            workerCode = req.body.workerCode || req.query.workerCode,
            sql =
                'SELECT ' +
                    'material_record.material_record_id AS materialRecordId, ' +
                    'FORMAT(material_record.material_record_date,\'yyyy-mm-dd\') AS materialRecordDate, ' +
                    'material_record.order_code AS orderCode, ' +
                    'order.order_description AS orderDescription, ' +
                    'FORMAT(order.order_time,\'yyyy-mm-dd\') AS orderTime, ' +
                    'material_record.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'material_record.pick_number AS pickNumber, ' +
                    '(SELECT ' +
                        'IIF(ISNULL(SUM(mr.pick_number)),0,SUM(mr.pick_number)) ' +
                    'FROM ' +
                        'material_record AS mr ' +
                    'WHERE ' +
                        'DATEDIFF(\'d\', mr.material_record_date, material_record.material_record_date) >= 0 ' +
                        'AND DATEDIFF(\'d\', mr.material_record_date, order.order_time) <= 0 ' +
                        'AND mr.order_code = material_record.order_code ' +
                        'AND mr.product_code = material_record.product_code) AS pickSum, ' +
                    'material_record.worker_code AS workerCode, ' +
                    'worker.worker_name AS workerName, ' +
                    'material_record.remark ' +
                'FROM ' +
                    '((material_record ' +
                    'INNER JOIN [order] ' +
                        'ON ' +
                            'material_record.order_code = order.order_code) ' +
                    'INNER JOIN product ' +
                        'ON ' +
                            'material_record.product_code = product.product_code) ' +
                    'LEFT JOIN worker ' +
                        'ON ' +
                            'material_record.worker_code = worker.worker_code ',
            conditionSql =
                'WHERE 2=2 ',
            jsonObj = {
                success: true
            };
        if(materialRecordDateBegin){
            conditionSql +=
                'AND DATEDIFF(\'d\', material_record.material_record_date, #' + materialRecordDateBegin + '#) <= 0 ';
        }
        if(materialRecordDateEnd){
            conditionSql +=
                'AND DATEDIFF(\'d\', material_record.material_record_date, #' + materialRecordDateEnd + '#) >= 0 ';
        }
        if(orderCode){
            conditionSql +=
                'AND material_record.order_code = \'' + orderCode + '\' ';
        }
        if(productCode){
            conditionSql +=
                'AND material_record.product_code = \'' + productCode + '\' ';
        }
        if(workerCode){
            conditionSql +=
                'AND material_record.worker_code = \'' + workerCode + '\' ';
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
            name: "materialReport" //非中文
        };
        exportExcelConfig.cols = [{
            caption:'物料记录日期',
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
            width:15
        },{
            caption:'产品名称',
            captionStyleIndex: 2,
            type:'string',
            width:20
        },{
            caption:'领取数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'累计数量(件)',
            captionStyleIndex: 2,
            type:'number',
            width:12
        },{
            caption:'经手人',
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
            row.push(record.materialRecordDate);
            row.push(record.orderCode);
            row.push(record.productCode);
            row.push(record.productName);
            row.push(record.pickNumber);
            row.push(record.pickSum);
            row.push(record.workerName);
            row.push(record.remark);
            exportExcelConfig.rows.push(row);
        }
        var result = nodeExcel.execute(exportExcelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats; charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename="+encodeURI("物料报表")+".xlsx");
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