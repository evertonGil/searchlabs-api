
const { check } = require('express-validator/check');

module.exports = function (app) {
	var api = app.api.laboratorio;

	app.get('/v1/laboratorios/', api.consultarLabsGeral);
	app.get('/v1/laboratorios/:id', api.buscarPorId);
	app.post('/v1/laboratorios', [check('cnpj').exists()], api.criarLaboratorio);
	app.delete('/v1/laboratorios/:id', api.deletarLaboratorio);
	app.put('/v1/laboratorios/:id', api.atualizarLaboratorio);

}
