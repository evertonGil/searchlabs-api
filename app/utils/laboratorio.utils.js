var LaboratorioBaseModel = require('../models/laboratorioModel');
var mongoose = require('mongoose');
var modelLocal = mongoose.model('Local');
const mime = require('mime-types')
const fs = require('fs');
const sharp = require('sharp');

laboratorioUtils = {};

laboratorioUtils.comporLaboratorio = function (laboratorio, cb) {

	var laboratorioM = new LaboratorioBaseModel()
	laboratorioM.novoInclusao(laboratorio)
	laboratorioM.esconderDadosSensiveis()
	// console.log('[laboratorioM]', laboratorioM)

	if (laboratorioM.logotipo) {
		laboratorioM.logotipo = laboratorioUtils.gerarBase64dePath(laboratorio.logotipo);
	}

	if (laboratorioM.fotoLaboratorios) {
		laboratorioM.fotoLaboratorios = laboratorioUtils.gerarBase64dePath(laboratorio.fotoLaboratorios);
	}

	cb(undefined, laboratorioM)

	// modelLocal.find({ idLaboratorio: laboratorioM._id })
	// 	.then(
	// 		locais => {
	// 			if (locais && locais.length > 0) {
	// 				console.log('[locais]', locais, laboratorioM)
	// 				laboratorioM.montarLocais(locais)
	// 			}
	// 			cb(undefined, laboratorioM)
	// 		},
	// 		erro => {
	// 			cb(erro)
	// 		}
	// 	)
}

laboratorioUtils.gerarSharpComBase64 = function (base64) {
	const stringUrl = base64.split(',');
	const valor = stringUrl.slice(1, stringUrl.length).join(',');
	var buf = Buffer.from(valor, 'base64');
	const imageSharp = sharp(buf);

	return imageSharp;
}

laboratorioUtils.gerarBase64dePath = function (path) {
	if(path.length < 300){
		let buff = fs.readFileSync(path);
		const mimetype = mime.lookup(path)
		const baseString64 = `data:${mimetype};base64`;
		let base64data = buff.toString('base64');
		return baseString64 + base64data;
	}
	return path;
}

module.exports = laboratorioUtils;