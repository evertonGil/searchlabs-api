const crypto = require('crypto');
const isObjectEmpty = require('../services/isObjectEmpty');

class Hash{
    constructor(){
    }

    gerar(app, senha){
        return crypto.createHash(app.get('hashType'), app.get('secretHash'))
        .update(senha)
        .digest('base64')
    }

    recupera(app, senha){
        return crypto.createDecipher(app.get('hashType'), app.get('secretHash'))
        .update(senha)
        
    }
}

module.exports = new Hash()



