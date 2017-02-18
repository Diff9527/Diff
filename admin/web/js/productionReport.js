/**
 * 报表查询->生产报表
 */
Ext.define('js.productionReport', {
    //报表表格数据
    store: Ext.create('Ext.data.Store', {
        storeId: 'productionReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'defaultQuery'},
            type: 'ajax', url: 'app/productionReportLogic',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    //查询条件 订单下拉框数据
    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'productionReportOrderStore', model: 'Ext.data.Model', pageSize: 0,
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

    //查询条件 产品下拉框数据 依据订单级联
    productStore: Ext.create('Ext.data.Store', {
        storeId: 'productionReportProductStore', model: 'Ext.data.Model', pageSize: 0,
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

    //查询条件 经手人(劳动者)下拉框数据
    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'productionReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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
                name: "productionRecordDateBegin",
                fieldLabel: "生产记录日期起",
                format: 'Y-m-d'
            }, {
                xtype: "datefield",
                name: "productionRecordDateEnd",
                fieldLabel: "生产记录日期止",
                format: 'Y-m-d'
            }]
        }, {
            layout: 'column',
            items: [{
                xtype: "combo",
                store: 'productionReportOrderStore',
                displayField: 'orderCode',
                valueField: 'orderCode',
                name: "orderCode",
                fieldLabel: "订单",
                forceSelection: true,
                maxLength: 20,
                listeners: {
                    select: function(combo, record, eOpts){
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('productionReportProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'productionReportProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                maxLength: 50,
                forceSelection: true
            }, {
                xtype: "combo",
                store: 'productionReportWorkerStore',
                name: "workerCode",
                fieldLabel: "劳动者",
                displayField: 'workerCombo',
                valueField: 'workerCode',
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
                        store = Ext.getStore('productionReportStore');
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
        title: '生产信息报表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'productionReportStore',
        columns: [{
            xtype: "hiddenfield",
            text: 'productionRecordId',
            dataIndex: 'productionRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '生产记录日期',
            dataIndex: 'productionRecordDate',
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
            text: '计划数量(件)',
            dataIndex: 'productDemandNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '生产数量(件)',
            dataIndex: 'finishNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '累计完成数量(件)',
            dataIndex: 'finishSum',
            flex: 1,
            align: 'center'
        }, {
            text: '待生产数量(件)',
            dataIndex: 'lastDemandNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '合格率(%)',
            dataIndex: 'passRate',
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
            handler: function(){
                var store = Ext.getStore('productionReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    body: Ext.define('PMS.productionReport.body', {
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
