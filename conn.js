/**
 * $ npm install node-adodb
 * 接口文档:

 ADODB.debug

 全局调试开关。
 ADODB.open(connection)

 初始化数据库链接参数。
 ADODB.query(sql)

 执行有返回值的SQL语句。
 ADODB.execute(sql)

 执行无返回值的SQL语句。
 ADODB.executeScalar(sql, scalar)

 执行带返回标识的SQL语句。
 */


var config = require('./config').config,
    ADODB = require('node-adodb'),
    connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./dataBase/' + config.database + '.mdb;');

// 全局调试开关，默认关闭
ADODB.debug = config.debug;

exports.connection = connection;