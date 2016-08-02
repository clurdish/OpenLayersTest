Ext.define('OpenLayersTest.Application', {
    extend: 'Ext.app.Application',
    
    name: 'OpenLayersTest',

    views: [
        'main.Main',
        'map.Map',
        'nav.NavBar',
        'grid.Grid'
    ],
    models: [
        'UserDrawing'
    ],
    stores: [
        'UserDrawings'
    ],
    
    
    launch: function () {
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{ xtype: 'main-view'}]
        });

        var dom = Ext.getDom('appLoadingIndicator');
        dom.parentNode.removeChild(dom);
    }

});
