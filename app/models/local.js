var mongoose = require('mongoose')

var schema = mongoose.Schema({
    idLaboratorio: mongoose.Schema.Types.ObjectId,
    nomeUnidade: String,
    telefone: String,
    numero: Number,
    logradouro: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    location: [{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }],
    exames: [{
        nome: String,
        preco: String
    }]

})

mongoose.model('Local', schema, 'locais')
