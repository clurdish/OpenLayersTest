
Ext.define('OpenLayersTest.view.map.MapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map',

    init: function() {
        this.getView().enableBubble('select');
    },

    afterRender: function () {
        var me = this,
            view = me.getView(),
            map = view.map,
            viewModel = view.getViewModel(),
            mapView = map.getView();

        mapView.on('change:resolution', me.onZoom, me);

        /********** Bind layers to ViewModel **********/
        viewModel.bind('{counties}',  function (counties)  { view.counties.setVisible(counties) });
        viewModel.bind('{congress}',  function (congress)  { view.congress.setVisible(congress) });
        viewModel.bind('{zipCodes}',  function (zipCodes)  { view.zipCodes.setVisible(zipCodes) });
        viewModel.bind('{timeZones}', function (timeZones) { view.timeZones.setVisible(timeZones) });
        viewModel.bind('{majorCities}', function (majorCities) { view.majorCities.setVisible(majorCities) });
        viewModel.bind('{drawing}',   function (drawing) {
            view.drawLayer.setVisible(drawing);
            view.drawFeature.setActive(drawing);
        });

        map.on('singleclick', me.onMapClick, me);


        view.dragBox.on('boxstart', function () { view.drawFeature.getFeatures().clear(); });
        view.dragBox.on('boxend', function () { 
            var extent = view.dragBox.getGeometry().getExtent(),
                selectedFeatures = view.drawFeature.getFeatures();

            view.drawSource.forEachFeatureIntersectingExtent(extent, function (feature) {
                selectedFeatures.push(feature);
            });
        });

    },

    closeOverlay: function () {
        console.log(this);
    },

    displayInfo: function (map, coordinate) {
        var layers = map.getLayers(),
            visibleLayers = [],
            mapView = map.getView(),
            resolution = mapView.getResolution(),
            projection = mapView.getProjection(),
            overlay = this.getView().overlay,
            popup = Ext.get('popup-text'),
            popupText = '',
            qLayers = '',
            info, WMSsource;

        layers.forEach(function (layer) {
            if (layer.getVisible())
                visibleLayers.push(layer);
        });

        for (var i = 1; i < visibleLayers.length; i++) {
            var source = visibleLayers[i].getSource();
            if (source instanceof ol.source.TileWMS)
            {
                WMSsource = source;
                qLayers += source.getParams().layers;
                qLayers += ',';
            }
        }

        if (WMSsource)
        {
            qLayers = qLayers.replace(/,+$/, ''); // delete any trailing commas
            info = WMSsource.getGetFeatureInfoUrl(coordinate, resolution, projection, {
                'INFO_FORMAT': 'application/json',
                'QUERY_LAYERS': qLayers,
                'LAYERS': qLayers,
                'EXCEPTIONS': 'application/json'
            });
            Ext.Ajax.request({
                url: info,

                success: function (response, opts) {
                    var parsedResponse = JSON.parse(response.responseText),
                        features = parsedResponse.features;

                    for (i in features) {
                        var layername = features[i].id.split('.')[0],
                            properties = features[i].properties;

                        switch (layername) {
                            case 'ne_10m_populated_places':
                            {
                                city = properties.NAME,
                                country = properties.SOV0NAME;

                                popupText += (city + ', ' + country + '<br>');
                                break;
                            }
                        }
                    }

                    if (popupText) {
                        popup.setHtml(popupText);
                        overlay.getElement().style.display = 'inherit';
                        overlay.setPosition(coordinate);
                    }
                }, // end success

                failure: function (response, opts) {
                    console.log(response);
                }
            });
        }
    },

    onMapClick: function (evt) {
        var map = evt.map,
            drawClick = false;

        map.getInteractions().forEach(function (interaction) {
            if (interaction === map.drawFeature)
                drawClick = true;
        })

        if (!drawClick)
            this.displayInfo(map, evt.coordinate);

    },

    onSelect: function(evt) {
        this.getView().fireEvent('select', this.getView().map, evt);
    },
    
    onZoom: function () {/*
        var view = this.getView(),
            map = view.map,
            mapView = map.getView();

        //console.log("Zoom: " + mapView.getZoom() + " - Resolution: " + mapView.getResolution());*/
    }
});
