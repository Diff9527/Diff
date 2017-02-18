Ext.define('js.notice', {
        extend: 'Ext.window.Toast',
        closeOnMouseDown: true,
        header: false,
        align: 't',
        plain: true,
        cls: 'notice',
        bodyCls: 'notice-body',
        paddingY: 0,
        slideInDuration: 100,
        bodyPadding: 5,
        shadow: false,
        listeners: {
            show: function () {
                this.setStyle('height', 'auto');
                this.setBodyStyle('height', 'auto');
            }
        }
    },
    function (Notice) {
        Ext.global.notice = function (message, title, align, iconCls) {
            var config = message,
                notice;

            if (Ext.isString(message)) {
                config = {
                    title: title,
                    html: message,
                    iconCls: iconCls
                };
                if (align) {
                    config.align = align;
                }
            }

            notice = new Notice(config);
            notice.show();
            return notice;
        }
    }
);