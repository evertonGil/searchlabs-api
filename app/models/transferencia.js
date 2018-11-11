var mongoose = require('mongoose');
var schema = mongoose.Schema({
    descricao: String,
    origem: String,
    destino: String,
    valor: Number,
    situacao: String,
    updated_at: Date,
    created_at: Date
})

/******************
    situacao: 
    - iniciado
    - pendente
    - completado
    - cancelado

*******************/

mongoose.model('Transferencia', schema, 'transferencias')
