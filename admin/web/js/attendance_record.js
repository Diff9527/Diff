/**
 * 日常记录->考勤记录
 */
Ext.define('js.attendance_record', {
    store: Ext.create('Ext.data.Store', {
        storeId: 'attendance_recordStore', model: 'Ext.data.Model', pageSize: 0,
        proxy: {
            extraParams: {action: 'query'},
            type: 'ajax', url: 'app/attendance_recordReceive',
            actionMethods: {read: 'POST'},
            reader: {
                type: 'json',
                root: 'jsonData'
            }
        }
    }),

    attendanceStore: Ext.create('Ext.data.Store', {
        storeId: 'attendance_Store', model: 'Ext.data.Model', pageSize: 0,
        fields: ['type', 'name'],
        data: [
            {'type': 'overtime', 'name': '加班'},
            {'type': 'rest', 'name': '调休'},
            {'type': 'holiday', 'name': '请假'},
            {'type': 'other', 'name': '其他'}
        ]
    }),

    workerStore: Ext.create('Ext.data.Store', {
        storeId: 'attendance_recordWorkerStore', model: 'Ext.data.Model', pageSize: 0,
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
        id: 'attendance_recordFormPanel',
        title: '考勤记录表单信息',
        xtype: 'form',
        region: 'north',
        layout: 'form',
        method: 'post',
        url: 'app/attendance_recordReceive',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 100
        },
        items: [{
            xtype: 'fieldset',
            title: '考勤记录属性',
            autoHeight: true,
            autoScroll: true,
            collapsible: true,
            items: [{
                layout: 'column',
                items: [{
                    xtype: 'combo',
                    store: 'attendance_Store',
                    name: 'attendanceRecordType',
                    fieldLabel: '考勤记录类型',
                    displayField: 'name',
                    valueField: 'type',
                    allowBlank: false,
                    editable: false
                }, {
                    xtype: 'combo',
                    store: 'attendance_recordWorkerStore',
                    name: 'workerCode',
                    fieldLabel: '被考勤劳动者',
                    displayField: 'workerCombo',
                    valueField: 'workerCode',
                    maxLength: 50,
                    allowBlank: false,
                    editable: false
                }]
            }, {
                layout: 'column',
                items: [{
                    xtype: 'hiddenfield',
                    name: 'action',
                    value: 'add'
                }, {
                    xtype: 'hiddenfield',
                    name: 'attendanceRecordId',
                    value: ''
                }, {
                    xtype: 'datefield',
                    name: 'attendanceRecordDate',
                    fieldLabel: '考勤记录日期',
                    format: 'Y-m-d',
                    allowBlank: false,
                    editable: false,
                    validator: function (value) {
                        var form = this.up('form').getForm(),
                            workerCodeCpm = form.findField('workerCode');
                        if (workerCodeCpm.selection) {
                            var attendanceDateStart = workerCodeCpm.selection.raw['attendanceDateStart'];
                            var workerCombo = workerCodeCpm.selection.raw['workerCombo'];
                            if (attendanceDateStart > value) {
                                return '考勤日期不能早于统计['+workerCombo+']起始日期'+attendanceDateStart;
                            }
                            return true;
                        }
                        return false;
                    }
                },{
                    xtype: 'numberfield',
                    name: 'lengthNumber',
                    fieldLabel: '时间长度(小时)',
                    allowBlank: false,
                    minValue: 0
                }]
            }, {
                layout: 'column',
                items: [{
                    xtype: 'textareafield',
                    name: 'attendanceContent',
                    fieldLabel: '考勤记录内容体',
                    grow: true,
                    maxLength: 200
                }, {
                    xtype: 'textareafield',
                    name: 'remark',
                    fieldLabel: '备注',
                    grow: true,
                    maxLength: 200
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
                            Ext.getStore('attendance_recordStore').reload();
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
        url: 'app/attendance_recordReceive',
        fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 90
        },
        items: [{
            layout: 'column',
            items: [{
                xtype: 'datefield',
                name: 'attendanceRecordDate',
                fieldLabel: '考勤记录日期',
                format: 'Y-m-d'
            }, {
                xtype: 'combo',
                store: 'attendance_Store',
                name: 'attendanceRecordType',
                fieldLabel: '考勤记录类型',
                displayField: 'name',
                valueField: 'type',
                forceSelection: true,
                maxLength: 10,
                margin: '0px 0px 0px 10px'
            }, {
                xtype: 'combo',
                store: 'attendance_recordWorkerStore',
                name: 'workerCode',
                fieldLabel: '被考勤劳动者',
                displayField: 'workerCombo',
                valueField: 'workerCode',
                margin: '0px 0px 0px 10px',
                maxLength: 10,
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
                        store = Ext.getStore('attendance_recordStore');
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
        title: '考勤记录信息列表',
        region: 'center',
        xtype: 'grid',
        autoScroll: true,
        store: 'attendance_recordStore',
        columns: [{
            xtype: 'hiddenfield',
            text: 'attendanceRecordId',
            dataIndex: 'attendanceRecordId',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤记录日期',
            dataIndex: 'attendanceRecordDate',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤记录类型',
            dataIndex: 'attendanceRecordType',
            flex: 1,
            align: 'center',
            renderer: function (value) {
                if (value === 'overtime') {
                    return '加班';
                } else if (value === 'rest') {
                    return '调休';
                } else if (value === 'holiday') {
                    return '请假';
                } else if (value === 'other') {
                    return '其他';
                }
                return value;
            }
        }, {
            text: '被考勤劳动者编码',
            dataIndex: 'workerCode',
            flex: 1,
            align: 'center'
        }, {
            text: '被考勤劳动者',
            dataIndex: 'workerName',
            flex: 1,
            align: 'center'
        }, {
            text: '时间长度(小时)',
            dataIndex: 'lengthNumber',
            flex: 1,
            align: 'center'
        }, {
            text: '考勤记录内容体',
            dataIndex: 'attendanceContent',
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
                    var form = Ext.getCmp('attendance_recordFormPanel').getForm();
                    Ext.Ajax.request({
                        url: 'app/attendance_recordReceive',
                        method: 'post',
                        editForm: form,
                        params: {
                            action: 'queryByPK',
                            attendanceRecordId: rec.get('attendanceRecordId')
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
                                url: 'app/attendance_recordReceive',
                                method: 'post',
                                params: {
                                    action: 'del',
                                    attendanceRecordId: rec.get('attendanceRecordId')
                                },
                                success: function (response, options) {
                                    Ext.getStore('attendance_recordStore').reload();
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

    body: Ext.define('PMS.attendance_record.body', {
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
        me.workerStore.load();
        return body;
    }
});