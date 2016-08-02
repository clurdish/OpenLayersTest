Ext.define('OpenLayersTest.view.grid.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grid',

    /**
     * Called when the view is created
     */
    init: function () {
        
    },

    onCellClick: function (table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        var mapView = Ext.getCmp('map-view'),
            map = mapView.map,
            interaction = mapView.drawFeature,
            features, newSelection, featureExtent, mapExtent;

        if (interaction instanceof ol.interaction.Select)
        {
            features = interaction.getFeatures();
            newSelection = mapView.drawSource.getFeatureById(record.id);
            featureExtent = newSelection.getGeometry().getExtent();
            mapExtent = map.getView().calculateExtent(map.getSize());

            if (!ol.extent.containsExtent(mapExtent, featureExtent))
            {
                var pan = ol.animation.pan({
                    source: map.getView().getCenter(),
                    duration: 800
                });
                map.beforeRender(pan);
                map.getView().setCenter(ol.extent.getCenter(featureExtent));
            }

            features.clear();
            features.push(newSelection);
        }
    }
});