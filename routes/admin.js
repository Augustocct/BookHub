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

router.get('/admCategoria', verificaLogin, async function (req, res, next) {
  const categorias = await db.buscaCategorias();
  res.render('admin/admCategoria', {
    title: 'BookHub',
    admin: req.session.admin,
    categorias: categorias || [],
  });
});

router.get('/editarCategoria', verificaLogin, async function (req, res, next) {
  const categoriaId = req.query.id;
  const categoria = await db.buscaCategoriaPorId(categoriaId);
  if (!categoria) {
    return res.status(404).send('Categoria não encontrada');
  }

  res.render('admin/editarCategoria', {
    title: 'BookHub',
    admin: req.session.admin,
    categoria: categoria,
  });
});

router.post('/atualizaCategoria', verificaLogin, async function (req, res, next) {
  const categoriaId = req.query.id;
  const nome = req.body.nome;

  try {
    await db.editarCategoriaPorId(categoriaId, nome);
    res.redirect('/admin/admCategoria');
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.redirect('/admin/admCategoria?error=' + encodeURIComponent(error.message));
  }
});

router.post('/excluiCategoria', verificaLogin, async function (req, res, next) {
  const categoriaId = req.query.id;

  try {
    await db.excluiCategoria(categoriaId);
    res.redirect('/admin/admCategoria');
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    res.redirect('/admin/admCategoria?error=' + encodeURIComponent(error.message));
  }
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

router.get('/novoLivro', verificaLogin, function (req, res, next) {
  res.render('admin/novoLivro', {
    title: 'BookHub',
    admin: req.session.admin,
  });
});

router.get('/novaCategoria', verificaLogin, async function (req, res, next) {
  const categorias = await db.buscaCategorias();
  res.render('admin/novaCategoria', {
    title: 'BookHub',
    admin: req.session.admin,
    categorias: categorias || [],
  });
});

router.post('/criaCategoria', verificaLogin, async function (req, res, next) {
  const nome = req.body.nome;
  try {
    // Verifica se já existe categoria com o mesmo nome
    const categorias = await db.buscaCategorias();
    const existe = categorias.some(cat => cat.nome.toLowerCase() === nome.toLowerCase());
    if (existe) {
      return res.redirect('/admin/novaCategoria?error=' + encodeURIComponent('Já existe uma categoria com esse nome.'));
    }
    await db.criaCategoria(nome);
    res.redirect('/admin/admCategoria');
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.redirect('/admin/novaCategoria?error=' + encodeURIComponent(error.message));
  }
});

router.post('/criaLivro', verificaLogin, async function (req, res, next) {
  const titulo = req.body.titulo;
  const autor = req.body.autor;
  const descricao = req.body.descricao;
  const capa_url = req.body.capa_url;
  const pdf_url = req.body.pdf_url;

  try {
    await db.criaLivro(titulo, autor, pdf_url, descricao, capa_url);
    res.redirect('/admin/admLivros');
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    res.redirect('/admin/novoLivro?error=' + encodeURIComponent(error.message));
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

router.get('/admUser', verificaLogin, async function (req, res, next) {
  const usuarios = await db.buscaUsuarios();
  res.render('admin/admUser', {
    title: 'BookHub',
    admin: req.session.admin,
    usuarios: usuarios || [],
  });
});

// Atualiza status do usuário
router.post('/atualizaStatusUsuario', verificaLogin, async function (req, res, next) {
  const usuarioId = req.body.usuarioId; // Corrigido para pegar o campo correto do form
  const status = req.body.status;
  try {
    await db.atualizaStatusUsuario(usuarioId, status);
    res.redirect('/admin/admUser?atualizado=true');
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    res.status(500).json({ success: false, error: error.message });
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
