/**
 * 基础档案->订单
 */
Ext.define('js.order', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'orderStore', model: 'Ext.data.Model', pageSize: 0,
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

    editPanel: {
        id: 'orderFormPanel',
        title: '订单表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/orderReceive',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            xtype: 'fieldset',
            title: '订单属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                xtype: "hiddenfield",
                name: "action",
                value: 'add'
            }, {
                xtype: "textfield",
                name: "orderCode",
                fieldLabel: "订单编码",
                maxLength: 20,
                allowBlank: false
            }, {
                xtype: "textareafield",
                name: "orderDescription",
                fieldLabel: "订单描述",
                maxLength: 200,
                grow: true
            }, {
                xtype: "datefield",
                name: "orderTime",
                fieldLabel: "订单时间",
                format: 'Y-m-d',
                allowBlank: false
            }, {
                xtype: "textareafield",
                name: "orderSource",
                fieldLabel: "订单源",
                maxLength: 50,
                grow: true
            }]
        }],

        buttonAlign: 'center',
        buttons: [{
            text: '重置',
            handler: function () {
                this.up('form').getForm().reset();
            }
        }, {
            text: '保存',
            formBind: true, //only enabled once the form is valid 只有当窗体有效时才启用
            disabled: true,
            handler: function () {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        waitTitle: '正在保存',
                        waitMsg: '请稍等……',
                        params: {},
                        success: function (form, action) {
                            form.reset();
                            Ext.getStore('orderStore').reload();
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert('操作失败', action.result.msg);
                        }
                    });
                }
            }
        }]
    },

    queryPanel: {
        title: '查询条件',
        region: 'north',
        layout: 'column',
        xtype: 'form',
        bodyStyle: 'padding:5px 0px 5px 0px',
        method: 'post',
        url: 'app/orderReceive',
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            name: "orderCode",
            fieldLabel: "订单编码",
            maxLength: 20,
            margin: '0px 0px 0px 10px'
        }, {
            xtype: "datefield",
            name: "orderTime",
            fieldLabel: "订单时间",
            margin: '0px 0px 0px 10px',
            format: 'Y-m-d'
        }, {
            xtype: 'button',
            text: '查询',
            margin: '0px 0px 0px 10px',
            handler: function () {
                var form = this.up('form').getForm(),
                    store = Ext.getStore('orderStore');
                var proxy = store.getProxy();
                if (form.isValid()) {
                    var params = form.getValues();
                    params.action = 'conditionQuery';
                    proxy.extraParams = params;
                    store.load();
                }
            }
        }]
    },

    gridPanel: {
        title: '订单信息列表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'orderStore',
        columns: [{
            text: '订单编码',
            dataIndex: 'orderCode',
            flex: 1,
            align: 'center'
        }, {
            text: '订单描述',
            dataIndex: 'orderDescription',
            flex: 1,
            align: 'center'
        }, {
            text: '订单时间',
            dataIndex: 'orderTime',
            flex: 1,
            align: 'center'
        }, {
            text: '订单源',
            dataIndex: 'orderSource',
            flex: 1,
            align: 'center'
        }, {
            text: '操作',
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'application_form_edit',
                tooltip: '编辑',
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    var form = Ext.getCmp('orderFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/orderReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            orderCode: rec.get('orderCode')
                        },
                        success: function (response, options) {
                            var json = Ext.decode(response.responseText);
                            options.editForm.findField('action').setValue('edit');
                            options.editForm.setValues(json.formValue);
                        },
                        failure: function (response, options) {
                            Ext.Msg.alert('错误', '操作失败！');
                        }
                    });
                }
            }, {
                iconCls: 'delete',
                tooltip: '删除',
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    Ext.Msg.confirm('警告', '该操作将从数据库中删除记录！', function (btn) {
                        if (btn == 'yes') {
                            Ext.Ajax.request({
                                url: 'app/orderReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    orderCode: rec.get('orderCode')
                                },
                                success: function (response, options) {
                                    Ext.getStore('orderStore').reload();
                                },
                                failure: function (response, options) {
                                    Ext.Msg.alert('错误', '操作失败！');
                                }
                            });
                        }
                    });
                }
            }]
        }]
    },

    viewPanel: {
        region: 'center',
        layout: 'border'
    },

    body: Ext.define('PMS.order.body', {
        extend: 'Ext.panel.Panel',
        layout: 'border'
    }),

    constructor: function () {
        var me = this;
        var body = Ext.create(me.body.$className, {
            items: [me.editPanel,
                js.lib.Common.MixObject(me.viewPanel, {items: [me.queryPanel, me.gridPanel]})
            ]
        });
        me.store.load();
        return body;
    }
});
