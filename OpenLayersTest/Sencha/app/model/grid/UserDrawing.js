
Ext.define('OpenLayersTest.model.grid.UserDrawing', {
    extend: 'Ext.data.Model',
    alias: 'model.userdrawing',
    fields: [
        { name: 'id',       type: 'int' },
        { name: 'geometry', type: 'string' },
        { name: 'color',    type: 'string' }
    ]
});
