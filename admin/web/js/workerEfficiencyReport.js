/**
 * 报表查询->劳动效率报表
 */
Ext.define('js.workerEfficiencyReport', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'workerEfficiencyReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'defaultQuery'},
            type: 'ajax', url: 'app/workerEfficiencyReportLogic',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'workerEfficiencyReportOrderStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'workerEfficiencyReportProductStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'workerEfficiencyReportStepStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'queryArrayForComboByProductCode'},
            type: 'ajax', url: 'app/stepReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'workerEfficiencyReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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
            items:[{
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
            items:[{
                xtype: "combo",
                store: 'workerEfficiencyReportOrderStore',
                name: "orderCode",
                fieldLabel: "订单",
                displayField: 'orderCode',
                valueField: 'orderCode',
                maxLength: 20,
                forceSelection: true,
                listeners: {
                    select: function(combo, record, eOpts){
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('workerEfficiencyReportProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'workerEfficiencyReportProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                maxLength: 50,
                forceSelection: true,
                listeners: {
                    select: function(combo, record, eOpts){
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('workerEfficiencyReportStepStore'),
                            proxy = store.getProxy();
                        form.findField('stepCode').reset();
                        proxy.extraParams.productCode = record.get('productCode');
                        store.load();
                    }
                }
            },{
                xtype: "combo",
                store: 'workerEfficiencyReportStepStore',
                name: "stepCode",
                fieldLabel: "工序",
                displayField: 'stepCombo',
                valueField: 'stepCode',
                margin: '0px 0px 0px 10px',
                maxLength: 50,
                forceSelection: true
            }, {
                xtype: "combo",
                store: 'workerEfficiencyReportWorkerStore',
                name: "workerCode",
                fieldLabel: "劳动者",
                displayField: 'workerCombo',
                valueField: 'workerCode',
                maxLength: 50,
                forceSelection: true
            }]
        }, {
            layout: 'column',
            defaults:{
                padding: '0px'
            },
            items:[{
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
                        store = Ext.getStore('workerEfficiencyReportStore');
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
        title: '劳动效率报表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'workerEfficiencyReportStore',
        columns: [{
            text: '工作记录日期',
            dataIndex: 'workRecordDate',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者',
            dataIndex: 'workerName',
            flex: 1,
            align: 'center'
        },{
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
            text: '计件数量(件)',
            dataIndex: 'pieceNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '额定工时',
            dataIndex: 'ratedHours',
            flex: 1,
            align: 'center'
        },{
            text: '实际工时(小时)',
            dataIndex: 'hoursNumber',
            flex: 1,
            align: 'center'
        },{
            text: '备注',
            dataIndex: 'remark',
            flex: 1,
            align: 'center'
        }],
        tbar: ['-', {
            tooltip: '导出Excel',
            iconCls: 'page_excel',
            handler: function(){
                var store = Ext.getStore('workerEfficiencyReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    body: Ext.define('PMS.workerEfficiencyReport.body', {
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
