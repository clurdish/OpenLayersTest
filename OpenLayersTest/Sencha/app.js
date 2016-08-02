
Ext.application({
    name: 'OpenLayersTest',

    extend: 'OpenLayersTest.Application',

    requires: [
        'OpenLayersTest.view.main.Main',
        'OpenLayersTest.view.main.MainViewModel',
        'OpenLayersTest.view.map.Map',
        'OpenLayersTest.view.map.MapController',
        'OpenLayersTest.view.nav.NavBar',
        'OpenLayersTest.view.nav.NavBarController'
    ]
});
