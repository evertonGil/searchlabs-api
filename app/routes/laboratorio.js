
const { check } = require('express-validator/check');

module.exports = function (app) {
	var api = app.api.laboratorio;
	var apiLogin = app.api.login;

	app.get('/v1/laboratorios/', api.consultarLabsGeral);
	app.post('/v1/laboratorios', [check('cnpj').exists()], api.criarLaboratorio);

	app.get('/v1/laboratorios/:id', api.buscarPorId);

	// Autenticacao Usuario
	// app.use('/v1/laboratorios/:id*', apiLogin.verificatoken);

	app.put('/v1/laboratorios/:id', api.atualizarLaboratorio);
	app.put('/v1/laboratorioContato/:id', [check('cnpj').exists()], api.atualizarLaboratorio);
	app.put('/v1/laboratorioExames/:id', [check('cnpj').exists()], api.atualizarLaboratorio);
	app.delete('/v1/laboratorios/:id', api.deletarLaboratorio);

}
