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

    const sql = "INSERT INTO user(nome, email, senha) VALUES (?,?,?);"

    return await conn.query(sql, [user.nome, user.email, user.senha])
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
    const sql = "SELECT * FROM livro WHERE categoria_id = ?;";
    const [rows] = await conn.query(sql, [categoriaId]);
    return rows;
}

async function buscaLivrosPorNome(inputBusca) {
    const conn = await connect();
    const sql = "SELECT * FROM livro WHERE titulo LIKE ? OR autor LIKE ?;";
    const [rows] = await conn.query(sql, [`%${inputBusca}%`, `%${inputBusca}%`]);
    return rows;
}


module.exports = {registraUser, buscaUser, buscaLivros, buscaCategorias, buscaLivrosPorCategoria, buscaLivrosPorNome};