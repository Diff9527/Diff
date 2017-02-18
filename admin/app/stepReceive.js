/**
 * 工序表数据维护
 * Created by Administrator on 2016/6/23.
 */
var db = require('../../conn').connection;

//查询数据
var query = function (req, res) {
        var sql =
                'SELECT ' +
                    'step_code AS stepCode, ' +
                    'step_name AS stepName, ' +
                    'step.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'step_quota AS stepQuota, ' +
                    'step_caption AS stepCaption ' +
                'FROM ' +
                    'step ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'step.product_code = product.product_code ',
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
        var stepCode = req.body.stepCode,
            stepName = req.body.stepName,
            productCode = req.body.productCode,
            sql =
                'SELECT ' +
                    'step_code AS stepCode, ' +
                    'step_name AS stepName, ' +
                    'step.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'step_quota AS stepQuota, ' +
                    'step_caption AS stepCaption ' +
                'FROM ' +
                    'step ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'step.product_code = product.product_code ' +
                'WHERE ' +
                    'step_code LIKE \'%' + stepCode + '%\' ' +
                    'AND step_name LIKE \'%' + stepName + '%\' ' +
                    'AND step.product_code LIKE \'%' + productCode + '%\' ',
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
        var stepCode = req.body.stepCode,
            sql =
                'SELECT ' +
                    'step_code AS stepCode, ' +
                    'step_name AS stepName, ' +
                    'step.product_code AS productCode, ' +
                    'product.product_name AS productName, ' +
                    'step_quota AS stepQuota, ' +
                    'step_caption AS stepCaption ' +
                'FROM ' +
                    'step ' +
                    'LEFT JOIN product ' +
                        'ON ' +
                            'step.product_code = product.product_code ' +
                'WHERE ' +
                    'step_code = \'' + stepCode + '\' ',
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

    //查询工序对象数据给Combo控件提供数据
    queryForCombo = function (req, res) {
        var sql =
                'SELECT ' +
                    'step_code AS stepCode, ' +
                    'step_name AS stepName, ' +
                    'step_code & \' | \' & step_name AS stepCombo, ' +
                    'step_quota AS stepQuota ' +
                'FROM ' +
                    'step ',
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

    //根据产品编码查询出工序对象数组给Combo控件提供数据
    queryArrayForComboByProductCode = function (req, res) {
        var productCode = req.body.productCode,
            sql =
                'SELECT ' +
                    'step_code AS stepCode, ' +
                    'step_name AS stepName, ' +
                    'step_code & \' | \' & step_name AS stepCombo, ' +
                    'step_quota AS stepQuota ' +
                'FROM ' +
                    'step ' +
                'WHERE ' +
                    'product_code = \'' + productCode + '\' ',
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
        var stepCode = req.body.stepCode,
            stepName = req.body.stepName,
            productCode = req.body.productCode,
            stepQuota = req.body.stepQuota,
            stepCaption = req.body.stepCaption,
            sql =
                'INSERT INTO ' +
                    'step( ' +
                        'step_code, ' +
                        'step_name, ' +
                        'product_code, ' +
                        'step_quota, ' +
                        'step_caption ' +
                    ') ' +
                'VALUES ( ' +
                    '"' + stepCode + '", ' +
                    '"' + stepName + '", ' +
                    '"' + productCode + '", ' +
                    '"' + stepQuota + '", ' +
                    '"' + stepCaption + '") ',
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
        var stepCode = req.body.stepCode,
            stepName = req.body.stepName,
            productCode = req.body.productCode,
            stepQuota = req.body.stepQuota,
            stepCaption = req.body.stepCaption,
            sql =
                'UPDATE ' +
                    'step ' +
                'SET ' +
                    'step_code=\'' + stepCode + '\', ' +
                    'step_name=\'' + stepName + '\', ' +
                    'product_code=\'' + productCode + '\', ' +
                    'step_quota=\'' + stepQuota + '\', ' +
                    'step_caption=\'' + stepCaption + '\' ' +
                'WHERE ' +
                    'step_code = \'' + stepCode + '\' ',
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
        var stepCode = req.body.stepCode,
            sql =
                'DELETE ' +
                'FROM ' +
                    'step ' +
                'WHERE ' +
                    'step_code = \'' + stepCode + '\' ',
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
            case 'queryArrayForComboByProductCode':
                queryArrayForComboByProductCode(req, res);
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