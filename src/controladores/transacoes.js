const {
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");

function validarOperacao(operacao) {
  if (!operacao.numero_conta) {
    return "O campo 'numero_conta' é obrigatório";
  }
  if (!operacao.valor) {
    return "O campo 'valor' é obrigatório";
  }
  if (operacao.valor < 1) {
    return "O valor do depósito deve ser maior do que zero";
  }
}

function validarTransferencia(transferencia) {
  if (!transferencia.numero_conta_origem) {
    return "O campo 'numero_conta_origem' é obrigatório";
  }

  if (!transferencia.numero_conta_destino) {
    return "O campo 'numero_conta_destino' é obrigatório";
  }

  if (!transferencia.senha) {
    return "O campo 'senha' é obrigatório";
  }

  if (!transferencia.valor) {
    return "O campo 'valor' é obrigatório";
  }
  if (transferencia.valor < 1) {
    return "O valor do depósito deve ser maior do que zero";
  }
}

function validarVisualizacao(visualizacao) {
  if (!visualizacao.numero_conta) {
    return "O campo 'numero_conta' é obrigatório";
  }
  if (!visualizacao.senha) {
    return "O campo 'senha' é obrigatório";
  }
  if (visualizacao.length > 0) {
    return "Informe uma senha válida";
  }
}

function depositar(req, res) {
  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.body.numero_conta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.body.numeroConta} não existe.` });
    return;
  }
  const erro = validarOperacao(req.body);

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }
  const indiceContaAtualizada = contas.indexOf(conta);
  contas[indiceContaAtualizada].saldo += req.body.valor;

  depositos.push({
    data: new Date(),
    numero_conta: req.body.numero_conta,
    valor: req.body.valor,
  });
  
  res.status(200);
  res.json({ mensagem: "Depósito realizado com sucesso!" });
}

function sacar(req, res) {
  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.body.numero_conta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.body.numeroConta} não existe.` });
    return;
  }
  if (conta.usuario.senha !== req.body.senha) {
    res.status(400);
    res.json({ erro: "Senha incorreta!" });
    return;
  }

  const erro = validarOperacao(req.body);

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  if (conta.saldo < req.body.valor) {
    res.status(400);
    res.json({ erro: "Valor insuficiente na conta." });
    return;
  }

  const indiceContaAtualizada = contas.indexOf(conta);
  contas[indiceContaAtualizada].saldo -= req.body.valor;

  saques.push({
    data: new Date(),
    numero_conta: req.body.numero_conta,
    valor: req.body.valor,
  });

  res.status(200);
  res.json({ mensagem: "Saque realizado com sucesso!" });
}

function transferir(req, res) {
  const conta_origem = contas.find(
    (conta) => Number(conta.numero) === Number(req.body.numero_conta_origem)
  );
  const conta_destino = contas.find(
    (conta) => Number(conta.numero) === Number(req.body.numero_conta_destino)
  );

  if (!conta_origem || !conta_destino) {
    res.status(404);
    res.json({ erro: `Conta ${!conta_origem?req.body.conta_origem+"1": req.body.destino+"2"} não existe.` });
    return;
  }
  if (conta_origem.usuario.senha !== req.body.senha) {
    res.status(400);
    res.json({ erro: "Senha incorreta!" });
    return;
  }

  const erro = validarTransferencia(req.body);

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  if (conta_origem.saldo < req.body.valor) {
    res.status(400);
    res.json({ erro: "Valor insuficiente na conta." });
    return;
  }

  const indiceConta_origem = contas.indexOf(conta_origem);
  contas[indiceConta_origem].saldo -= req.body.valor;

  const indiceConta_destino = contas.indexOf(conta_destino);
  contas[indiceConta_destino].saldo += req.body.valor;

  transferencias.push({
    data: new Date(),
    numero_conta_origem: req.body.numero_conta_origem,
    numero_conta_destino: req.body.numero_conta_destino,
    valor: req.body.valor,
  });

  res.status(200);
  res.json({ mensagem: "Transferência realizada com sucesso!" });
}

function saldo(req, res) {
  const erro = validarVisualizacao({
    numero_conta: req.query.numero_conta,
    senha: req.query.senha
  });

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.query.numero_conta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.query.numeroConta} não existe.` });
    return;query
  }
  if (conta.usuario.senha !== req.query.senha) {
    res.status(400);
    res.json({ erro: "Senha incorreta!" });
    return;
  }
  res.status(200);
  res.json({ saldo: conta.saldo });
}

function extrato(req, res) {
  const erro = validarVisualizacao({
    numero_conta: req.query.numero_conta,
    senha: req.query.senha,
  });

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.query.numero_conta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.query.numeroConta} não existe.` });
    return;
  }
  if (conta.usuario.senha !== req.query.senha) {
    res.status(400);
    res.json({ erro: "Senha incorreta!" });
    return;
  }
  
  const depositosRealizados = depositos.filter(
    (deposito) => Number(deposito.numero_conta) === Number(req.query.numero_conta)
  );
  const saquesRealizados = saques.filter(
    (saque) => Number(saque.numero_conta) === Number(req.query.numero_conta)
  );
  const transferenciasEnviadas = transferencias.filter(
    (transferencia) =>
      Number(transferencia.numero_conta_origem) === Number(req.query.numero_conta)
  );
  const transferenciasRecebidas = transferencias.filter(
    (transferencia) =>
      Number(transferencia.numero_conta_destino) === Number(req.query.numero_conta)
  );
   
  res.status(200);
  res.json({
    depositosRealizados,
    saquesRealizados,
    transferenciasEnviadas,
    transferenciasRecebidas,
  });
}

module.exports = {
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
};
