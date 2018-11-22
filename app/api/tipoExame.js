var mongoose = require('mongoose');
var model = mongoose.model('TipoExame');
const { validationResult } = require('express-validator/check');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');

module.exports = function (app) {

    var api = {};

    api.buscarTipoExame = (req, res) => {

        return model.find()
            .then((tiposExames) => {
                res.send(respostapadrao(true, tiposExames, ''));
            }, retornarErro.bind(res));
    }

    api.atualizarTipoExame = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        const novoExame = req.body;

        model.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, novoExame, { upsert: false, new: true })
            .then(
                (tipoExame) => {
                    res.send(respostapadrao(true, tipoExame));
                },
                retornarErro.bind(res)
            )
    }

    api.criarTipoExame = (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        model.find({ nome: req.body.nome })
            .then(
                (tipoExame) => {
                    if (tipoExame && tipoExame.length) {
                        res.status(400).send(respostapadrao(false, {}, 'Email ja cadastrado na base'))
                    } else {

                        model.create(req.body).then(
                            (tipoExame) => {
                                res.send(respostapadrao(true, tipoExame));
                            },
                            retornarErro.bind(res)
                        )
                    }
                },
                retornarErro.bind(res)
            );
    }

    return api;
}