module.exports = function LaboratorioBaseModel() {
	_this = this;

	_this.novoInclusao = function (base) {
		_this._id = base._id;
		_this.nomeEmpresa = base.nomeEmpresa;
		_this.email = base.email;
		_this.cnpj = base.cnpj;
		_this.senha = base.senha;
	}

	_this.removeId = function () {
		delete _this._id;
	}
	_this.esconderDadosSensiveis = function () {
		delete _this.senha;
	}

	_this.montarLocais = function (locais) {
		_this.locais = _this.locais || [];

		if (Array.isArray(locais)) {

			locais.forEach(local => {

				_this.locais.push(local)
			})

		} else {
			_this.locais.push(locais)
		}
	}
}