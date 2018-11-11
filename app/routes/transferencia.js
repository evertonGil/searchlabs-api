
module.exports = function(app){
    var api = app.api.transferencia;
    var apiExtrato = app.api.extrato;
    
    app.post('/v1/extrato', apiExtrato.listaPorUsuario)
    app.post('/v1/transferencias', api.adiciona)
    app.post('/v1/makeTransacao', api.makeToken)
    app.post('/v1/checkTransacao', api.checkToken)
}