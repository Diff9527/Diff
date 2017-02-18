/**
 * 日常记录->工作报表
 */
Ext.define('js.work_recordReport', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'work_recordReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/work_recordReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'work_recordReportOrderStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/orderReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    productStore: Ext.create('Ext.data.Store', {
        storeId: 'work_recordReportProductStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'queryArrayForComboByOrderCode'},
            type: 'ajax', url: 'app/productReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    stepStore: Ext.create('Ext.data.Store', {
        storeId: 'work_recordReportStepStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'queryForCombo'},
            type: 'ajax', url: 'app/stepReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'work_recordReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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

    queryPanel: {
        title: '查询条件',
        region: 'north',
        layout: 'form',
        xtype: 'form',
        method: 'post',
        url: 'app/work_recordReportReceive',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 100
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: "datefield",
                name: "workRecordDateBegin",
                fieldLabel: "工作记录日期起",
                format: 'Y-m-d'
            }, {
                xtype: "datefield",
                name: "workRecordDateEnd",
                fieldLabel: "工作记录日期止",
                format: 'Y-m-d'
            }]
        }, {
            layout: 'column',
            items: [{
                xtype: "combo",
                store: 'work_recordReportOrderStore',
                name: "orderCode",
                fieldLabel: "订单",
                displayField: 'orderCode',
                valueField: 'orderCode',
                maxLength: 20,
                forceSelection: true,
                listeners: {
                    select: function (combo, record, eOpts) {
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('work_recordReportProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'work_recordReportProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                maxLength: 50,
                forceSelection: true,
                listeners: {
                    select: function (combo, record, eOpts) {
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('work_recordReportStepStore'),
                            proxy = store.getProxy();
                        form.findField('stepCode').reset();
                        proxy.extraParams.productCode = record.get('productCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'work_recordReportWorkerStore',
                name: "workerCode",
                fieldLabel: "劳动者",
                displayField: 'workerCombo',
                valueField: 'workerCode',
                maxLength: 50,
                forceSelection: true
            }]
        }, {
            layout: 'column',
            items: [{
                xtype: "combo",
                store: 'work_recordReportStepStore',
                name: "stepCode",
                fieldLabel: "工序",
                displayField: 'stepCombo',
                valueField: 'stepCode',
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
                margin: '0px 5px 0px 93px',
                handler: function () {
                    this.up('form').getForm().reset();
                }
            }, {
                xtype: 'button',
                text: '查询',
                margin: '0px 0px 0px 10px',
                handler: function () {
                    var form = this.up('form').getForm(),
                        store = Ext.getStore('work_recordReportStore');
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

    gridPanel: {
        title: '工作记录信息列表',
        region: 'center',
        xtype: "grid",
        store: 'work_recordReportStore',
        autoScroll: true,
        columns: [{
            xtype: "hiddenfield",
            text: 'workRecordId',
            dataIndex: 'workRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '工作记录日期',
            dataIndex: 'workRecordDate',
            flex: 1,
            align: 'center'
        }, {
            text: '订单编码',
            dataIndex: 'orderCode',
            flex: 1,
            align: 'center'
        }, {
            text: '产品编码',
            dataIndex: 'productCode',
            flex: 1,
            align: 'center'
        }, {
            text: '产品名称',
            dataIndex: 'productName',
            flex: 1,
            align: 'center'
        }, {
            text: '工序编码',
            dataIndex: 'stepCode',
            flex: 1,
            align: 'center'
        }, {
            text: '工序名称',
            dataIndex: 'stepName',
            flex: 1,
            align: 'center'
        }, {
            text: '工序配额',
            dataIndex: 'stepQuota',
            flex: 1,
            align: 'center'
        }, {
            text: '计件数量',
            dataIndex: 'pieceNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '合格率(%)',
            dataIndex: 'passRate',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者编码',
            dataIndex: 'workerCode',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者',
            dataIndex: 'workerName',
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
            handler: function () {
                var store = Ext.getStore('work_recordReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    viewPanel: {
        layout: 'border',
        region: 'center'
    },

    body: Ext.define('PMS.work_recordReport.body', {
        extend: 'Ext.panel.Panel',
        layout: 'border'
    }),

    constructor: function () {
        var me = this;
        var body = Ext.create(me.body.$className, {
            items: [me.queryPanel, me.gridPanel]
        });
        me.store.load();
        me.orderStore.load();
        me.workerStore.load();
        return body;
    }
});
