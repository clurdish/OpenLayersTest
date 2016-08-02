
Ext.define('OpenLayersTest.view.nav.NavBarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.navbar',
    
    init: function () {
        var controller = this;
        document.addEventListener('keydown', function (evt) { if (evt.keyCode === 46) controller.onDeleteSelected(); });
    },
    /********************* BASE *********************/
    onBaseChange: function (field, newValue, oldValue, eOpts) {
        var view = Ext.getCmp('map-view');
        view.baseLayers[oldValue.layerIndex].setVisible(false);
        view.baseLayers[newValue.layerIndex].setVisible(true);
    },


    /************** Additional Layers **************/
    onColorPickLayer: function (picker, selColor) {
        var button = picker.up('button'),
            mapView = Ext.getCmp('map-view'),
            layer = mapView.additionalLayers[picker.name.split('-')[1]],
            source = layer.getSource(),
            params = source.getParams(),
            newColor = '#' + selColor;

        button.setStyle('background-color', newColor);
        params.ENV = "color:" + newColor;

        source.refresh();
    },

    /******************* Drawing *******************/
    changeDrawInteraction: function (mapView, drawType, color) {
        mapView.map.removeInteraction(mapView.drawFeature);
        if (drawType != 'None' && drawType)
        {
            mapView.dragBox.setActive(false);
            mapView.drawFeature = new ol.interaction.Draw({
                source: mapView.drawSource,
                type: drawType,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.5]
                    }),
                    stroke: new ol.style.Stroke({
                        color: color
                    }),
                    image: new ol.style.Circle({
                        radius: 6,
                        fill: new ol.style.Fill({ color: color }),
                        stroke: null
                    })
                })
            });
            
            mapView.drawFeature.on('drawend', this.onDrawEnd, this);
        }
        else
        {
            mapView.drawFeature = new ol.interaction.Select();
            mapView.dragBox.setActive(true);
        }
           
        mapView.map.addInteraction(mapView.drawFeature);
    },
   
    onColorPickDraw: function (picker, selColor) {
        var button = picker.up('button'),
            newColor = '#' + selColor,
            mapView = Ext.getCmp('map-view'),
            draw = mapView.drawFeature,
            type = draw.type_;

        button.setStyle('background-color', newColor);
        button.color = newColor;
        
        this.changeDrawInteraction(mapView, type, newColor);
    },

    onDeleteSelected: function () {
        var mapView = Ext.getCmp('map-view'),
            select = mapView.drawFeature;
        
        if(select instanceof ol.interaction.Select/* && mapView.getViewModel().get('drawing')*/)
        {
            var features = select.getFeatures().getArray();
            if (features.length > 0)
            {
                this.drawingTransaction(features, 'delete');
                select.getFeatures().clear();
            }
        }
    },

    onDrawChange: function (field, newValue, oldValue, eOpts) {
        var mapView = Ext.getCmp('map-view'),
            map = mapView.map,
            drawType = newValue.drawType,
            color = this.lookupReference('drawColor').color;

        this.changeDrawInteraction(mapView, drawType, color);
    },

    onDrawEnd: function (event) {
        var mapView = Ext.getCmp('map-view'),
            feature = event.feature;
            color = this.lookupReference('drawColor').color,
            properties = feature.getProperties();

        if(properties.geometry instanceof ol.geom.Circle)
        {
            var geom = feature.getGeometry(),
                sides = 64,
                polygon = ol.geom.Polygon.fromCircle(geom, sides);
            properties.geometry = polygon;
        }

        properties.color = color;
        feature.setProperties(properties);

        this.drawingTransaction([feature], 'insert');

    },

    drawingTransaction: function (features, type) {
        var mapView = Ext.getCmp('map-view'),
            wfs = new ol.format.WFS(),
            options = {         
                featureNS: 'http://localhost:56492/Sencha/global', // namespace URI
                featurePrefix: 'global', // workspace
                featureType: 'user_drawings', // layer name (workspace:layer)
                srsName: 'EPSG:4326'
            }, 
            transaction;

        switch(type)
        {
            case 'insert':
                transaction = wfs.writeTransaction(features, null, null, options);
                break;
            case 'update':
                transaction = wfs.writeTransaction(null, features, null, options);
                break;
            case 'delete':
                transaction = wfs.writeTransaction(null, null, features, options);
                break;
        }
        
        Ext.Ajax.request({
            method: 'POST',
            xmlData: new XMLSerializer().serializeToString(transaction),
            url: 'http://localhost:8080/geoserver/wfs',
            success: function (response) {
                mapView.drawSource.clear();
                var store = Ext.getCmp('userDrawingsGrid').getStore();

                if(type === 'insert')
                {
                    var rText = response.responseText,
                        ids = [],
                        idAttributes = rText.match(/fid=".*"/g);

                    for (var i = 0; i < idAttributes.length; i++) {
                        var id = idAttributes[i].replace(/fid="|"/g, '').split('.')[1];
                        ids.push(id);
                    }
                    
                    store.source.addFeatures(ids);
                }
                if(type === 'delete')
                {
                    var tags = transaction.getElementsByTagName('FeatureId');

                    for (var i = 0; i < tags.length; i++)
                    {
                        var id = tags[i].getAttribute('fid').split('.')[1],
                            record = store.getById(id);
                        store.remove(record);
                    }
                    
                }
            },
            failure: function (response) {
                console.log(response);
            }
        });
    },
    /*
    onSaveFeatures: function () {
        //var mapView = Ext.getCmp('map-view');

        //mapView.drawSource.clear();
    },
    */
    uniqueID: (function () { var id = 0; return function () { return id++; }})()
});
