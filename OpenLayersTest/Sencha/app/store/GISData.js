Ext.define('OpenLayersTest.store.GISData', {
    extend: 'Ext.data.Store',

    requires: ['OpenLayersTest.util.WFS'],

    model: 'OpenLayersTest.model.grid.UserDrawing',
    autoLoad: true,
    listeners: {
        beforeLoad: function (store, operation, eOpts) {
            var proxy = store.getProxy();

            proxy.url = OpenLayersTest.util.WFS.getRequest({
                url: 'http://localhost:8080/geoserver/wfs',
                request: 'GetFeature',
                outputFormat: 'application/json',
                typeNames: 'global:user_drawings'
            });
        }
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            transform: {
                fn: function (data) {
                    var geoJSONFormat = new ol.format.GeoJSON(),
                        wktFormat = new ol.format.WKT();

                    for (var i = 0; i < data.features.length; i++) {
                        var feature = data.features[i],
                            geo = geoJSONFormat.readFeature(feature),
                            wkt = wktFormat.writeFeature(geo),
                            color = feature.properties,
                            id = parseInt(feature.id.split('.')[1]);

                        data.features[i] = Ext.Object.merge(feature.properties, { geometry: wkt, id: id });//Object.assign(feature.properties, { geometry: wkt, id: id });
                    }
                    data = data.features;
                    return data;
                }
            }
        }
    },

    addFeatures: function(ids) {
        var store = this,
            url = OpenLayersTest.util.WFS.getRequest({
                url: 'http://localhost:8080/geoserver/wfs',
                request: 'GetFeature',
                outputFormat: 'application/json',
                typeNames: 'global:user_drawings',
                featureID: ids.join(',')
            });
        
        Ext.Ajax.request({
            url: url,
            success: function (response) {
                store.loadRawData(JSON.parse(response.responseText), true);
            }
        });
    }

    
});