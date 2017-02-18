/**
 * 菜单树
 */
Ext.define('js.menutree', {
    constructor: function (opts) {
        return {
            xtype: 'treepanel', useArrows: true,
            store: {
                root: {
                    text: '生产管理系统',
                    expanded: true,
                    children: [{
                        text: '报表查询', leaf: false, name: 'reportQuery',
                        expanded: true,
                        children: [
                            {text: '物料报表', leaf: true, name: 'materialReport'},
                            {text: '生产报表', leaf: true, name: 'productionReport'},
                            {text: '考勤报表', leaf: true, name: 'attendanceReport'},
                            //{text: '工作报表', leaf: true, name: 'work_recordReport'},
                            {text: '产品效率报表', leaf: true, name: 'productEfficiencyReport'},
                            {text: '劳动效率报表', leaf: true, name: 'workerEfficiencyReport'}
                        ]
                    }, {
                        text: '日常记录', leaf: false, name: 'dailyRecord',
                        expanded: true,
                        children: [
                            {text: '物料记录', leaf: true, name: 'material_record'},
                            {text: '生产记录', leaf: true, name: 'production_record'},
                            {text: '考勤记录', leaf: true, name: 'attendance_record'},
                            {text: '工作记录', leaf: true, name: 'work_record'}
                        ]
                    }, {
                        text: '基础档案', leaf: false, name: 'baseArchive',
                        expanded: true,
                        children: [
                            {text: '产品', leaf: true, name: 'product'},
                            {text: '工序', leaf: true, name: 'step'},
                            {text: '订单', leaf: true, name: 'order'},
                            {text: '订单明细', leaf: true, name: 'order_item'},
                            {text: '劳动者', leaf: true, name: 'worker'}
                        ]
                    }, {
                        text: '系统设置', leaf: false, name: 'systemConfig',
                        children: [
                            {text: '功能测试', leaf: true, name: 'testPage'}
                        ]
                    }]
                }
            },
            listeners: {
                itemclick: this.openTab
            }
        }
    },
    openTab: function (view, record, item, index, e, eOpts) {
        var tabpanel = Ext.getCmp('main_tabpanel'), tabId = 'tabpanel' + record.get('id'), tabTitle = record.get('text');
        if (record.isRoot()) {
            tabpanel.setActiveTab(0);
        } else if (Ext.getCmp(tabId)) {
            Ext.getCmp(tabId).show();
        } else {
            tabpanel.add({
                id: tabId, title: tabTitle, closable: true, scrollable: true,
                items: Ext.create('js.' + record.get('name'))
            }).show();
        }
    }
});