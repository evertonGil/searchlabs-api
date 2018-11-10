
const { check } = require('express-validator/check');

module.exports = function (app) {
	var api = app.api.local;

	app.get('/v1/locais/', api.consultarLocaisGeral);
	app.post('/v1/locais', [check('idLaboratorio').exists()], api.criarLocal);
	app.delete('/v1/locais/:id', api.deletarLocal);
	// app.put('/v1/locais/:id', api.atualizarLocal);

}
