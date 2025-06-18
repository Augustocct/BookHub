var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const livros = await db.buscaLivros();
    const categorias = await db.buscaCategorias();
    console.log(livros); // Veja o que está vindo do banco
    res.render('index', { title: 'BookHub', livros, categorias, user: req.session.user });
  } catch (error) {
    res.render('index', { title: 'BookHub', livros: [], categorias: [], error: error.message });
  }
});

router.get('/register', function (req, res) {
  res.render('register', { title: 'BookHub', action: "/novoUser", user: req.session.user, query: req.query });
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'BookHub', action: "/logar", user: req.session.user, query: req.query });
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      // Redireciona mesmo assim, ou trate o erro como preferir
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

router.get('/descricao', async function (req, res, next) {
  try {
    const id = req.query.id;
    const livro = await db.buscaLivroPorId(id);
    const categorias = await db.buscaCategoriasPorLivroId(id);
    const comentarios = await db.buscaComentarioPorLivroId(id);
    let favorito = false;
    if (req.session.user) {
      favorito = await db.existeFavorito(req.session.user.id, id);
    }
    livro.favorito = favorito;
    res.render('descricao', { title: 'BookHub', livro, categorias, user: req.session.user, comentarios });
  } catch (error) {
    res.render('descricao', { title: 'BookHub', livro: null, categorias: [], comentarios: [], error: error.message });
  }
});

router.get('/addFavorito', async function (req, res, next) {
  try {
    const livroId = req.query.id;
    const userId = req.session.user ? req.session.user.id : null;

    const livro = await db.buscaLivroPorId(livroId);
    if (!livro) {
      return res.redirect('/?error=Livro%20não%20encontrado');
    }

    const favoritoExiste = await db.existeFavorito(userId, livroId);

    let favorito;
    if (favoritoExiste) {
      await db.removeFavorito(userId, livroId);
      favorito = false;
    } else {
      await db.adicionaFavorito(userId, livroId);
      favorito = true;
    }
    res.json({ favorito });

  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    res.status(500).json({ error: 'Erro ao alternar favorito' });
  }
}
);

router.post('/avaliar', async function (req, res) {
  const id = req.query.id;
  const nota = parseInt(req.query.nota, 10);

  try {
    // Salve a avaliação do usuário no banco (crie ou atualize)
    await db.atualizaNota(id, nota);
    res.json({ sucesso: true });
  } catch (error) {
    res.status(500).json({ sucesso: false, error: 'Erro ao salvar avaliação' });
  }
});

router.get('/favoritos', async function (req, res, next) {
  try {
    const userId = req.session.user.id;
    const livrosFavoritos = await db.buscaLivrosFavoritos(userId);
    res.render('favoritos', { title: 'BookHub', livrosFavoritos, user: req.session.user });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.render('favoritos', { title: 'BookHub', livrosFavoritos: [], error: error.message, user: req.session.user });
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

    // --- ADICIONE ESTE BLOCO ---
    let favoritosIds = [];
    if (req.session.user) {
      const favoritos = await db.buscaLivrosFavoritos(req.session.user.id);
      favoritosIds = favoritos.map(fav => fav.id); // ou fav.livro_id, conforme seu retorno
    }
    livros = livros.map(livro => ({
      ...livro,
      favorito: favoritosIds.includes(livro.id)
    }));

    console.log(categorias); // Veja o que está vindo do banco
    res.render('livros', { title: 'BookHub', categorias, livros, user: req.session.user, query: inputBusca });
  } catch (error) {
    res.render('livros', { title: 'BookHub', categorias: [], livros: [], error: error.message });
  }
});

router.get('/perfil', verificaLogin, async function (req, res, next) {
  try {
    const userId = req.session.user.id;
    const user = await db.buscaUserPorId(userId);
    if (!user) {
      return res.redirect('/?error=Usuário%20não%20encontrado');
    }
    const livrosFavoritos = await db.buscaLivrosFavoritos(userId);
    res.render('perfil', { title: 'BookHub', user: req.session.user, livros: livrosFavoritos, query: req.query });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.render('perfil', { title: 'BookHub', user: req.session.user, livrosFavoritos: [], error: error.message });
  }
});

router.get('/detalhesPerfil', verificaLogin, async function (req, res, next) {
  try {
    const userId = req.session.user.id;
    const user = await db.buscaUserPorId(userId);
    if (!user) {
      return res.redirect('/?error=Usuário%20não%20encontrado');
    }
    res.render('detalhesPerfil', { title: 'BookHub', user: req.session.user, query: req.query });
  } catch (error) {
    console.error("Erro ao buscar perfil para edição:", error);
    res.render('detalhesPerfil', { title: 'BookHub', user: req.session.user, error: error.message });
  }
});

router.post('/atualizarPerfil', verificaLogin, async function (req, res) {
  const userId = req.session.user.id;
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  if (senha && senha.length < 8) {
    res.redirect('/detalhesPerfil?error=Senha%20precisa%20ter%20no%20mínimo%208%20caracteres');
    return;
  }

  try {
    await db.atualizaUser(userId, nome, email, senha);
    const userAtualizado = await db.buscaUserPorId(userId);
    req.session.user = userAtualizado; // Atualiza toda a sessão com os dados do banco
    res.redirect('/perfil?atualizado=true');
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.redirect('/detalhesPerfil?error=' + encodeURIComponent(error.message));
  }
}
);

router.post('/comentar', verificaLogin, async function (req, res) {
  const livroId = req.body.livroId;
  const mensagem = req.body.mensagem;
  const userId = req.session.user.id;
  const data_registro = new Date();

  if (!mensagem || mensagem.trim() === "") {
    res.redirect(`/descricao?id=${livroId}&error=Comentário%20não%20pode%20ser%20vazio`);
    return;
  }

  try {
    await db.adicionaComentario(livroId, mensagem, data_registro);
    await db.buscaComentarioPorLivroId(livroId); // Atualiza os comentários após adicionar
    res.redirect(`/descricao?id=${livroId}`);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    res.redirect(`/descricao?id=${livroId}&error=` + encodeURIComponent(error.message));
  }
}
);

router.post("/logar", async function (req, res) {
  const email = req.body.email;
  const senha = req.body.senha;

  try {
    const user = await db.buscaUser({ email, senha });
    if (user) {
      req.session.user = user; // Armazena o usuário na sessão
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
  const dataAtual = new Date();

  if (!senhaA || senhaA.length < 8) {
    res.redirect('/?error=Senha%20precisa%20ter%20no%20mínimo%208%20caracteres');
    return;
  }

  if (senhaA !== senhaB) {
    res.redirect('/?error=Senhas%20diferentes');
    return;
  }

  try {
    await db.registraUser({ nome, email, senha: senhaA, data_registro: dataAtual });
    res.redirect('/?novoUser=true');
    console.log("conseguiu registrar")
  }

  catch (error) {
    res.redirect('/?error=' + error);
  }

})

function verificaLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
    console.log("Usuário logado:", req.session.user);
  } else {
    res.redirect('/login?error=Faça%20login%20para%20acessar');
  }
}

module.exports = router;
