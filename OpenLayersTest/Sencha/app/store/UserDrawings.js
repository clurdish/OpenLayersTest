Ext.define('OpenLayersTest.store.UserDrawings', {
    extend: 'Ext.data.Store',

    requires: [
        'OpenLayersTest.util.WFS',
        'OpenLayersTest.util.Geo'
    ],

    model: 'OpenLayersTest.model.UserDrawing',
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
            transform: function (data) {
                for (var i = 0; i < data.features.length; i++) {
                    var feature = data.features[i],
                        wkt = OpenLayersTest.util.Geo.GeoJSONtoWKT(feature.geometry);

                    data.features[i] = Ext.Object.merge(feature.properties, { geometry: wkt, id: feature.id});
                }
                data = data.features;

                return data;
            }
        }
    },

    addFeatures: function(ids) {
        var url = OpenLayersTest.util.WFS.getRequest({
                url: 'http://localhost:8080/geoserver/wfs',
                request: 'GetFeature',
                outputFormat: 'application/json',
                typeNames: 'global:user_drawings',
                featureID: ids.join(',')
            });
        
        Ext.Ajax.request({
            url: url,
            success: function (response) {
                this.loadRawData(JSON.parse(response.responseText), true);
            }.bind(this)
        });
    }

    
});