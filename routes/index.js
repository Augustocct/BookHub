var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const livros = await db.buscaLivros();
    const categorias = await db.buscaCategorias();
    console.log(livros); // Veja o que está vindo do banco
    res.render('index', { title: 'BookHub', livros, categorias });
  } catch (error) {
    res.render('index', { title: 'BookHub', livros: [], categorias: [], error: error.message });
  }
});

router.get('/register', function (req, res) {
  res.render('register', { title: 'Registrar', action: "/novoUser", query: req.query });
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'Entrar', action: "/logar", query: req.query });
});

router.get('/descricao', async function (req, res, next) {
  try {
    const id = req.query.id;
    const livro = await db.buscaLivroPorId(id);
    const categorias = await db.buscaCategoriasPorLivroId(id);
    const comentarios = await db.buscaComentarioPorLivroId(id);
    res.render('descricao', { title: 'BookHub', livro, categorias, comentarios });
  } catch (error) {
    res.render('descricao', { title: 'Descrição', livro: null, categorias: [], comentarios: [], error: error.message });
  }
});

router.get('/livros', async function (req, res, next) {
  try {
    const categorias = await db.buscaCategorias();
    const categoriaId = req.query.categoria;
    const inputBusca = req.query.inputBusca;
    let livros;
    if (inputBusca) {
      livros = await db.buscaLivrosPorNome(inputBusca);
    } else if (categoriaId) {
      livros = await db.buscaLivrosPorCategoria(categoriaId);
    } else {
      livros = await db.buscaLivros();
    }

    console.log(categorias); // Veja o que está vindo do banco
    res.render('livros', { title: 'BookHub', categorias, livros, query: inputBusca });
  } catch (error) {
    res.render('livros', { title: 'BookHub', categorias: [], livros: [], error: error.message });
  }
});

router.post("/logar", async function (req, res) {
  const email = req.body.email;
  const senha = req.body.senha.min(8);

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
    await db.registraUser({ nome, email, senha: senhaA })
    res.redirect('/?novoUser=true');
    console.log("conseguiu registrar")
  }

  catch (error) {
    res.redirect('/?error=' + error);
  }

})

module.exports = router;
