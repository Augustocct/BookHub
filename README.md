# BookHub

BookHub é uma aplicação web para explorar, favoritar e comentar sobre livros. Descubra novas leituras, veja detalhes dos livros, categorias e compartilhe opiniões com outros leitores.

## Funcionalidades

- Listagem de livros em destaque
- Visualização de detalhes do livro (capa, autor, descrição, categorias)
- Seção de comentários para cada livro
- Sistema de login e registro de usuários
- Adicionar livros aos favoritos
- Busca de livros por nome ou categoria

## Tecnologias Utilizadas

- Node.js
- Express.js
- EJS (Embedded JavaScript Templates)
- Bootstrap 4
- Banco de dados relacional (ex: MySQL, PostgreSQL, SQLite)

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/bookhub.git
   cd bookhub
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   - Crie o banco e as tabelas necessárias (livros, categorias, usuarios, comentarios, etc).
   - Ajuste as configurações de conexão no arquivo `db.js`.

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   Ou, se usar nodemon:
   ```bash
   npx nodemon bin/www
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## Estrutura de Pastas

```
BookHub/
├── routes/
├── views/
├── public/
│   └── stylesheets/
├── db.js
├── app.js
└── package.json
```
