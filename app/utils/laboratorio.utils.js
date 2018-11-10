var LaboratorioBaseModel = require('../models/laboratorioModel');
var mongoose = require('mongoose');
var modelLocal = mongoose.model('Local');

obj = {};

obj.comporLaboratorio = function(laboratorio, cb) {

	var laboratorioM = new LaboratorioBaseModel()
	laboratorioM.novoInclusao(laboratorio)
	laboratorioM.esconderDadosSensiveis()
	console.log('[laboratorioM]', laboratorioM)

	modelLocal.find({ idLaboratorio: laboratorioM._id })
		.then(
			locais => {
				if (locais && locais.length > 0) {
					console.log('[locais]', locais, laboratorioM)
					laboratorioM.montarLocais(locais)
				}
				cb(undefined, laboratorioM)
			},
			erro => {
				cb(erro)
			}
		)
}

module.exports = obj;