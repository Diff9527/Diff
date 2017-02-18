process.title = 'PMS 生产管理系统';
var moment = require('moment'),
    os = require('os'),
    admin_server = require('./admin/admin_server'),
    cError = require('./error').Error,
    colors = require('colors/safe'),
    conn = require('./conn').connection,
    common = require('./lib/common');

admin_server.start();

var now = moment();
var log_id = now.format('YYYYMMDDHHmmssSSS');
var operation_ip = common.getIPAdress();
var sys_start_time = now.format('YYYY-MM-DD HH:mm:ss:SSS');
var content = sys_start_time + '系统启动!';
conn
    .execute('INSERT INTO system_log(log_id, operation_ip, content) VALUES ("' + log_id + '", "' + operation_ip + '","' + content + '")')
    .on('done', function (data) {
    })
    .on('fail', function (data) {
    });

//console.info('PMS生产管理系统启动完成！~~');
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});