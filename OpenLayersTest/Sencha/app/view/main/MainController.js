Ext.define('OpenLayersTest.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    onSelect: function (map, evt) {
        var grid = this.getView().down('grid-view'),
            store = grid.getStore(),
            model = grid.getSelectionModel(),
            records = [];


        for (var i = 0; i < evt.selected.length; i++) {
            var id = evt.selected[i].getId(),
                record = store.getById(id);
            records.push(record);
        }

        if (records.length > 0)
            model.select(records);
        else
            model.deselectAll();
    }
});