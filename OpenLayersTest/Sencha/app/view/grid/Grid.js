Ext.define('OpenLayersTest.view.grid.Grid', {
    extend: 'Ext.grid.GridPanel',
    id: 'userDrawingsGrid',
    title: 'Geospatial Data - User Drawings',
    xtype: 'grid-view',
    requires: [
        //'OpenLayersTest.view.grid.GridViewModel',
        'OpenLayersTest.view.grid.GridController'
    ],
    plugins: 'gridfilters',

    controller: 'grid',
    
    listeners: {
        cellclick: 'onCellClick'
    },

    height: 300,
    collapsible: true,
    collapsed: true,

    columns: [
        {
            text: 'ID',
            dataIndex: 'displayID',
            filter: {
                type: 'number'
            }
        },
        {
            text: 'WKT Geometry',
            dataIndex: 'geometry',
            flex: 1,
            filter: {
                type: 'string'
            }
        },
        {
            text: 'Color',
            dataIndex: 'color',
            filter: {
                type: 'string'
            }
        }
    ]
});