Ext.define('OpenLayersTest.util.WFS', {
    extend: 'Ext.Base',
    singleton: true,

    getRequest: function (opt) {
        if (!opt)
            return '';

        var properties = Ext.Object.getAllKeys(opt),//Object.getOwnPropertyNames(opt),
            handled = ['version', 'url'],
            encodedProperties = [],
            url, result;

        url = (opt.url || '');
        encodedProperties.push('version=' + (opt.version || '2.0.0'));

        for (var i = 0; i < properties.length; i++) {
            if (!(properties[i] in handled))
                encodedProperties.push(properties[i] + '=' + (encodeURIComponent(opt[properties[i]]) || ' '));
        }
        result = url.concat('?service=wfs&', encodedProperties.join('&'));


        return result;
    }
});