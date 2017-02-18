/**
 * 日常记录->物料记录
 */
Ext.define('js.material_record', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'material_recordStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/material_recordReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    orderStore: Ext.create('Ext.data.Store', {
        storeId: 'material_recordOrderStore', model: 'Ext.data.Model', pageSize: 0,
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
        storeId: 'material_recordProductStore', model: 'Ext.data.Model', pageSize: 0,
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

    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'material_recordWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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

    editPanel: {
        id: 'material_recordFormPanel',
        title: '领料记录表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/material_recordReceive',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 90
        },
        items: [{
            xtype: 'fieldset',
            title: '领料记录属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                layout: 'column',
                items: [{
                    xtype: "combo",
                    store: 'material_recordOrderStore',
                    name: "orderCode",
                    fieldLabel: "订单",
                    displayField: 'orderCode',
                    valueField: 'orderCode',
                    forceSelection: true,
                    editable: false,
                    maxLength: 20,
                    listeners: {
                        select: function (combo, record, eOpts) {
                            var form = this.up('form').getForm(),
                                store = Ext.getStore('material_recordProductStore'),
                                proxy = store.getProxy();
                            form.findField('productCode').reset();
                            proxy.extraParams.orderCode = record.get('orderCode');
                            store.load();
                        }
                    }
                }, {
                    xtype: "combo",
                    store: 'material_recordProductStore',
                    name: "productCode",
                    fieldLabel: "产品",
                    displayField: 'productCombo',
                    valueField: 'productCode',
                    maxLength: 50,
                    allowBlank: false,
                    editable: false
                }, {
                    xtype: "combo",
                    store: 'material_recordWorkerStore',
                    name: "workerCode",
                    fieldLabel: "经手人",
                    displayField: 'workerCombo',
                    valueField: 'workerCode',
                    maxLength: 50,
                    allowBlank: false,
                    editable: false
                }]

            }, {
                layout: 'column',
                items: [{
                    xtype: "hiddenfield",
                    name: "action",
                    value: 'add'
                }, {
                    xtype: "hiddenfield",
                    name: "materialRecordId",
                    value: ''
                }, {
                    xtype: "datefield",
                    name: "materialRecordDate",
                    fieldLabel: "领料记录日期",
                    format: 'Y-m-d',
                    editable: false,
                    allowBlank: false,
                    validator: function (value) {
                        var form = this.up('form').getForm(),
                            is_orderTime = form.findField('orderCode');
                        if (is_orderTime.selection) {
                            var orderTime = form.findField('orderCode').selection.raw['orderTime'];
                            if (orderTime > value) {
                                return '领料日期不能早于订单日期,此订单日期为' + orderTime;
                            }
                            return true;
                        }
                        return false;
                    }
                }]

            }, {
                layout: 'column',
                items: [{
                    xtype: "numberfield",
                    name: "pickNumber",
                    fieldLabel: "领取数量",
                    minValue: 0,
                    allowBlank: false
                }, {
                    xtype: "textareafield",
                    name: "remark",
                    fieldLabel: "备注",
                    maxLength: 200,
                    grow: true
                }]

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
                            Ext.getStore('material_recordStore').reload();
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
        layout: 'form',
        xtype: 'form',
        method: 'post',
        url: 'app/material_recordReceive',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 90
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: "datefield",
                name: "materialRecordDate",
                fieldLabel: "领料记录日期",
                format: 'Y-m-d'
            }, {
                xtype: "combo",
                store: 'material_recordOrderStore',
                name: "orderCode",
                fieldLabel: "订单",
                displayField: 'orderCode',
                valueField: 'orderCode',
                maxLength: 20,
                forceSelection: true,
                listeners: {
                    select: function (combo, record, eOpts) {
                        var form = this.up('form').getForm(),
                            store = Ext.getStore('material_recordProductStore'),
                            proxy = store.getProxy();
                        form.findField('productCode').reset();
                        proxy.extraParams.orderCode = record.get('orderCode');
                        store.load();
                    }
                }
            }, {
                xtype: "combo",
                store: 'material_recordProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                margin: '0px 0px 0px 10px',
                maxLength: 50,
                forceSelection: true
            }, {
                xtype: "combo",
                store: 'material_recordWorkerStore',
                name: "workerCode",
                fieldLabel: "经手人",
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
                        store = Ext.getStore('material_recordStore');
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
        title: '领料记录信息列表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'material_recordStore',
        columns: [{
            xtype: "hiddenfield",
            text: 'materialRecordId',
            dataIndex: 'materialRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '领料记录日期',
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
            text: '领取数量',
            dataIndex: 'pickNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '经手人编码',
            dataIndex: 'workerCode',
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
        }, {
            text: '操作',
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'application_form_edit',
                tooltip: '编辑',
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    var form = Ext.getCmp('material_recordFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/material_recordReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            materialRecordId: rec.get('materialRecordId')
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
                                url: 'app/material_recordReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    materialRecordId: rec.get('materialRecordId')
                                },
                                success: function (response, options) {
                                    Ext.getStore('material_recordStore').reload();
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

    body: Ext.define('PMS.material_record.body', {
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
        me.orderStore.load();
        me.productStore.load();
        me.workerStore.load();
        return body;
    }
});

