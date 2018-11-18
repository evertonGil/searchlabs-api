var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    favoritos: Array

})
mongoose.model('Usuario', schema, 'usuarios');
