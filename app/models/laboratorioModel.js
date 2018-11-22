module.exports = function LaboratorioBaseModel() {
	_this = this;

	_this.novoInclusao = function (base) {
		_this._id = base._id;
		_this.nome = base.nome;
		_this.razaoSocial = base.razaoSocial;
		_this.logotipo = base.logotipo;
		_this.fotoLaboratorios = base.fotoLaboratorios;
		_this.email = base.email;
		_this.cnpj = base.cnpj;
		_this.senha = base.senha;
	}

	_this.atualizacao = function (base) {
		for (let key in base){
			if(key && (base[key] || base[key] === "") && key !== '_id'){
				_this[key] = base[key]
			}
		}
		// _this._id = base._id;
		// _this.nome = base.nome;
		// _this.razaoSocial = base.razaoSocial;
		// _this.logotipo = base.logotipo;
		// _this.fotoLaboratorios = base.fotoLaboratorios;
		// _this.email = base.email;
		// _this.cnpj = base.cnpj;
		// _this.senha = base.senha;
		// _this.logradouro = base.logradouro;
		// _this.complemento = base.complemento;
		// _this.numero = base.numero;
		// _this.bairro = base.bairro;
		// _this.cidade = base.cidade;
		// _this.estado = base.estado;
		// _this.telefone1 = base.telefone1;
		// _this.telefone2 = base.telefone2;
		// _this.textoInformativo = base.textoInformativo;
		// _this.exames = base.exames;
	}

	_this.removeId = function () {
		delete _this._id;
	}
	_this.esconderDadosSensiveis = function () {
		delete _this.senha;
	}
}