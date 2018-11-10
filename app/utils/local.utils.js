var mongoose = require('mongoose');
var modelLaboratorio = mongoose.model('Laboratorio');

locais = {};

locais.comporLocais = function (local, cb) {

	modelLaboratorio.find({ _id: mongoose.Types.ObjectId(local.idLaboratorio)  })
		.then(
			locais => {
				if (locais.length) {
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

module.exports = locais;