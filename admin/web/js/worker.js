/**
 * 基础档案->劳动者
 */
Ext.define('js.worker', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'workerStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/workerReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    editPanel: {
        id: 'workerFormPanel',
        title: '劳动者表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/workerReceive',
        fieldDefaults: {
            labelWidth: 90
        },
        items: [{
            xtype: 'fieldset',
            title: '劳动者属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                xtype: "hiddenfield",
                name: "action",
                value: 'add'
            }, {
                xtype: "textfield",
                name: "workerCode",
                allowBlank: false,
                fieldLabel: "劳动者编码",
                emptyText: '工号编码',
                maxLength: 10
            }, {
                xtype: "textfield",
                name: "workerName",
                allowBlank: false,
                fieldLabel: "劳动者名称",
                maxLength: 10
            }, {
                xtype: "textfield",
                name: "workerPost",
                maxLength: 20,
                fieldLabel: "劳动者岗位"
            },{
                xtype: "datefield",
                name: "attendanceDateStart",
                allowBlank: false,
                fieldLabel: "起始时间",
                format: 'Y-m-d'
            },{
                xtype: "numberfield",
                name: "baseRestNumber",
                maxLength: 10,
                fieldLabel: "调休基数(小时)"
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
            handler: function () {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        waitTitle: '正在保存',
                        waitMsg: '请稍等……',
                        params: {},
                        success: function (form, action) {
                            form.reset();
                            Ext.getStore('workerStore').reload();
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
        url: 'app/workerReceive',
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 70
        },
        items: [{
            name: "workerCode",
            fieldLabel: "劳动者编码",
            maxLength: 10,
            margin: '0px 0px 0px 10px'
        }, {
            name: "workerName",
            fieldLabel: "劳动者名称",
            maxLength: 10,
            margin: '0px 0px 0px 10px'
        }, {
            name: "workerPost",
            fieldLabel: "劳动者岗位",
            maxLength: 20,
            margin: '0px 0px 0px 10px'
        }, {
            xtype: "datefield",
            name: "attendanceDateStart",
            fieldLabel: "起始时间",
            margin: '0px 0px 0px 10px',
            format: 'Y-m-d'
        }, {
            xtype: 'button',
            text: '查询',
            margin: '0px 0px 0px 10px',
            handler: function () {
                var form = this.up('form').getForm(),
                    store = Ext.getStore('workerStore');
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
        title: '劳动者信息列表',
        region: 'center',
        xtype: "grid",
        autoScroll: true,
        store: 'workerStore',
        columns: [{
            text: '工号编码',
            dataIndex: 'workerCode',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者名称',
            dataIndex: 'workerName',
            flex: 1,
            align: 'center'
        }, {
            text: '劳动者岗位',
            dataIndex: 'workerPost',
            flex: 1,
            align: 'center'
        }, {
            text: '起始时间',
            dataIndex: 'attendanceDateStart',
            flex: 1,
            align: 'center'
        }, {
            text: '调休基数(小时)',
            dataIndex: 'baseRestNumber',
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
                    var form = Ext.getCmp('workerFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/workerReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            workerCode: rec.get('workerCode')
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
                                url: 'app/workerReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    workerCode: rec.get('workerCode')
                                },
                                success: function (response, options) {
                                    Ext.getStore('workerStore').reload();
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
        layout: 'border',
        region: 'center'
    },

    body: Ext.define('PMS.worker.body', {
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
