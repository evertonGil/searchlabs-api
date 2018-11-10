const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../app/services/logger');

module.exports = function(){

	const app = express();

	app.set('view engine', 'ejs');
	app.set('views', './app/views');

	// Verifica se o ambiente é o de produção
	// Se for pega os secrets guardados nas variaveis de servidor
	if(process.env.NODE_ENV != 'production'){
		// Secret do token
		app.set('secret', 'meu pai ta maluco');
		// Secret da senha
		app.set('secretHash', 'os dois dias mais malucos do mundo');
	}
	else{
		// Secret do token
		app.set('secret', process.env.segredo);
		// Secret da senha
		app.set('secretHash', process.env.secretHash);
	}
	// Seta o tipo de hash em uma variave global
	app.set('hashType', 'sha256')

	// Usa o morgan pra escrever Logs automaticos no sistema
    app.use(morgan('common', {
        stream:{
            write: function(message){
                logger.info(message)
            }
        }
    }));

	// configura os body parser pra funcionar com json (parseia as respostas)
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	
	app.use( function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
		next();
	  });
	

	// Puxa os modulos atraves do consign
	// A primeira Rota é a de Login
	consign({cwd: 'app'})
		.include('models')
        .then('api')
		.then('services')
		.then('routes/login.js')
		.then('routes')
        .into(app);

	// Caso de em uma rota que não existe ele devolve um html de 404
    app.use(function(req, res, next){
    	res.status(404).render('erros/404');
    	next();
	});
	
	// Caso o sistema de um crash ele devolve um html de 500
    app.use(function(erro, req, res, next){
		console.log(erro);
		logger.log('error', erro);
    	if(process.env.NODE_ENV = 'production'){
    		res.status(500).render('erros/500');
    	}    	
    	next();
    });

	return app;
}