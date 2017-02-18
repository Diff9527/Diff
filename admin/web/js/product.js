/**
 * 基础档案->产品
 */
Ext.define('js.product', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'productStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/productReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    editPanel: {
        id: 'productFormPanel',
        title: '产品表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/productReceive',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            xtype: 'fieldset',
            title: '产品属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                xtype: "hiddenfield",
                name: "action",
                value: 'add'
            }, {
                xtype: "textfield",
                name: "productCode",
                fieldLabel: "产品编码",
                emptyText: '硬件版本号/板号',
                maxLength: 20,
                allowBlank: false
            }, {
                xtype: "textfield",
                name: "productName",
                fieldLabel: "产品名称",
                maxLength: 50,
                allowBlank: false
            }, {
                xtype: "textareafield",
                name: "productCaption",
                fieldLabel: "产品说明",
                //grow: true,
                maxLength: 200
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
                            Ext.getStore('productStore').reload();
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
        url: 'app/productReceive',
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            name: "productCode",
            fieldLabel: "产品编码",
            maxLength: 20,
            margin: '0px 0px 0px 10px'
        }, {
            name: "productName",
            fieldLabel: "产品名称",
            maxLength: 50,
            margin: '0px 0px 0px 10px'
        }, {
            xtype: 'button',
            text: '查询',
            margin: '0px 0px 0px 10px',
            handler: function () {
                var form = this.up('form').getForm(),
                    store = Ext.getStore('productStore');
                var proxy = store.getProxy();
                if (form.isValid()) {
                    var params = form.getFieldValues();
                    params.action = 'conditionQuery';
                    proxy.extraParams = params;
                    store.load();
                }
            }
        }]
    },

    gridPanel: {
        title: '产品信息列表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'productStore',
        columns: [{
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
            text: '产品说明',
            dataIndex: 'productCaption',
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
                    var form = Ext.getCmp('productFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/productReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            productCode: rec.get('productCode')
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
                                url: 'app/productReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    productCode: rec.get('productCode')
                                },
                                success: function (response, options) {
                                    Ext.getStore('productStore').reload();
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

    body: Ext.define('PMS.product.body', {
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

