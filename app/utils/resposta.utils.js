var logger = require('../services/logger');


resposatas = {}
resposatas.respostapadrao = function (sucesso, obj, mensagem = "") {

    return {
        context: {
            sucess: sucesso,
            message: mensagem
        },
        object: obj
    }
}

resposatas.retornarErro = function (error) {
    logger.log('error', error);
    this.send(resposatas.respostapadrao(false, {}, error.message));
}

module.exports = resposatas;