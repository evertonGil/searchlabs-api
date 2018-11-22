var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nome: String,
    razaoSocial: String,
    email: String,
    cnpj: Number,
    logotipo: String,
    fotoLaboratorios: String,
    senha: String,
    logradouro: String,
    complemento: String,
    cep: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    telefone1: String,
    telefone2: String,
    exames: [{
        id: String,
        descricao: String,
        idTiposExame: String, 
        valor: String
    }]

})
mongoose.model('Laboratorio', schema, 'laboratorios');
