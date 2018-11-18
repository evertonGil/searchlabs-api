module.exports = function(app){
	var api = app.api.tipoExame;

	app.get('/v1/tiposExame', api.buscarTipoExame)
	app.post('/v1/tiposExame', api.criarTipoExame)
	app.put('/v1/tiposExame/:id', api.atualizarTipoExame)
}
