/**
 * 系统状态逻辑
 */
var path = require('path'),
    db = require('../../conn').connection,
    moment = require('moment'),
    package = require('../../package.json'),
    config = require('../../config').config;

//返回的json对象
var jsonObj = {
        success: true
    },

    //获取系统数据
    getSysData = function (req, res) {
        jsonObj.jsonData = {
            sysVersion: package.version,
            nodeVersion: process.version,
            nodeRSS: Math.round(process.memoryUsage().rss/1024/1024*100)/100 + 'MB'
        };
        res.send(jsonObj);
    },

    //获取系统参数
    getSysConfig = function (req, res) {
        jsonObj.jsonData = config;
        res.send(jsonObj);
    };

exports.handler = function (req, res) {
    try {
        var action = req.body.action;
        switch (action) {
            case 'sysData':
                getSysData(req, res);
                break;
            case 'sysConfig':
                getSysConfig(req, res);
                break;
            default:
                jsonObj.success = false;
                res.send(jsonObj);
                break;
        }
    } catch (err) {
        //res.send(cError(err));
    }
};