const mongoose = require('mongoose');

var crypto = require('crypto');
var nodemailer = require('nodemailer');

const modelCorrentista = mongoose.model('Laboratorio');
const modelTransferencia = mongoose.model('Transferencia');

const logger = require('../services/logger');
const isObjectEmpty = require('../services/isObjectEmpty');
const api = {};
const Transferencias = require('../services/transferencias');
var moment = require('moment');


const Async = require('async')

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}

api.makeToken = function (req, res) {
    // verifica se o correntista existe

    console.log ('[body]', req.body)
    modelCorrentista.findOne({ contaCorrente: req.body.contacorrente }).then(
        correntistaResult => {
            if (correntistaResult) {
                const random = randomValueHex(8)

                if (correntistaResult.email != null && correntistaResult.email != '' ){
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'grupo2.gama.avanade@gmail.com',
                        pass: '#goorange'
                        }
                    });

                    var mailOptions = {
                        from: 'grupo2.gama.avanade@gmail.com',
                        to: correntistaResult.email,
                        subject: 'AVANADE BANKING - Autorizar transação',
                        text: 'Uma tentativa de transferência a partir do internet banking gerou acabou gerando um token: ' + random
                    };

                    transporter.sendMail(mailOptions, function(err, info){
                        if (err) {
                            logger.log('error', err);
                            res.status(200).send({
                                "success": false
                                , "message": "Houve um erro na tentativa de envio de e-mail: " + err
                            });
                        } else {
                            
                            console.log('Email sent: ' + info.response);

                            const tokenTransacao = {
                                token: random
                            }

                            modelCorrentista.update(
                                { contaCorrente: req.body.contacorrente },
                                { $set: { tokenTransacao: tokenTransacao } },
                                function (err, rowsAffected) {
                                    if (err) {
                                        console.log('[ERROR] ' + err);
                                        res.status(500).send({
                                            "success": false
                                            , "message": "Não foi possível realizar operação de segurança: " + err
                                        });
                                    }
                                    if (rowsAffected) {
                                        res.send({
                                            "success": true,
                                            "message": "Operação de segurança concluída com sucesso!"
                                        })
                                    }

                                }
                            );
                        }
                    });
                }
                else{
                    const err = `[Correntista: ${correntistaResult.nome}] sem Email cadastrado`
                    console.log(err, req.body);
                    logger.log('error', err);
                    res.status(200).send({
                        "success": false
                        , "message": err
                    });
                }
                
                
            } else {
                const err = `Conta corrente do correntista não existe`
                console.log(err, req.body.contacorrente);
                logger.log('error', err);
                res.status(200).send({
                    "success": false
                    , "message": err
                });
            }
        }, error => {
            console.log(error);
            logger.log('error', error);
            res.status(500).send({
                "success": false
                , "message": error
            });
        }
    );
}

api.checkToken = function (req, res) {
    // verifica se o token existe para o correntista

    console.log('[token enviado]:', req.body.token)

    modelCorrentista.findOne({ 'contaCorrente': req.body.contacorrente, 'tokenTransacao.token': req.body.token }).then(
        correntistaResult => {
            console.log('[token encontrado]:', req.body.token)
            if (correntistaResult) {
                
                const tokenTransacao = { }

                modelCorrentista.update(
                    { contaCorrente: req.body.contacorrente },
                    { $set: { tokenTransacao: tokenTransacao } },
                    function (err, rowsAffected) {
                        if (err) {
                            console.log('[ERROR] ' + err);
                            res.status(500).send({
                                "success": false
                                , "message": "Houve um erro durante a verificação da transação: " + err
                            });
                        }
                        if (rowsAffected) {
                            res.send({
                                "success": true,
                                "message": "Operação de segurança concluída com sucesso!"
                            })
                        }

                    }
                );

            } else {
                const err = `Token não encontrado`
                logger.log('error', err);
                res.status(200).send({
                    "success": false
                    , "message": err
                });
            }
        }, error => {
            console.log(error);
            logger.log('error', error);
            res.status(500).send({
                "success": false
                , "message": error
            });
        }
    );
}

api.adiciona = function (req, res) {

    Async.series({
        userA: function (callback) {
            modelCorrentista.findOne({ contaCorrente: req.body.origem }).then(
                correntistaResult => {
                    if (correntistaResult) {
                        //console.log("pegou o correntista");
                        correntistaDestino = correntistaResult;
                        callback(null, correntistaResult);
                    } else {
                        const err = `Conta corrente do correntista origem não existe`
                        console.log(err, req.body.origem);
                        logger.log('error', err);
                        res.status(200).send({
                            "success": false
                            ,"message": err});
                    }
                }, error => {
                    console.log(error);
                    logger.log('error', error);
                    res.status(500).send({
                        "success": false
                        ,"message": error});
                }
            );
        },
        userB: function (callback) {
            modelCorrentista.findOne({ contaCorrente: req.body.destino }).then(
                correntistaResult => {
                    if (correntistaResult) {
                        //console.log("pegou o correntista");
                        correntistaDestino = correntistaResult;
                        callback(null, correntistaResult);
                    } else {
                        console.log("Conta corrente não existe");
                        const err = `Conta corrente do correntista destino não existe`
                        console.log(err, req.body.destino);
                        logger.log('error', err);
                        res.status(200).send({
                            "success": false
                            ,"message": err});
                    }
                }, error => {
                    console.log(error);
                    logger.log('error', error);
                    res.status(500).send({
                        "success": false
                        ,"message": error});
                }
            );
        }
    }, function (err, results) {
        if (err) {
            console.log(err);
            logger.log('error', err);
            res.status(500).json(err);
        }
        if (results.userA.saldo >= req.body.valor) {
            //console.log("passou");

            //Instancia uma nova classe transferencia
            var transferencia = new modelTransferencia();

            // preenche os campos
            transferencia.descricao = req.body.descricao;
            transferencia.origem = req.body.origem;
            transferencia.destino = req.body.destino;
            transferencia.valor = req.body.valor;
            transferencia.situacao = "completado";
            transferencia.updated_at = new Date;
            transferencia.created_at = new Date;

            // adiciona a transação
            //salva no banco de dados
            transferencia.save(function (error) {
                if (error) {
                    console.log(error);
                    logger.log('error', error);
                    res.status(500).send({
                        "success": false
                        ,"message": error});
                } else {

                    //deu certo a transação, atualiza o saldo dos correntistas
                    Async.series({
                        //atualiza o saldo do usuário de origem
                        userAA: function (callback) {
                            if (req.body.salvarFavorecido) {

                                // verifica se o favorecido já existe pelo numero da conta
                                modelCorrentista.findOne(
                                    { contaCorrente: req.body.origem, 'favorecidos': { $elemMatch: { contaCorrente: req.body.destino } } },
                                    function (err, correntistaResult) {

                                        if (err) {
                                            console.log('[ERROR] ' + err);
                                        }
                                        // caso exista, atualiza o nome da conta corrente
                                        if (correntistaResult) {
                                            modelCorrentista.update(
                                                { contaCorrente: req.body.origem, 'favorecidos': { $elemMatch: { contaCorrente: req.body.destino } } },
                                                { $inc: { saldo: -req.body.valor }, $set: { "favorecidos.$.nome": req.body.nomeFavorecido, "favorecidos.$.agencia": req.body.agenciaFavorecido } },
                                                function (err, rowsAffected) {
                                                    if (err) { console.log('[ERROR] ' + err); }
                                                    if (rowsAffected) { 
                                                        //console.log('[INFO] user'+ req.body.origem + 'saldo -' + req.body.valor); 
                                                    }
                                                    callback(null, "Usuario Origem atualizado");
                                                }
                                            );
                                        // adiciona o favorecido na conta corrente
                                        } else {

                                            console.log("Não existe correntista");

                                            const favorecido = {
                                                nome: req.body.nomeFavorecido,
                                                contaCorrente: req.body.destino,
                                                agencia: req.body.agenciaFavorecido
                                            }

                                            modelCorrentista.update(
                                                { contaCorrente: req.body.origem },
                                                { $inc: { saldo: -req.body.valor }, $push: { favorecidos: favorecido } },
                                                function (err, rowsAffected) {
                                                    if (err) { console.log('[ERROR] ' + err); }
                                                    if (rowsAffected) { 
                                                        //console.log('[INFO] '+ req.body.origem + 'saldo -' + req.body.valor); 
                                                    }
                                                    callback(null, "Usuario Origem atualizado");
                                                }
                                            );
                                        }

                                    });


                            } else {
                                modelCorrentista.update(
                                    { contaCorrente: req.body.origem },
                                    { $inc: { saldo: -req.body.valor } },
                                    function (err, rowsAffected) {
                                        if (err) { console.log('[ERROR] ' + err); }
                                        if (rowsAffected) { 
                                            //console.log('[INFO] user saldo -' + req.body.valor); 
                                        }
                                        callback(null, "Usuario Origem atualizado");
                                    }
                                );
                            }
                        },

                        //atualiza o saldo do usuário de destino
                        userBB: function (callback) {
                            modelCorrentista.update(
                                { contaCorrente: req.body.destino },
                                { $inc: { saldo: req.body.valor } },
                                function (err, rowsAffected) {
                                    if (err) { console.log('[ERROR] ' + err); }
                                    if (rowsAffected) { 
                                        //console.log('[INFO] user saldo +' + req.body.valor); 
                                    }
                                    callback(null, "Usuario destino atualizado");
                                }
                            );
                        }
                    }, function (err, results) {
                        console.log(results)
                        if (err) {
                            console.log(error);
                            logger.log('error', error);
                            res.status(500).send({
                                "success": false
                                ,"message": error});
                        }
                        if (results) {
                            res.send({
                                "success": true,
                                "message": "Transferência concluída com sucesso!"
                            })
                        }
                    });
                }
            });
        } else {
            const error = "Saldo insulficiente!";
            console.log(error);
            logger.log('error', error);
            res.status(200).send({"success": false, "message": error });
        }
    });

}



module.exports = api;