var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BookHub' });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Registrar', action: "/novoUser", query: req.query });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Entrar', action: "/logar", query: req.query });
});

router.post("/logar", async function (req, res) {
  const email = req.body.email;
  const senha = req.body.senha;

  try {
    const user = await db.buscaUser({ email, senha });
    if (user) {
      res.redirect('/'); // Redireciona para a página inicial ou outra página
    } else {
      res.redirect('/login?error=Usuário%20ou%20senha%20inválidos');
    }
  }
  catch (error) {
    console.error("Erro ao logar:", error);
    res.redirect('/login?error=' + encodeURIComponent(error.message));
  }
});

router.post("/novoUser", async function (req, res) {

  const nome = req.body.nome
  const email = req.body.email
  const senhaA = req.body.senhaA
  const senhaB = req.body.senhaB

  if (senhaA !== senhaB) {
    res.redirect('/?error=Senhas%20diferentes');
    return;
  }

  try {
    await db.registraUser({nome, email, senha: senhaA})
    res.redirect('/?novoUser=true');
    console.log("conseguiu registrar")
  }

  catch(error){
    res.redirect('/?error=' + error);
  }
  
})

module.exports = router;
