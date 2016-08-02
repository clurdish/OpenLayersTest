
Ext.define('OpenLayersTest.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'main-view',
    viewModel: 'main',
    id: 'main-view',

    requires: ['OpenLayersTest.view.main.MainController'],

    controller: 'main',

    listeners: {
        select: 'onSelect'
    },

    layout: {
        type: 'border',
        regionWeights: {
            west: 1,
            north: 0,
            south: -1,
            east: 0
        }
    },

    items: [
        {
            xtype: 'custom-nav-bar',
            width: 330,
            region: 'west'
        },
        {
            xtype: 'ol-map',
            region: 'center',
            
        },
        {
            xtype: 'grid-view',
            region: 'south',
            bind: {
                store: '{userdrawings}'
            }
        }
    ]
});