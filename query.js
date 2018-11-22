
db.laboratorios.find({
    $and: [
        {
            $or: [
                { cidade: { '$regex': 'Sao', '$options': 'i' } },
                { estado: { '$regex': 'Sao', '$options': 'i' } },
                { logradouro: { '$regex': 'Sao', '$options': 'i' } },
                { bairro: { '$regex': 'Sao', '$options': 'i' } }
            ]
        },
        {
            exames: {
                $elemMatch: { descricao: { '$regex': "Ultrasonografia", '$options': 'i' } }
            }
        }
    ]
})

