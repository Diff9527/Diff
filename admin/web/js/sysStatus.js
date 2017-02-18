/**
 * 系统状态
 */
Ext.define('js.sysStatus', {
    extend: 'Ext.container.Container',
    config: {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        listeners: {
            //mouseover:{
            //    element: 'el', //bind to the underlying el property on the panel
            //    fn: function(){
            //        alert('mouseover');
            //    }
            //},
            //click: {
            //    element: 'el', //bind to the underlying el property on the panel
            //    fn: function(){
            //        alert('click');
            //    }
            //},
            //render: function(){ alert('render'); }

        }
    },
    getSysData: function () {
        var _self = this;
        Ext.Ajax.request({
            url: 'app/sysStatus',
            method: 'post',
            _self: _self,
            params: {
                action: 'sysData'
            },
            success: function (response, options) {
                var json = Ext.decode(response.responseText);
                options._self.tplSysData.overwrite(options._self.getComponent(0).getComponent(0).body,json.jsonData);
            },
            failure: function (response, options) {
                Ext.Msg.alert('错误', '操作失败！');
            }
        });
    },
    getSysConfig: function () {
        var _self = this;
        Ext.Ajax.request({
            url: 'app/sysStatus',
            method: 'post',
            _self: _self,
            params: {
                action: 'sysConfig'
            },
            success: function (response, options) {
                var json = Ext.decode(response.responseText);
                options._self.tplSysConfig.overwrite(options._self.getComponent(0).getComponent(1).body,json.jsonData);
            },
            failure: function (response, options) {
                Ext.Msg.alert('错误', '操作失败！');
            }
        });
    },
    tplSysData : new Ext.XTemplate(
        '<p>',
        '<span class="dash-item"><label>系统版本：</label>{sysVersion}</span>',
        '<span class="dash-item"><label>系统启动时间：</label>{sysStartTime}</span>',
        '<span class="dash-item"><label>系统运行时间：</label>{sysRunTime}</span>',
        '</p>',
        '<p><span class="dash-item"><label>日志大小：</label>{frameSize}</span></p>',
        '<p>',
        '<span class="dash-item"><label>服务器内存：</label>{frameSize}</span>',
        '<span class="dash-item"><label>已占用：</label>{frameSize}</span>',
        '<span class="dash-item"><label>空闲：</label>{frameSize}</span>',
        '</p>',
        '<p>',
        '<span class="dash-item"><label>node版本：</label>{nodeVersion}</span>',
        '<span class="dash-item"><label>node占用内存：</label>{nodeRSS}</span>',
        '</p>'
    ),
    tplSysConfig : new Ext.XTemplate(
        '<p><span class="dash-item"><label>设备服务端口：</label>{tmnlServer}</span></p>',
        '<p><span class="dash-item"><label>WebService端口：</label>{webServer}</span></p>',
        '<p><span class="dash-item"><label>广播端口：</label>{broadcast}</span></p>',
        '<p><span class="dash-item"><label>管理界面端口：</label>{adminPort}</span></p>'
    ),
    initComponent: function () {
        var _self = this;
        //_self.getSysData();
        //_self.getSysConfig();
        this.callParent();
    },
    constructor: function () {
        var _self = this;
        _self.items = [{
            layout: {type: 'hbox'},
            defaults: {flex: 1, scrollable: true, padding: 15},
            items: [{
                tpl: _self.tplSysData,data: {}
            }, {
                tpl: _self.tplSysConfig,data: {}
            }]
        }];
        this.callParent();
    }
});