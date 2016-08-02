
Ext.define('OpenLayersTest.view.nav.NavBar', {
    extend: 'Ext.panel.Panel',

    xtype: 'custom-nav-bar',
    alias: 'view.customnavbar',
    controller: 'navbar',

    title: 'OpenLayers 3: Dev Test',

    ui: 'navigation',
    tabPosition: 'left',
    tabRotation: 0,

    collapsible: true,
    collapseDirection: 'left',

    defaults: {
        bodyPadding: 10
    },

    layout: 'accordion',

    items: [
        {
            title: 'Base Layers',
            xtype: 'panel',
            //width: 100,
            items: [
                {
                    xtype: 'radiogroup',
                   // fieldLabel: 'Base Layer',
                    columns: 1,
                    listeners: {
                        change: 'onBaseChange'
                    },
                    defaults: { name: 'layerIndex' },
                    items: [
                        { boxLabel: 'OpenStreetMap',                     inputValue: 0, checked: true },
                        { boxLabel: 'Stamen Terrain (US only)',          inputValue: 1 },
                        { boxLabel: 'Stamen Watercolor',                 inputValue: 2 },
                        { boxLabel: 'MapQuest Satellite',                inputValue: 3, disabled: true },
                        { boxLabel: 'MapQuest OSM',                      inputValue: 4, disabled: true },
                        { boxLabel: 'Bing Maps Road',                    inputValue: 5 },
                        { boxLabel: 'Bing Maps Labeled Aerial',          inputValue: 6 },
                        { boxLabel: 'Bing Maps: Collins Bart (UK only)', inputValue: 7 }
                    ]
                }
            ]
        },
        {
            title: 'Additional Layers',
            xtype: 'panel',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'U.S. Counties',
                            bind: '{counties}'
                        },
                        {
                            xtype: 'button',
                            text: 'color',
                            margin: '5 20 5 20',
                            menu: [{
                                xtype: 'colorpicker',
                                name: 'layer-0', // required for identifying source
                                listeners: {
                                    select: 'onColorPickLayer'
                                }
                            }]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'U.S. Congressional Districts',
                            bind: '{congress}'
                        },
                        {
                            xtype: 'button',
                            text: 'color',
                            margin: '5 20 5 20',
                            menu: [{
                                xtype: 'colorpicker',
                                name: 'layer-1',
                                listeners: {
                                    select: 'onColorPickLayer'
                                }
                            }]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'U.S. ZIP Codes',
                            bind: '{zipCodes}'
                        },
                        {
                            xtype: 'button',
                            text: 'color',
                            margin: '5 20 5 20',
                            menu: [{
                                xtype: 'colorpicker',
                                name: 'layer-2',
                                listeners: {
                                    select: 'onColorPickLayer'
                                }
                            }]
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'UTC Time Zones',
                            bind: '{timeZones}'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'Populated Cities',
                            bind: '{majorCities}'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Drawing',
            xtype: 'panel',
            items: [
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Drawing Layer',
                    bind: '{drawing}'
                },
                {
                    xtype: 'radiogroup',
                    columns: 2,
                    columnWidth: [100, 100],
                    id: 'draw-type',

                    bind: {
                        disabled: '{!drawing}'
                    },
                    listeners: {
                        change: 'onDrawChange'
                    },
                    defaults: { name: 'drawType', style: 'margin-right: 30px' },
                    items: [
                        { boxLabel: 'None',             inputValue: 'None',       checked: true },
                        { boxLabel: 'Circle',           inputValue: 'Circle',     disabled: false },
                        { boxLabel: 'Point',            inputValue: 'Point',      disabled: false },
                        { boxLabel: 'LineString',       inputValue: 'LineString', disabled: false },
                        { boxLabel: 'Polygon',          inputValue: 'Polygon',    disabled: false },
                        { boxLabel: 'MultiPoint',       inputValue: 'MultiPoint' },
                        { boxLabel: 'MultiLineString',  inputValue: 'MultiLineString' },
                        { boxLabel: 'MultiPolygon',     inputValue: 'MultiPolygon' }
                    ]
                },
                
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    bind: {
                        disabled: '{!drawing}'
                    },
                    defaults: { width: 130, margin: '10 5 10 5' },
                    items: [
                        {
                            xtype: 'button',
                            text: 'color',
                            width: 73,
                            reference: 'drawColor',
                            color: '#5897ce',
                            menu: [{
                                xtype: 'colorpicker',
                                name: 'layer-2',
                                listeners: {
                                    select: 'onColorPickDraw'
                                }
                            }]
                        },
                        /*
                        {
                            xtype: 'button',
                            text: '💾 Save Drawings',
                            cls: 'save-button',
                            handler: 'onSaveFeatures'
                        },*/
                        {
                            xtype: 'button',
                            text: '🚮 Delete Selected',
                            cls: 'delete-button',
                            handler: 'onDeleteSelected'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Potentially More Features'
        }
    ],

    initComponent: function() {
        var me = this,
            parent = me.up('main-view');

        me.setViewModel(parent.getViewModel());

        this.callParent(arguments);
    }
});