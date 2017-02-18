/**
 * 报表查询->物料报表
 */
Ext.define('js.materialReport', {
    //报表表格数据
    store: Ext.create('Ext.data.Store', {
        storeId: 'materialReportStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'defaultQuery'},
            type: 'ajax', url: 'app/materialReportLogic',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    //查询条件 订单下拉框数据
    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'materialReportOrderStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'materialReportProductStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'materialReportWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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
                name: "materialRecordDateBegin",
                fieldLabel: "领料记录日期起",
                format: 'Y-m-d'
            }, {
                xtype: "datefield",
                name: "materialRecordDateEnd",
                fieldLabel: "领料记录日期止",
                format: 'Y-m-d'
            }]
        }, {
            layout: 'column',
            items:[{
                xtype: "combo",
                store: 'materialReportOrderStore',
                name: "orderCode",
                fieldLabel: "订单",
                displayField: 'orderCode',
                valueField: 'orderCode',
                maxLength: 20,
                forceSelection: true,
                listeners: {
                    select: function(combo, record, eOpts){
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('materialReportProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'materialReportProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                maxLength: 50,
                forceSelection: true
            }, {
                xtype: "combo",
                store: 'materialReportWorkerStore',
                name: "workerCode",
                fieldLabel: "经手人",
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
                        store = Ext.getStore('materialReportStore');
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
        title: '物料信息报表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'materialReportStore',
        columns: [{
            xtype: "hiddenfield",
            text: 'materialRecordId',
            dataIndex: 'materialRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '物料记录日期',
            dataIndex: 'materialRecordDate',
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
            text: '领取数量(件)',
            dataIndex: 'pickNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '累计数量(件)', //订单内本产品累计数量
            dataIndex: 'pickSum',
            flex: 1,
            align: 'center'
        }, {
            text: '经手人',
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
                var store = Ext.getStore('materialReportStore'),
                    proxy = store.getProxy();
                proxy.extraParams.actionType = 'excel';
                var url = proxy.url + '?' + Ext.Object.toQueryString(proxy.extraParams);
                window.open(url);
            }
        }]
    },

    body: Ext.define('PMS.materialReport.body', {
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