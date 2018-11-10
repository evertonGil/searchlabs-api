const mongoose = require('mongoose');

const modelCorrentista = mongoose.model('Laboratorio');
const modelTransferencia = mongoose.model('Transferencia');

const logger = require('../services/logger');
const isObjectEmpty = require('../services/isObjectEmpty');
const api = {};
const Transferencias = require('../services/transferencias');
var moment = require('moment');


const Async = require('async')

api.listaPorUsuario = (req, res) => {

    console.log('[req.body]', req.body)
    // pagination
    const perPage = req.body.perPage || 20
    const page = req.body.page || 1

    let dataInicial = req.body.dataInicial || '1990-01-01';
    let dataFinal = req.body.dataFinal || '3000-12-31';

    if (typeof req.body.dataInicial === 'object') {
        req.body.dataInicial.month = req.body.dataInicial.month - 1
    }
    if (typeof req.body.dataFinal === 'object') {
        req.body.dataFinal.month =  req.body.dataFinal.month - 1
    }


    console.log(dataInicial, dataFinal)
    dataInicial = moment(dataInicial)
    console.log('[dataInicial.moment]', dataInicial.hours(0).minutes(0).seconds(0).milliseconds(0))

    dataFinal = moment(dataFinal)
    console.log('[dataInicial.moment]', dataFinal.hours(23).minutes(59).seconds(59).milliseconds(999))



    Async.series({
        userA: function (callback) {

            modelTransferencia
                .find({
                    $and: [
                        { $or: [{ "origem": req.body.contacorrente }, { "destino": req.body.contacorrente }] },
                        { "updated_at": { $gte: new Date(dataInicial) } },
                        { "updated_at": { $lte: new Date(dataFinal) } }
                    ]
                })
                .sort({ created_at: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .then((transferencias) => {

                    Async.map(transferencias, function (transferencia, callback2) {

                        Async.series({
                            origem: function (callback3) {
                                modelCorrentista.findOne({ "contaCorrente": transferencia.origem })
                                    .then((correntista) => {
                                        callback3(null, { nome: correntista.nome, contaCorrente: correntista.contaCorrente, cpf: correntista.cpf })
                                    }, (error) => {
                                        logger.log('error', error);
                                        res.status(500).send({
                                            "success": false
                                            , "message": error
                                        });
                                    })
                            },
                            destino: function (callback3) {
                                modelCorrentista.findOne({ "contaCorrente": transferencia.destino })
                                    .then((correntista) => {
                                        callback3(null, { nome: correntista.nome, contaCorrente: correntista.contaCorrente, cpf: correntista.cpf })
                                    }, (error) => {
                                        logger.log('error', error);
                                        res.status(500).send({
                                            "success": false
                                            , "message": error
                                        });
                                    })
                            }
                        }, function (err, results) {

                            let transf = {
                                origem: results.origem,
                                destino: results.destino,
                                descricao: transferencia.descricao,
                                valor: transferencia.valor,
                                updated_at: transferencia.updated_at,
                                created_at: transferencia.created_at
                            }

                            if (req.body.contacorrente == transferencia.origem) {
                                transf.debito = true
                                //transf.descricao = "[Transf para]: c/c" + transferencia.destino
                            } else {
                                transf.debito = false

                                //transf.descricao = "[Transf de]: c/c" + transferencia.destino

                            }

                            callback2(null, transf)

                        })

                    }, function (err, results) {
                        callback(null, results)
                    })

                }, (error) => {
                    logger.log('error', error);
                    res.status(500).send({
                        "success": false
                        , "message": error
                    });
                });

        },
        userB: function (callback) {
            modelCorrentista.findOne({ "contaCorrente": req.body.contacorrente })
                .then((correntista) => {
                    //console.log('[transferencia.js line:122]', correntista, req.body.contacorrente)
                    callback(null, correntista.saldo)
                }, (error) => {
                    logger.log('error', error);
                    res.status(500).send({
                        "success": false
                        , "message": error
                    });
                })
        }
    }, function (err, results) {
        //console.log(results.userA, results.userB)

        modelTransferencia.find({ $or: [{ "origem": req.body.contacorrente }, { "destino": req.body.contacorrente }] })
            .count().exec(function (err, count) {
                if (err) {
                    res.status(500).send({
                        "success": false
                        , "message": err
                    });
                }
                res.send({
                    transferencias: results.userA,
                    saldoAtualizado: results.userB,
                    success: true,
                    current_page: page,
                    total_pages: Math.ceil(count / perPage)
                })
            })

        // res.send({
        //     transferencias: results.userA,
        //     saldoAtualizado: results.userB
        // })
    })

}



module.exports = api;