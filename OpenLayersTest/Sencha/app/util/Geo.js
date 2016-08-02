Ext.define('OpenLayersTest.util.Geo', {
    extend: 'Ext.Base',
    singleton: true,

    GeoJSONtoWKT: function (geom) {
        var geoJSONFormat = new ol.format.GeoJSON(),
            wktFormat = new ol.format.WKT();

        var geoJSON = geoJSONFormat.readGeometry(geom),
            wkt = wktFormat.writeGeometry(geoJSON);

        return wkt;
    }
});