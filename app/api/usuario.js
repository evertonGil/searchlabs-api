var mongoose = require('mongoose');
var model = mongoose.model('Usuario');
var logger = require('../services/logger');
const { validationResult } = require('express-validator/check');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');

module.exports = function (app) {

    var api = {};

    api.buscarUsuarioPorId = (req, res) => {

        return model
            .findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
            .then((usuario) => {
                if (usuario == null) {
                    var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
                    logger.log('error', msg);
                    res.status(400).send(respostapadrao(false, {}, `Usuario: ${req.params.id} não encontrado!`));
                }
                else {
                    const _usuario = {
                        _id: usuario._id,
                        nome: usuario.nome,
                        email: usuario.email,
                        favoritos: usuario.favoritos,
                        __v: usuario.__v
                    };

                    res.send(respostapadrao(true, _usuario, ''));
                }
            }, retornarErro.bind(res));
    }

    api.atualizarUsuarioPorId = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        
        if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um usuario não pode atualizar dados de outro usuario'));
        }

        const novoUsuario = req.body;

        model.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, novoUsuario, { upsert: false, new: true })
            .then(
                (_usuario) => {
                    res.send(respostapadrao(true, _usuario));
                },
                retornarErro.bind(res)
            )
    }

    api.deletarUsuarioPorId = (req, res) => {
        
        console.log(req.authentication._id, req.params.id);

        if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um usuario não pode deletar outro usuario'));
        }

        return model
            .deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
            .then((result) => {
                if (result && !result.n) {
                    var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
                    logger.log('error', msg);
                    res.status(400).send(respostapadrao(false, {}, `Usuario: ${req.params.id} não encontrado!`));
                }
                else {
                    res.send(respostapadrao(true, result, ''));
                }
            }, retornarErro.bind(res));
    }

    api.criarUsuario = (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        model.find({ email: req.body.email })
            .then(
                (usuario) => {
                    if (usuario && usuario.length) {
                        res.status(400).send(respostapadrao(false, {}, 'Email ja cadastrado na base'))
                    } else {

                        model.create(req.body).then(
                            (usuario) => {
                                res.send(respostapadrao(true, usuario));
                            },
                            retornarErro.bind(res)
                        )
                    }
                },
                retornarErro.bind(res)
            );
    }

    api.adicionarFavoritos = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um usuario não pode adicionar um favorito para outro usuario'));
        }

        const favorito = req.body;

        const valorUpdate = {
            $addToSet: {
                "favoritos": favorito
            }
        };

        model.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, valorUpdate, { upsert: false, new: true })
            .then(
                (_favorito) => {
                    // console.log('favorito', favorito);
                    res.send(respostapadrao(true, _favorito));
                },
                (erroFind) => {
                    console.log('erroFind', erroFind);
                    retornarErro.bind(res);
                }
            )
    }

    api.deletarFavoritos = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
        }

        console.log(req.authentication, req.params.id);

        if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um usuario não pode deletar um favorito de outro usuario'));
        }

        const favorito = req.body;

        const valorUpdate = {
            $pull: {
                "favoritos": favorito
            }
        };

        model.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, valorUpdate, { upsert: false, new: true })
            .then(
                (_favorito) => {
                    // console.log('favorito', favorito);
                    res.send(respostapadrao(true, _favorito));
                },
                (erroFind) => {
                    console.log('erroFind', erroFind);
                    retornarErro.bind(res);
                }
            )
    }

    return api;
}