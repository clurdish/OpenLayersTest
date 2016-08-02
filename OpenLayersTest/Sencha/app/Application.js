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
        'grid.UserDrawing'
    ],
    stores: [
        'GISData'
    ],
    
    
    launch: function () {
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'fit'
        });

        var container = Ext.create('OpenLayersTest.view.main.Main');
        viewport.add(container);

        var dom = Ext.getDom('appLoadingIndicator');
        dom.parentNode.removeChild(dom);
    }

});
