var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/login', { title: 'BookHub' });
});

router.get('/dashboard', verificaLogin, async function (req, res, next) {
  // Exemplo real: buscar quantidade de usuários
  const usuarios = await db.buscaUsuarios();
  const livros = await db.buscaLivros();
  const categorias = await db.buscaCategorias();
  const comentarios = await db.buscaComentarios();
  const labels = ['Usuários', 'Livros', 'Categorias', 'Comentários'];
  const valores = [usuarios.length, livros.length, categorias.length, comentarios.length];



  res.render('admin/dashboard', {
    title: 'BookHub',
    admin: req.session.admin,
    labels: labels || [],
    valores: valores || [],
  });
});

router.get('/admLivros', verificaLogin, async function (req, res, next) {
  const livros = await db.buscaLivros();
  res.render('admin/admLivros', {
    title: 'BookHub',
    admin: req.session.admin,
    livros: livros || [],
  });
});

router.get('/admDescricao', verificaLogin, async function (req, res, next) {
  const livroId = req.query.id;
  const livro = await db.buscaLivroPorId(livroId);

  if (!livro) {
    return res.status(404).send('Livro não encontrado');
  }

  res.render('admin/admDescricao', {
    title: 'BookHub',
    admin: req.session.admin,
    livro: livro,
  });
});

router.post('/atualizaLivro', verificaLogin, async function (req, res, next) {
  const livroId = req.query.id;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  const capa_url = req.body.capa_url;
  const pdf_url = req.body.pdf_url;

  try {
    await db.atualizaLivro(livroId, titulo, pdf_url, descricao, capa_url);
    res.redirect(`/admin/admDescricao?id=${livroId}&atualizado=true`);
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.redirect('/admin/admDescricao?error=' + encodeURIComponent(error.message));
  }
});

router.post('/excluiLivro', verificaLogin, async function (req, res, next) {
  const livroId = req.query.id;
  try {
    await db.excluiLivro(livroId);
    res.redirect('/admin/admLivros');
  } catch (error) {
    console.error("Erro ao excluir livro:", error);
    res.redirect('/admin/admDescricao?id=' + livroId + '&error=' + encodeURIComponent(error.message));
  }
});

router.post('/login', async function (req, res, next) {
  const admemail = req.body.admemail;
  const admsenha = req.body.admsenha;

  const admin = await db.buscarAdmin(admemail, admsenha);

  if (admin) {
    req.session.admin = admin; // Salva o admin na sessão
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin');
  }
});

function verificaLogin(req, res, next) {
  if (req.session && req.session.admin) {
    next();
    console.log("admin logado:", req.session.admin);
  } else {
    res.redirect('/login?error=Faça%20login%20para%20acessar');
  }
}

module.exports = router;
