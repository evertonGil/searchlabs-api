var mongoose = require('mongoose');
var model = mongoose.model('Laboratorio');
var logger = require('../services/logger');
var LaboratorioBaseModel = require('../models/laboratorioModel');
const { validationResult } = require('express-validator/check');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');
const { comporLaboratorio } = require('../utils/laboratorio.utils');
const Async = require('async')

var api = {};



api.buscarPorId = (req, res) => {
	return model
		.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })
		.then((laboratorio) => {
			if (laboratorio == null) {
				var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
				logger.log('error', msg);
				res.status(400).send(respostapadrao(false, {}, `Laboratório: ${req.params.id} não encontrado!`));
			}
			else {
				function enviarRes(err, results) {
					if (err) {
						logger.log('error', err);
					}

					res.send(respostapadrao(true, results, ''));
				}

				comporLaboratorio(laboratorio, enviarRes)

			}
		}, retornarErro.bind(res));
}

api.consultarLabsGeral = (req, res) => {
	const parametros = req.query || {};
	console.log(req.query)

	return model
		.find(parametros)
		.then(
			laboratorios => {
				
				if (!laboratorios || laboratorios && !laboratorios.length) {

					var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
					logger.log('error', msg);
					res.status(400).send(respostapadrao(false, {}, `Nenhum laboratório encontrado foi encontrado com filtro passado!`));
					
				}
				else {

					Async.mapSeries(
						laboratorios,
						comporLaboratorio,
						(err, results) => {
							res.send(respostapadrao(true, results))
						}
					)

				}
			},
			retornarErro.bind(res)
		)
}

api.criarLaboratorio = (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
	}


	const novoLaboratorio = new LaboratorioBaseModel()
	novoLaboratorio.novoInclusao(req.body)


	model.find({ cnpj: novoLaboratorio.cnpj })
		.then(
			(laboratorio) => {
				console.log('laboratorios encontrado', laboratorio)
				if (laboratorio && laboratorio.length) {
					res.status(400).send(respostapadrao(false, {}, 'Laboratorio ja cadastrado na base'))
				} else {
					model.create(novoLaboratorio).then(
						(laboratorio) => {
							res.send(respostapadrao(true, laboratorio));
						},
						retornarErro.bind(res)
					)
				}
			},
			retornarErro.bind(res)
		);

}

api.atualizarLaboratorio = (req, res) => {

	const novoLaboratorio = new LaboratorioBaseModel()
	novoLaboratorio.novoInclusao(req.body)
	novoLaboratorio.esconderDadosSensiveis()
	novoLaboratorio.removeId()
	console.log("[criaLaboratorio]:", novoLaboratorio)

	model.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, novoLaboratorio, { upsert: false, new: true })
		.then(
			(laboratorio) => {
				console.log('laboratorios encontrado', laboratorio)
				if (laboratorio) {

					res.send(respostapadrao(true, laboratorio, 'Laboratório atualizado com sucesso'))

				} else {

					res.status(400).send(respostapadrao(false, {}, 'Laboratorio não encontrado na base'))
				}
			},
			(erroFind) => {
				logger.log('error', erroFind);
				res.status(400).send(respostapadrao(false, {}, 'Não foi possivel cadastrar o Laboratorio').object.messageDB = erroFind)
			}
		);

}

api.deletarLaboratorio = (req, res) => {
	return model
		.deleteOne({ "_id": req.params.id })
		.then((laboratorio) => {
			if (laboratorio && !laboratorio.n) {
				var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
				logger.log('error', msg);
				res.status(400).send(respostapadrao(false, {}, `Laboratório: ${req.params.id} não encontrado!`));
			}
			else {
				res.send(respostapadrao(true, laboratorio));
			}
		}, retornarErro.bind(res));
}



module.exports = api;