 /**
 * 系统配置文件
 */

//1秒，1分钟，1小时
var sec = 1000, min = 60 * sec, hr = 60 * min,
    sysConfig = {
        sec: sec,//1秒
        min: min,//1分钟
        hr: hr,//1小时

        //数据库调试模式
        //dbDebug: ['ComQueryPacket'],
        //数据库连接池最大容量
        //connectionLimit: 10,
        //数据库地址
        //host: '127.0.0.1',
        //数据库用户名
        //user: 'root',
        //数据库密码
        //password: 'root',
        //数据库表名
        database: 'PMS_data',

        //web访问界面端口
        adminPort: 9110,

        //相关日志目录
        sys_log: 'logs/sys',
        sys_alert: 'logs/sys',
        sys_err: 'logs/sys',
        sys_packets: 'logs/packets',

        //调试开关
        debug: true
    };

exports.config = sysConfig;
