Ext.require([
    'js.lib.Common',
    'js.notice'
]);
Ext.onReady(function () {

    //不支持IE
    if (Ext.isIE) {
        location.href = 'browser';
        return false;
    }

    Ext.BLANK_IMAGE_URL = 'sdk/ext/build/blank.gif';

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'west',
            collapsible: false,
            border: true,
            width: 300,
            layout: 'fit',
            items: Ext.create('js.menutree')
        }, {
            region: 'center',
            xtype: 'tabpanel',
            activeTab: 0,
            id: 'main_tabpanel',
            defaults: {layout: 'fit'},
            items: [{
                title: '系统状态',
                closable: false,
                items: Ext.create('js.sysStatus')
            }]
        }]
    });
});