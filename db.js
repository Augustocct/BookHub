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
    WHERE lc.livro_id = ?;
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

async function atualizaUser(id, nome, email, senha) {
    const conn = await connect();
    const sql = "UPDATE user SET nome = ?, email = ?, senha = ? WHERE id = ?;";
    return await conn.query(sql, [nome, email, senha, id]);
}


module.exports = {
    registraUser, buscaUser, buscaLivros, buscaCategorias, buscaLivrosPorCategoria, buscaLivrosPorNome,
    buscaLivroPorId, buscaCategoriasPorLivroId, buscaComentarioPorLivroId, adicionaFavorito, buscaUserPorId, atualizaUser, buscaLivrosFavoritos
};