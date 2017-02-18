/**
 * 基础档案->工序
 */
Ext.define('js.step', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'stepStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/stepReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    productStore: Ext.create('Ext.data.Store', {
        storeId: 'stepProductStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'queryForCombo'},
            type: 'ajax', url: 'app/productReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    editPanel: {
        id: 'stepFormPanel',
        title: '工序表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/stepReceive',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            xtype: 'fieldset',
            title: '工序表属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                xtype: "hiddenfield",
                name: "action",
                value: 'add'
            }, {
                xtype: "textfield",
                name: "stepCode",
                fieldLabel: "工序编码",
                emptyText: '工序号',
                maxLength: 20,
                allowBlank: false
            }, {
                xtype: "textfield",
                name: "stepName",
                fieldLabel: "工序名称",
                maxLength: 50,
                allowBlank: false
            }, {
                xtype: "combo",
                store: 'stepProductStore',
                name: "productCode",
                fieldLabel: "产品",
                displayField: 'productCombo',
                valueField: 'productCode',
                maxLength: 20,
                allowBlank: false,
                editable: false
            }, {
                xtype: "numberfield",
                name: "stepQuota",
                fieldLabel: "工序配额",
                emptyText: '标准工时定额',
                minValue: 0,
                allowBlank: false
            }, {
                xtype: "textareafield",
                name: "stepCaption",
                fieldLabel: "工序说明",
                maxLength: 200,
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
                            Ext.getStore('stepStore').reload();
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
        url: 'app/stepReceive',
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 60
        },
        items: [{
            name: "stepCode",
            fieldLabel: "工序编码",
            maxLength: 20,
            margin: '0px 0px 0px 10px'
        }, {
            name: "stepName",
            fieldLabel: "工序名称",
            maxLength: 50,
            margin: '0px 0px 0px 10px'
        }, {
            xtype: "combo",
            store: 'stepProductStore',
            name: "productCode",
            fieldLabel: "产品",
            displayField: 'productCombo',
            valueField: 'productCode',
            margin: '0px 0px 0px 10px',
            maxLength: 20,
            forceSelection: true
        }, {
            xtype: 'button',
            text: '清除',
            margin: '0px 0px 0px 10px',
            handler: function () {
                this.up('form').getForm().reset();
            }
        }, {
            xtype: 'button',
            text: '查询',
            margin: '0px 0px 0px 10px',
            handler: function () {
                var form = this.up('form').getForm(),
                    store = Ext.getStore('stepStore');
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
        title: '工序信息列表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'stepStore',
        columns: [{
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
            text: '工序配额',
            dataIndex: 'stepQuota',
            flex: 1,
            align: 'center'
        }, {
            text: '工序说明',
            dataIndex: 'stepCaption',
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
                    var form = Ext.getCmp('stepFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/stepReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            stepCode: rec.get('stepCode')
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
                                url: 'app/stepReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    stepCode: rec.get('stepCode')
                                },
                                success: function (response, options) {
                                    Ext.getStore('stepStore').reload();
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

    body: Ext.define('PMS.step.body', {
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
        me.productStore.load();
        return body;
    }
});