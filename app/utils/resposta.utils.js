var logger = require('../services/logger');


resposatas = {}
resposatas.respostapadrao = function (sucesso, obj, mensagem = "", contextAttatch = {}) {

    const retorno = {
        context: {
            sucess: sucesso,
            message: mensagem

        },
        object: obj
    };

    Object.assign(retorno.context, contextAttatch);

    return retorno;
}

resposatas.retornarErro = function (error) {
    logger.log('error', error);
    this.send(resposatas.respostapadrao(false, {}, error.message));
}

module.exports = resposatas;