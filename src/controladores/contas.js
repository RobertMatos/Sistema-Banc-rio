const {
  banco,
  contas,
  saques,
  depositos,
  transferencias,
} = require("../bancodedados");
let proximoId = 1;
function listarContas(req, res) {
  if (req.query.senha_banco != banco.senha) {
    res.status(401);
    res.json({ erro: "senha inválida" });
    return;
  }
  res.status(200);
  res.json(contas);
}

function isEmpty(dadoAluno) {
  return dadoAluno.length === 0 || !dadoAluno.trim();
}
function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}
function validarConta(conta) {
  if (isEmptyObj(conta)) {
    return "Nenhum dado preenchido";
  }
  if (!conta.nome) {
    return "O campo 'nome' é obrigatório";
  }
  if (!conta.cpf) {
    return "O campo 'cpf' é obrigatório";
  }
  if (!conta.data_nascimento) {
    return "O campo 'data_nascimento' é obrigatório";
  }
  if (!conta.telefone) {
    return "O campo 'telefone' é obrigatório";
  }
  if (!conta.email) {
    return "O campo 'email' é obrigatório";
  }
  if (!conta.senha) {
    return "O campo 'senha' é obrigatório";
  }

  if (isEmpty(conta.nome)) {
    return "O campo 'nome' deve ser preenchido";
  }
  if (isEmpty(conta.data_nascimento)) {
    return "O campo 'data_nascimento' deve ser preenchido";
  }
  if (isEmpty(conta.email)) {
    return "O campo 'email' deve ser preenchido";
  }
  if (isEmpty(conta.senha)) {
    return "O campo 'senha' deve ser preenchido";
  }

  if (conta.cpf.length != 11) {
    return "O cpf deve ter apenas 11 digitos";
  }

  const cpfExistente = contas.find(
    (contaData) => contaData.usuario.cpf == conta.cpf
  );
  if (cpfExistente) {
    return "CPF já cadastrado";
  }

  const emailExistente = contas.find(
    (contaData) => contaData.usuario.email == conta.email
  );
  if (emailExistente) {
    return "Email já cadastrado";
  }
}

function criarConta(req, res) {
  const erro = validarConta(req.body);

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  const novaConta = {
    numero: proximoId + "",
    saldo: 0,
    usuario: {
      nome: req.body.nome,
      cpf: req.body.cpf + "",
      data_nascimento: req.body.data_nascimento,
      telefone: req.body.telefone + "",
      email: req.body.email,
      senha: req.body.senha,
    },
  };

  proximoId++;

  contas.push(novaConta);

  res.status(201);
  res.json(novaConta);
}

function atualizarUsuarioConta(req, res) {
  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.params.numeroConta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.params.numeroConta} não existe.` });
    return;
  }
  let erro;
  if (isEmptyObj(req.body)) {
    erro = "Nenhum dado preenchido";
  }

  if (erro) {
    res.status(400);
    res.json({ erro });
    return;
  }

  const indiceContaAtualizada = contas.indexOf(conta);

  if (req.body.nome !== undefined) {
    conta.usuario.nome = req.body.nome;
  }

  if (req.body.cpf !== undefined) {
    const cpfExistente = contas.find(
      (contaData) => contaData.usuario.cpf == req.usuario.cpf
    );
    if (cpfExistente) {
      res.status(400);
      res.json({ erro: "CPF já cadastrado" });
      return;
    }
    conta.usuario.cpf = req.body.cpf;
  }
  if (req.body.data_nascimento !== undefined) {
    conta.usuario.data_nascimento = req.body.data_nascimento;
  }
  if (req.body.telefone !== undefined) {
    conta.usuario.telefone = req.body.telefone;
  }

  if (req.body.email !== undefined) {
    const emailExistente = contas.find(
      (contaData) => contaData.usuario.email = req.usuario.email
    );
    if (emailExistente) {
      res.status(400);
      res.json({ erro: "Email já cadastrado" });
      return;
    }
    conta.usuario.email = req.body.email;
  }

  if (req.body.senha !== undefined) {
    conta.usuario.senha = req.body.senha;
  }
  
  contas[indiceContaAtualizada] = conta;
  res.status(200);
  res.json({ mensagem: "Conta atualizada com sucesso!" });
}

function excluirConta(req, res) {
  const conta = contas.find(
    (conta) => Number(conta.numero) === Number(req.params.numeroConta)
  );

  if (!conta) {
    res.status(404);
    res.json({ erro: `Conta ${req.params.numeroConta} não existe.` });
    return;
  }
  if (conta.usuario.saldo) {
    res.status(400);
    res.json({
      erro: `A conta ${req.params.numeroConta} pois ainda existe dinheiro nela`,
    });
    return;
  }
  const indiceContaParaDeletar = contas.indexOf(conta);
  contas.splice(indiceContaParaDeletar, 1);
  res.json({ mensagem: "Conta excluída com sucesso!" });
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuarioConta,
  excluirConta,
};
