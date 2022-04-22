const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');

const roteador = express();

/*----------[ Contas ]----------*/

roteador.get('/contas', contas.listarContas);

roteador.post('/contas', contas.criarConta);

roteador.put('/contas/:numeroConta', contas.atualizarUsuarioConta);

roteador.delete('/contas/:numeroConta', contas.excluirConta);

/*----------[ Transações ]----------*/

roteador.post('/transacoes/depositar', transacoes.depositar);

roteador.post('/transacoes/sacar', transacoes.sacar);

roteador.post('/transacoes/transferir', transacoes.transferir);

roteador.get('/transacoes/saldo', transacoes.saldo);

roteador.get('/conta/extrato', transacoes.extrato);


module.exports = roteador;