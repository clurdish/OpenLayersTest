
Ext.define('OpenLayersTest.model.UserDrawing', {
    extend: 'Ext.data.Model',
    alias: 'model.userdrawing',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayID', type: 'int', convert: function (par1, record) { return parseInt(record.data.id.split(".")[1]); } },
        { name: 'geometry', type: 'string' },
        { name: 'color',    type: 'string' }
    ]
});
