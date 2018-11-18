module.exports = function(app){
	var api = app.api.usuario;
	var apiLogin = app.api.login;

	app.post('/v1/usuario', api.criarUsuario)

	// Autenticacao Usuario
	app.use('/v1/usuario/*', apiLogin.verificatoken)

	app.get('/v1/usuario/:id', api.buscarUsuarioPorId)
	app.delete('/v1/usuario/:id', api.deletarUsuarioPorId)
	app.put('/v1/usuario/:id', api.atualizarUsuarioPorId)

	// Autenticacao Usuario
	app.use('/v1/favoritosUsuario/*', apiLogin.verificatoken)

	app.post('/v1/favoritosUsuario/:id', api.adicionarFavoritos)
	app.delete('/v1/favoritosUsuario/:id', api.deletarFavoritos)
}
