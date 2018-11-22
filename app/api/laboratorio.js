var mongoose = require('mongoose');
var model = mongoose.model('Laboratorio');
var logger = require('../services/logger');
var LaboratorioBaseModel = require('../models/laboratorioModel');
const { validationResult } = require('express-validator/check');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');
const { comporLaboratorio, gerarSharpComBase64 } = require('../utils/laboratorio.utils');
const Async = require('async');
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = function (app) {

	var api = {};

	function gerarArquivo(imagemBase64, pathName, callback) {
		if (imagemBase64) {
			const imagemSharp = gerarSharpComBase64(imagemBase64);

			imagemSharp
				.metadata()
				.then(metadata => {
					const path = `${pathName}.${metadata.format}`;

					imagemSharp
						.toFile(path)
						.then(info => {
							console.log(info)
							callback(false, path);
						})
						.catch(err => {
							console.log(err)
							logger.log('error', err);
							callback(true, path);
						});
				})
				.catch(err => {
					console.log(err);
					logger.log('error', err);
					callback(true);
				});
		} else {
			console.log('base64 undefined');
			logger.log('error', 'base64 undefined');
			callback(true);
		}

	}

	function montarquery(queryOrigin, itensText) {
		const novaquery = {};
		Object.assign(novaquery, queryOrigin);

		delete novaquery.numItens;
		delete novaquery.pageNum;

		itensText.forEach(key => {
			if (novaquery[key] && novaquery[key].length > 0) {
				novaquery[key] = { $regex: novaquery[key], $options: 'i' };
			}
		});

		return novaquery;
	}

	function queryComPaginacao(modelQuery, parametros, textItens) {
		const numItens = parametros.numItens;
		const pageNum = parametros.pageNum;
		const skips = numItens * (pageNum - 1);

		const query = montarquery(parametros, textItens);

		return modelQuery
			.find(query)
			.skip(+skips)
			.limit(+numItens);
	}

	function criarDiretorio(nome) {
		const mkdirUrl = `./app/documentos/imagens/${nome}`;
		fs.mkdir(mkdirUrl, err => {
			if (err) {
				pastaJaExistia = true;
				console.log('[Diretorio ja existia]:', err);
			}
		});

		return mkdirUrl;
	}

	function gerarArquivosAsyn(laboratorio, listaProps, _dir, cb) {

		const objFunctions = {};

		listaProps.forEach(prop => {

			objFunctions[prop] = (callback) => {
				gerarArquivo(laboratorio[prop], `${_dir}/${prop}`, callback)
			}

		});

		Async.series(objFunctions, (error, results) => {
			cb(results);
		})
	}

	function devolverWebtoken(laboratorio, res){
		const token = jwt.sign({ _id: laboratorio._id, cnpj: laboratorio.cnpj }, app.get('secret'), {
			expiresIn: 3600
		});
		res.set('x-access-token', token);
	}

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

		model.find().estimatedDocumentCount()
			.then(totalCount => {

				return queryComPaginacao(model, parametros, ['nome', 'razaoSocial', 'logradouro', 'bairro', 'cidade', 'estado'])
					.then(
						laboratorios => {

							if (!laboratorios || laboratorios && !laboratorios.length) {

								var msg = `${req._remoteAddress} [${req._startTime}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ${req.statusCode} (erro: Nome == null)`;
								logger.log('error', msg);
								res.status(400).send(respostapadrao(false, {}, `Nenhum laboratório encontrado foi encontrado com filtro passado!`));

							}
							else {

								Async.mapSeries(laboratorios, (laboratorio, cb) => {

									comporLaboratorio(laboratorio, cb);

								}, (err, results) => {

									res.send(respostapadrao(true, results, '', {
										itens: results.length,
										pageNum: parametros.pageNum,
										totalCount: totalCount
									}));
								})

							}
						},
						retornarErro.bind(res)
					)
			});
	}

	api.criarLaboratorio = (req, res) => {

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).send(respostapadrao(false, {}, errors.array().toString()));
		}

		const novoLaboratorio = new LaboratorioBaseModel()
		novoLaboratorio.atualizacao(req.body)
		novoLaboratorio.esconderDadosSensiveis()


		model.find({ cnpj: novoLaboratorio.cnpj })
			.then(
				(laboratorio) => {
					console.log('laboratorios encontrado', laboratorio)
					if (laboratorio && laboratorio.length) {
						res.status(400).send(respostapadrao(false, {}, 'Laboratorio ja cadastrado na base'))
					} else {

						const _dir = criarDiretorio(novoLaboratorio.nome);

						gerarArquivosAsyn(novoLaboratorio, ['logotipo', 'fotoLaboratorios'], _dir, function (results) {

							novoLaboratorio.logotipo = results.logotipo;
							novoLaboratorio.fotoLaboratorios = results.fotoLaboratorios;

							model.create(novoLaboratorio).then(
								(laboratorio) => {
									
									devolverWebtoken(laboratorio, res);	

									res.send(respostapadrao(true, laboratorio));
								},
								retornarErro.bind(res)
							)
						});
					}
				},
				retornarErro.bind(res)
			);
	}

	api.atualizarLaboratorio = (req, res) => {

		const novoLaboratorio = new LaboratorioBaseModel()
		novoLaboratorio.atualizacao(req.body)
		novoLaboratorio.esconderDadosSensiveis()
		novoLaboratorio.removeId()
		console.log("[criaLaboratorio]:", novoLaboratorio)


		if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um Laboratorio não pode atualizar os dados de outro Laboratorio'));
        }

		model.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, novoLaboratorio, { upsert: false, new: true })
			.then(
				(laboratorio) => {
					console.log('laboratorios encontrado', laboratorio)
					if (laboratorio) {

						const _dir = criarDiretorio(laboratorio.nome);



						gerarArquivosAsyn(laboratorio, ['logotipo', 'fotoLaboratorios'], _dir, function (results) {

							devolverWebtoken(laboratorio, res);							

							res.send(respostapadrao(true, laboratorio, 'Laboratório atualizado com sucesso'));
						})

					} else {

						res.status(400).send(respostapadrao(false, {}, 'Laboratorio não encontrado na base'));
					}
				},
				(erroFind) => {
					logger.log('error', erroFind);
					res.status(400).send(respostapadrao(false, {}, 'Não foi possivel cadastrar o Laboratorio').object.messageDB = erroFind)
				}
			);

	}

	api.deletarLaboratorio = (req, res) => {

		if (req.authentication._id != req.params.id) {
            return res.status(403).send(respostapadrao(false, {}, 'Um Laboratorio não pode deletar outro Laboratorio'));
		}
		
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

	return api;
}