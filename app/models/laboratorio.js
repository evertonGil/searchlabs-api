var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nomeEmpresa: String,
    email: String,
    cnpj: Number,
    senha: String
})
mongoose.model('Laboratorio', schema, 'laboratorios');
