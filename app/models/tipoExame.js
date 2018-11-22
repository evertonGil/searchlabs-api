var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nome: String
})
mongoose.model('TipoExame', schema, 'tiposexames');
