/**
 * 报表查询->产品效率报表
 */
Ext.define('js.productEfficiencyReport', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'productEfficiencyReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'defaultQuery'},
            type: 'ajax', url: 'app/productEfficiencyReportLogic',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'productEfficiencyReportOrderStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'productEfficiencyReportProductStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'productEfficiencyReportStepStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'productEfficiencyReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 90
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: "combo",
                store: 'productEfficiencyReportOrderStore',
                displayField: 'orderCode',
                valueField: 'orderCode',
                name: "orderCode",
                fieldLabel: "订单",
                forceSelection: true,
                maxLength: 20,
                listeners: {
                    select: function (combo, record, eOpts) {
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('productEfficiencyReportProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'productEfficiencyReportProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
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
                        store = Ext.getStore('productEfficiencyReportStore');
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
        title: '产品效率报表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'productEfficiencyReportStore',
        columns: [{
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
            text: '计件数量(件)',
            dataIndex: 'pieceSum',
            flex: 1,
            align: 'center'
        }, {
            text: '额定工时',
            dataIndex: 'ratedHoursSum',
            flex: 1,
            align: 'center'
        }],
        tbar: ['-', {
            tooltip: '导出Excel',
            iconCls: 'page_excel',
            handler: function () {
                var store = Ext.getStore('productEfficiencyReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    body: Ext.define('PMS.productEfficiencyReport.body', {
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
        me.stepStore.load();
        me.workerStore.load();
        return body;
    }
});
