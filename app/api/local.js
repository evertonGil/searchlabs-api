var mongoose = require('mongoose');
var modelLocal = mongoose.model('Local');
var logger = require('../services/logger');
const { validationResult } = require('express-validator/check');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');
const Async = require('async')

var api = {};

api.consultarLocaisGeral = (req, res) => {
	const parametros = req.query || {};
	console.log(req.query)

	return modelLocal
		.find(parametros)
		.then(
			locais => {
				
				res.send(respostapadrao(true, locais))
			},
			retornarErro.bind(res)
		)
}

api.criarLocal = (req, res) => {
	_this = this;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
	}

	console.log(req.body.idLaboratorio)
	model
		.find({ _id: new mongoose.Types.ObjectId(req.body.idLaboratorio) })
		.then(
			laboratorio => {
				if (laboratorio && laboratorio.length > 0) {

					modelLocal
						.create(req.body)
						.then(
							local => {
								res.send(respostapadrao(true, local))
							},
							retornarErro.bind(res)
						)
				} else {
					res.status(400).send(respostapadrao(false, {}, 'Não foi possivel cadastrar o local, pois o laboratorio não existe no banco'))
				}
			},
			retornarErro.bind(res)
		)
}

api.deletarLocal = (req, res) => {
	return modelLocal
		.deleteOne({ "_id": req.params.id })
		.then((laboratorio) => {
			if (laboratorio && !laboratorio.n) {
				var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
				logger.log('error', msg);
				res.status(400).send({
					success: false,
					mensagem: `Local: ${req.params.id} não encontrado!`
				});
			}
			else {
				res.send({ laboratorio });
			}
		}, retornarErro.bind(res));
}


module.exports = api;