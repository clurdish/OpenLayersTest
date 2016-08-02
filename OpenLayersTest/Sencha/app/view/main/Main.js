
Ext.define('OpenLayersTest.view.main.Main', {
    extend: 'Ext.Container',
    xtype: 'main-view',
    viewModel: 'main',
    id: 'main-view',

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
            // menu
            xtype: 'custom-nav-bar',
            width: 330,
            region: 'west'
        },
        {
            //map
            xtype: 'ol-map',
            region: 'center'
        },
        {
            xtype: 'grid-view',
            region: 'south'
        }
            
            
        
    ]
});