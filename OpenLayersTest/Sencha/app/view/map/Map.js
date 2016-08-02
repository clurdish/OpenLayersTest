
Ext.define('OpenLayersTest.view.map.Map', {
    extend: 'Ext.container.Container',
    xtype: 'ol-map',
    alias: 'view.map.Map',
    id: 'map-view',

    controller: 'map',
    viewModel: 'map',

    initComponent: function () {
        var me = this,
            parent = me.up('main-view');

        me.setViewModel(parent.getViewModel());

        var baseResolution = 156543.0339
        me.zoom = [];
        for (var i = 0; i < 20; i++)
            me.zoom[i] = baseResolution / (1 << i);

        this.callParent(arguments);
    },

    listeners: {
        'render': function () { this.launchOL(); },
        'resize': function ( cmp, width , height , oldWidth , oldHeight , eOpts ) { this.resizeMap(width, height); }
    },

    launchOL: function () {
        var me = this,
            bingKey = 'Ar6DWR9lyXp0PwHEN9CR9fCbz84-YxI7uq6A_x0jzAM7OVqeeVUeX1zHBrWQSOsY';

        /*********** Map Instance ***********/

        var innerDiv = me.getEl().dom.childNodes[0].childNodes[0];

        me.map = new ol.Map({
            target: innerDiv.id,
            view: new ol.View({//41.713601, -87.981883 (LatLon)
                center: ol.proj.fromLonLat([-87.9818, 41.7136]),
                zoom: 10
            })
        });


        /************ Controls ************/
        me.map.addControl(new ol.control.FullScreen()); // not fully functional in IE
        me.map.addControl(new ol.control.ScaleLine());

       // me.map.addControl(new ol.control.OverviewMap());


        /*********** Base Layers ***********/

        me.baseLayers = [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
                source: new ol.source.Stamen({ layer: 'terrain' }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.Stamen({ layer: 'watercolor' }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.MapQuest({ layer: 'sat' }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.MapQuest({ layer: 'osm' }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: bingKey,
                    imagerySet: 'Road'
                }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: bingKey,
                    imagerySet: 'AerialWithLabels',
                    maxZoom: 19
                }),
                visible: false
            }),
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: bingKey,
                    imagerySet: 'collinsBart',
                    maxZoom: 19
                }),
                visible: false
            })
        ];

        /******** Additional Layers ********/
        var extent = me.map.getView().calculateExtent(me.map.getSize());

        me.additionalLayers = [
            me.counties = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/wms/us.boundaries',
                    params: {
                        layers: 'us.boundaries:cb_2015_us_county_500k'
                    },
                    serverType: 'geoserver'
                }),
                maxResolution: me.zoom[4]
            }),
            me.congress = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/wms/us.boundaries',
                    params: {
                        layers: 'us.boundaries:cb_2015_us_cd114_5m'
                    }
                }),
                serverType: 'geoserver'
            }),
            me.zipCodes = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/wms/us.boundaries',
                    params: { layers: 'us.boundaries:cb_2015_us_zcta510_500k' }
                }),
                maxResolution: me.zoom[4]
            }),
            me.timeZones = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/wms/global',
                    params: { layers: 'global:ne_10m_time_zones' }
                })
            }),
            me.majorCities = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/wms/global',
                    params: { layers: 'global:ne_10m_populated_places' }
                })
            })
        ];

        /*********** Drawing ***********/

        var getFeature = new ol.format.WFS().writeGetFeature({
            srsName: 'EPSG:4326',
            featureNS: 'http://localhost:56492/Sencha/global', // namespace URI
            featurePrefix: 'global', // workspace
            featureTypes: ['user_drawings'], // layer name (workspace:layer)
            outputFormat: 'application/json'
        });

        me.drawFeature = new ol.interaction.Select(); // default
        me.dragBox = new ol.interaction.DragBox({
            condition: ol.events.condition.platformModifierKeyOnly
        });
        me.map.addInteraction(me.drawFeature);
        me.map.addInteraction(me.dragBox);

        me.drawSource = new ol.source.Vector({
            wrapX: false,
            loader: function(extent) {
                Ext.Ajax.request({
                    method: 'POST',
                    xmlData: new XMLSerializer().serializeToString(getFeature),
                    url: 'http://localhost:8080/geoserver/wfs',
                    success: function (response) {
                        var parsedResponse = JSON.parse(response.responseText),
                            features = new ol.format.GeoJSON().readFeatures(parsedResponse);
                        //console.log(parsedResponse);
                        me.drawSource.addFeatures(features);
                    },

                    failure: function (response) {
                        console.log(response);
                    }
                });
            }
        });

        me.drawLayer = new ol.layer.Vector({
            source: me.drawSource,
            style: this.drawingStyle
        });
       
        me.additionalLayers.push(me.drawLayer);

        
        /*********** Add Layers ***********/
        var combinedLayers = me.baseLayers.concat(me.additionalLayers),
            layerGroup = new ol.layer.Group({ layers: combinedLayers });

        me.map.setLayerGroup(layerGroup);

        /*********** Overlay ***********/
        /*
        me.popup = new Ext.window.Window({
            id: 'popup-window',
            title: 'Info',
            width: 150,
            height: 225,
            constrain: true,
            closeAction: 'hide',
            renderTo: innerDiv,
            items: [
                {

                }
            ]
            
        });

        me.popup.show();
        */
        
        me.popup = document.createElement('DIV');
        me.popup.id = 'popup-window';
        me.popup.className = 'popup-window';

        me.popup.innerHTML = '<span class="close-x" onClick="this.parentNode.style.display =\'none\'">✖</span><h2>Info</h2><span id="popup-text"></span>';

        innerDiv.appendChild(me.popup);
        
        me.overlay = new ol.Overlay({
            element: me.popup,
            positioning: 'top-left',
            autoPan: true,
            autoPanAnimation: { duration: 300 }
        });
        
        me.map.addOverlay(me.overlay);

        /*********** Coordinate Grid ***********/
        //me.graticule = new ol.Graticule({
        //    map: me.map
        //});
        
    },


    resizeMap: function (width, height) {
        var me = this;
        me.map.setSize([width, height]);
        //console.log("resized");
        // TODO add other resizing reactions
      //  me.counties.setExtent(me.map.getView().calculateExtent(me.map.getSize()))
    },

    drawingStyle: function (feature, resolution) {
        var properties = feature.getProperties();

        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: properties.color,
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: properties.color
                })
            })
        });
    }
});
