Ext.define('OpenLayersTest.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    requires: ['OpenLayersTest.store.UserDrawings'],

    stores: {
        userdrawings: 'UserDrawings'
    },

    data: {
        counties: false,
        congress: false,
        zipCodes: false,
        timeZones: false,
        majorCities: true,
        drawing: true
    }
});