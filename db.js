require('dotenv').config();
const mysql = require('mysql2/promise');

async function connect() {
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log('Conectou no MySQL!');
    return db;
}

connect();

async function registraUser(user) {

    const conn = await connect();

    const sql = "INSERT INTO user(nome, email, senha, data_registro) VALUES (?,?,?,?);"

    return await conn.query(sql, [user.nome, user.email, user.senha, user.data_registro]);
}

async function buscaUser(usuario) {

    const conn = await connect();

    const sql = "SELECT * FROM user WHERE email = ? AND senha = ?;"

    const [rows] = await conn.query(sql, [usuario.email, usuario.senha]);

    if (rows.length === 0) {
        throw new Error("Usuário ou senha inválidos");
    }

    return rows[0];
}

async function buscaUsuarios() {
    const conn = await connect();
    const sql = "SELECT * FROM user;";
    const [rows] = await conn.query(sql);
    return rows;
}

async function buscaComentarios() {
    const conn = await connect();
    const sql = "SELECT * FROM comentarios;";
    const [rows] = await conn.query(sql);
    return rows;
}

async function buscaUserPorId(userId) {
    const conn = await connect();
    const sql = "SELECT * FROM user WHERE id = ?;";
    const [rows] = await conn.query(sql, [userId]);

    return rows[0];
}

async function buscaLivros() {
    const conn = await connect();
    const sql = "SELECT * FROM livro;";
    const [rows] = await conn.query(sql);
    return rows;
}

async function buscaCategorias() {
    const conn = await connect();
    const sql = "SELECT * FROM categoria;";
    const [rows] = await conn.query(sql);
    return rows;
}

async function buscaLivrosPorCategoria(categoriaId) {
    const conn = await connect();
    const sql = `
        SELECT l.* FROM livro l
        JOIN livro_categoria lc ON lc.livro_id = l.id
        WHERE lc.categoria_id = ?;
    `;
    const [rows] = await conn.query(sql, [categoriaId]);
    return rows;
}

async function buscaLivrosPorNome(inputBusca) {
    const conn = await connect();
    const sql = "SELECT * FROM livro WHERE titulo LIKE ? OR autor LIKE ?;";
    const [rows] = await conn.query(sql, [`%${inputBusca}%`, `%${inputBusca}%`]);
    return rows;
}

async function buscaLivroPorId(id) {
    const conn = await connect();
    const sql = "SELECT * FROM livro WHERE id = ?;";
    const [rows] = await conn.query(sql, [id]);
    return rows[0];
}

async function buscaCategoriasPorLivroId(livroId) {
    const conn = await connect();
    const sql = `
    SELECT c.* FROM categoria c
    JOIN livro_categoria lc ON lc.categoria_id = c.id
    WHERE lc.livro_id = ?;
  `;
    const [rows] = await conn.query(sql, [livroId]);
    return rows;
}

async function buscaComentarioPorLivroId(livroId) {
    const conn = await connect();
    const sql = `
    SELECT c.* FROM comentarios c
    JOIN livro_comentario lc ON lc.comentario_id = c.id
    WHERE lc.livro_id = ?
    ORDER BY c.data_registro DESC;
  `;
    const [rows] = await conn.query(sql, [livroId]);
    return rows;

}

async function buscaLivrosFavoritos(userId) {
    const conn = await connect();
    const sql = `
        SELECT l.* FROM livro l
        JOIN livro_favorito lf ON lf.livro_id = l.id
        WHERE lf.user_id = ?;
    `;
    const [rows] = await conn.query(sql, [userId]);
    return rows;
}

async function adicionaFavorito(userId, livroId) {
    const conn = await connect();
    const sql = "INSERT INTO livro_favorito(user_id, livro_id) VALUES (?, ?);";
    return await conn.query(sql, [userId, livroId]);
}

async function removeFavorito(userId, livroId) {
    const conn = await connect();
    const sql = "DELETE FROM livro_favorito WHERE user_id = ? AND livro_id = ?;";
    return await conn.query(sql, [userId, livroId]);
}

async function existeFavorito(userId, livroId) {
    const conn = await connect();
    const sql = "SELECT * FROM livro_favorito WHERE user_id = ? AND livro_id = ?;";
    const [rows] = await conn.query(sql, [userId, livroId]);
    return rows.length > 0;
}

async function atualizaUser(id, nome, email, senha) {
    const conn = await connect();
    const sql = "UPDATE user SET nome = ?, email = ?, senha = ? WHERE id = ?;";
    return await conn.query(sql, [nome, email, senha, id]);
}

async function adicionaComentario(livroId, mensagem, data_registro) {
    const conn = await connect();
    const sqlComentario = "INSERT INTO comentarios(mensagem, data_registro) VALUES (?, ?);";
    const [resultComentario] = await conn.query(sqlComentario, [mensagem, data_registro]);

    const comentarioId = resultComentario.insertId;

    const sqlLivroComentario = "INSERT INTO livro_comentario(livro_id, comentario_id) VALUES (?, ?);";
    return await conn.query(sqlLivroComentario, [livroId, comentarioId]);
}

async function atualizaNota(id, nota) {
    const conn = await connect();
    const sql = "UPDATE livro SET avaliacao = ? WHERE id = ?;";
    return await conn.query(sql, [nota, id]);
}

// ADMIN

async function buscarAdmin(admemail, admsenha) {
    const conn = await connect();
    const sql = "SELECT * FROM admin WHERE admemail = ? AND admsenha = ?";
    const [rows] = await conn.query(sql, [admemail, admsenha]);

    if (rows.length === 0) {
        throw new Error("Admin não encontrado");
    }

    return rows[0];
}

async function atualizaLivro(id, titulo, pdf_url, descricao, capa_url) {
    const conn = await connect();
    const sql = "UPDATE livro SET titulo = ?, pdf_url = ?, descricao = ?, capa_url = ? WHERE id = ?;";
    return await conn.query(sql, [titulo, pdf_url, descricao, capa_url, id]);
}

async function excluiLivro(id) {
    const conn = await connect();
    // Exclui relacionamentos antes de excluir o livro principal
    await conn.query("DELETE FROM livro_categoria WHERE livro_id = ?;", [id]);
    await conn.query("DELETE FROM livro_comentario WHERE livro_id = ?;", [id]);
    await conn.query("DELETE FROM livro_favorito WHERE livro_id = ?;", [id]);
    // Agora pode excluir o livro
    const sql = "DELETE FROM livro WHERE id = ?;";
    return await conn.query(sql, [id]);
}

async function criaLivro(titulo, autor, pdf_url, descricao, capa_url) {
    const conn = await connect();
    const sql = "INSERT INTO livro(titulo, autor, pdf_url, descricao, capa_url) VALUES (?, ?, ?, ?, ?);";
    return await conn.query(sql, [titulo, autor, pdf_url, descricao, capa_url]);
}

async function criaCategoria(nome) {
    const conn = await connect();
    const sql = "INSERT INTO categoria(nome) VALUES (?);";
    return await conn.query(sql, [nome]);
}

async function buscaCategoriaPorId(id) {
    const conn = await connect();
    const sql = "SELECT * FROM categoria WHERE id = ?;";
    const [rows] = await conn.query(sql, [id]);
    return rows[0];
}

async function editarCategoriaPorId(id, nome) {
    const conn = await connect();
    const sql = "UPDATE categoria SET nome = ? WHERE id = ?;";
    return await conn.query(sql, [nome, id]);
}

async function excluiCategoria(id) {
    const conn = await connect();
    // Exclui relacionamentos antes de excluir a categoria principal
    await conn.query("DELETE FROM livro_categoria WHERE categoria_id = ?;", [id]);
    // Agora pode excluir a categoria
    const sql = "DELETE FROM categoria WHERE id = ?;";
    return await conn.query(sql, [id]);
}

async function atualizaStatusUsuario(id, status) {
    const conn = await connect();
    const sql = "UPDATE user SET status = ? WHERE id = ?;";
    return await conn.query(sql, [status, id]);
}

module.exports = {
    registraUser, buscaUser, buscaLivros, buscaCategorias, buscaLivrosPorCategoria, buscaLivrosPorNome,
    buscaLivroPorId, buscaCategoriasPorLivroId, buscaComentarioPorLivroId, adicionaFavorito, buscaUserPorId, atualizaUser,
    buscaLivrosFavoritos, adicionaComentario, removeFavorito, existeFavorito, atualizaNota, buscarAdmin, buscaUsuarios, buscaComentarios,
    atualizaLivro, excluiLivro, criaLivro, criaCategoria, buscaCategoriaPorId, editarCategoriaPorId, excluiCategoria, atualizaStatusUsuario
};