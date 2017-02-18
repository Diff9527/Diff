/**
 * 报表查询->考勤报表
 */
Ext.define('js.attendanceReport', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'attendanceReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'defaultQuery'},
            type: 'ajax', url: 'app/attendanceReportLogic',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    attendanceStore: Ext.create('Ext.data.Store', {
        storeId: 'attendanceReport_Store', model: 'Ext.data.Model', pageSize: 0,
        fields: ['type', 'name'],
        data: [
            {"type": "overtime", "name": "加班"},
            {"type": "rest", "name": "调休"},
            {"type": "holiday", "name": "请假"},
            {"type": "other", "name": "其他"}
        ]
    }),

    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'attendanceReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'queryForCombo'},
            type: 'ajax', url: 'app/workerReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    //查询条件面板配置
    queryPanel: {
        title: '查询条件',
        region: 'north',
        layout: 'form',
        xtype: 'form',
        method: 'post',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 100
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: "datefield",
                name: "attendanceRecordDateBegin",
                fieldLabel: "考勤记录日期起",
                format: 'Y-m-d'
            }, {
                xtype: "datefield",
                name: "attendanceRecordDateEnd",
                fieldLabel: "考勤记录日期止",
                format: 'Y-m-d'
            }]
        }, {
            layout: 'column',
            items: [{
                xtype: "combo",
                store: 'attendanceReport_Store',
                name: "attendanceRecordType",
                fieldLabel: "考勤类型",
                displayField: 'name',
                valueField: 'type',
                forceSelection: true,
                margin: '0px 0px 0px 10px'
            }, {
                xtype: "combo",
                store: 'attendanceReportWorkerStore',
                name: "workerCode",
                fieldLabel: "劳动者",
                displayField: 'workerCombo',
                valueField: 'workerCode',
                margin: '0px 0px 0px 10px',
                maxLength: 50,
                forceSelection: true
            }]
        }, {
            layout: 'column',
            defaults: {
                padding: '0px'
            },
            items: [{
                xtype: 'button',
                text: '清除',
                margin: '0px 5px 0px 42px',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }, {
                xtype: 'button',
                text: '查询',
                handler: function () {
                    var form = this.up('form').getForm(),
                        store = Ext.getStore('attendanceReportStore');
                    var proxy = store.getProxy();
                    if (form.isValid()) {
                        var params = form.getValues();
                        params.action = 'conditionQuery';
                        proxy.extraParams = params;
                        store.load();
                    }
                }
            }]
        }]
    },

    //报表表格面板配置
    gridPanel: {
        title: '考勤信息报表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'attendanceReportStore',
        columns: [{
            xtype: "hiddenfield",
            text: 'attendanceRecordId',
            dataIndex: 'attendanceRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者编码',
            dataIndex: 'workerCode',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者名称',
            dataIndex: 'workerName',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤记录日期',
            dataIndex: 'attendanceRecordDate',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤类型',
            dataIndex: 'attendanceRecordType',
            flex: 1,
            align: 'center',
            renderer: function (value) {
                if (value === 'overtime') {
                    return '加班';
                } else if (value === 'rest') {
                    return '调休';
                } else if (value === 'holiday') {
                    return '请假';
                } else if (value === 'other') {
                    return '其他';
                }
                return value;
            }
        }, {
            text: '时间长度(小时)',
            dataIndex: 'lengthNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '累计加班时长(小时)',
            dataIndex: 'overtimeSum',
            flex: 1,
            align: 'center'
        }, {
            text: '累计调休时长(小时)',
            dataIndex: 'restSum',
            flex: 1,
            align: 'center'
        }, {
            text: '剩余调休时长(小时)',
            dataIndex: 'lastRestSum',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤记录内容体',
            dataIndex: 'attendanceContent',
            flex: 1,
            align: 'center'
        }, {
            text: '备注',
            dataIndex: 'remark',
            flex: 1,
            align: 'center'
        }],
        tbar: ['-', {
            tooltip: '导出Excel',
            iconCls: 'page_excel',
            handler: function(){
                var store = Ext.getStore('attendanceReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    body: Ext.define('PMS.attendanceReport.body', {
        extend: 'Ext.panel.Panel',
        layout: 'border'
    }),

    constructor: function () {
        var me = this;
        var body = Ext.create(me.body.$className, {
            items: [me.queryPanel, me.gridPanel]
        });
        me.store.load();
        me.workerStore.load();
        return body;
    }
});