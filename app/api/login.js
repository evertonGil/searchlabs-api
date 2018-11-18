const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const modelUsuario = mongoose.model('Usuario');
const modelLaboratorio = mongoose.model('Laboratorio');
const isObjectEmpty = require('../services/isObjectEmpty');
const logger = require('../services/logger');
const api = {};
const crypto = require('crypto');
const hash = require('../services/hash');
const { respostapadrao, retornarErro } = require('../utils/resposta.utils');


module.exports = function (app) {

	api.geraHash = function (req, res) {

		console.log("Senha: ", req.body.senha)
		console.log("Hash: ", hash.gerar(app, req.body.senha))
		res.status(200).send({ "success": "Verificar token no prompt do server" })

	}

	api.options = function (req, res) {
		res.send()
	}

	api.autenticaUsuario = function (req, res) {

		if (req.is('application/json')) {

			// Gera o Hash com a senha passada
			// Seta o hash do body
			// req.body.senha = hash.gerar(app, req.body.senha)

			// Procura pelo usuario no banco
			// Comparando o CPF e a Senha(hash)
			// TODO: Remover senha da consulta
			return modelUsuario
				.findOne({ email: req.body.email, senha: req.body.senha })
				.then(
					function (user) {

						// Checa se realmente trouxe um usuário
						if (!user) {
							console.log("Email e senha são invalidos");

							// Envia response de não autorizado
							res.status(401).send(respostapadrao(false, {}, 'Email e senha invalidos!'));
						}
						else {

							// Gera o token com o jwt e um secret
							const token = jwt.sign({ _id: user._id, email: user.email, nome: user.nome }, app.get('secret'), {
								expiresIn: 3600
							});

							//Devolve o token pelo header da resposta e no body
							res.set('x-access-token', token);

							let usuario = {
								"_id": user._id,
								"nome": user.nome,
								"email": user.email,
							}

							// res.set("Access-Control-Allow-Origin", "*")
							res.send(respostapadrao(true, usuario, '', { token: token }));
						}

					},
					retornarErro.bind(res)

				);

		} else {
			res.send(respostapadrao(false, {}, 'content-type invalido, aceito somente application/json'));
		}

	}


	api.autenticaLaboratorio = function (req, res) {

		if (req.is('application/json')) {

			// Gera o Hash com a senha passada
			// Seta o hash do body
			req.body.senha = hash.gerar(app, req.body.senha)

			// Procura pelo usuario no banco
			// Comparando o CPF e a Senha(hash)
			// TODO: Remover senha da consulta
			return modelLaboratorio
				.findOne({ email: req.body.email, senha: req.body.senha })
				.then(
					function (user) {

						// Checa se realmente trouxe um usuário
						if (!user) {
							console.log("Email e senha são invalidos");

							// Envia response de não autorizado
							res.status(401).send(respostapadrao(false, {}, 'Email e senha invalidos!'));
						}
						else {

							// Gera o token com o jwt e um secret
							const token = jwt.sign({ _id: user._id, email: user.email, cnpj: user.cnpj }, app.get('secret'), {
								expiresIn: 3600
							});

							//Devolve o token pelo header da resposta e no body
							res.set('x-access-token', token);

							let usuario = {
								"_id": user._id,
								"email": user.email,
								"cnpj": user.cnpj
							}

							// res.set("Access-Control-Allow-Origin", "*")
							res.send(respostapadrao(true, usuario, '', { token: token }));
						}

					},
					retornarErro(error).bind(res)

				);

		} else {
			res.send(respostapadrao(false, {}, 'content-type invalido, aceito somente application/json'));
		}

	}

	api.verificatoken = function (req, res, next) {
		const token = req.headers['x-access-token'];

		// Verifica se tem um token na requisição
		if (token) {

			// Verifica se o token passo é valido
			jwt.verify(token, app.get('secret'), function (err, decoded) {
				if (err) {

					// Em caso de não ser valido devolve uma resposta de não autorizado
					res.status(401).send(respostapadrao(false, {}, 'Falha ao tentar autenticar o token!'));
				}

				res.set('x-access-token', token);
				// Se o token for Valido passa para as outras rotas na aplicação
				req.authentication = decoded;
				// console.log(req.usuario);
				next();
			});
		} else {

			console.log('token não enviado');

			// Em caso de não ser valido devolve uma resposta de não autorizado
			res.status(401).send(respostapadrao(false, {}, 'Token não enviado!'));
		}

	}

	// api.renovaToken = function (req, res) {
	// 	const token = req.headers['x-access-token'];
	// 	console.log(req.usuario, token)

	// 	res.send()
	// }

	return api;
}