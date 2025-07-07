# BookHub

BookHub é uma aplicação web para gerenciamento de livros, leitura, favoritos, avaliações e administração de usuários, construída com Node.js, Express, EJS e MySQL.

## Pré-requisitos
- Node.js (v16+ recomendado)
- MySQL Server
- DBeaver (opcional, para gerenciar o banco)

## Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd BookHub
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
- Abra o arquivo `bookHub.sql` no DBeaver ou outro gerenciador MySQL.
- Execute todo o script para criar o banco, tabelas e dados iniciais.
- Certifique-se de que o usuário e senha do MySQL estejam corretos no seu `.env`.

Exemplo de `.env`:
```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=bookhub
DB_PORT=3306
SESSION_SECRET=umsegredoseguro
```

### 4. Inicie o servidor
```bash
npm start
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## Usuário Admin
- Email: `admin@bookhub.com`
- Senha: `admin123`

## Funcionalidades
- Cadastro e login de usuários
- Listagem, busca e filtro de livros
- Favoritar e marcar livros como lidos ou em andamento
- Histórico de leitura com status e percentual
- Avaliação e comentários em livros
- Painel administrativo para gerenciar usuários, livros, categorias e permissões

## Estrutura do Projeto
- `routes/` — Rotas da aplicação (usuário e admin)
- `views/` — Templates EJS
- `public/` — Imagens, CSS, arquivos estáticos
- `db.js` — Conexão e funções do banco de dados
- `bookHub.sql` — Script para criar e popular o banco

## Dicas
- Para alterar as imagens dos livros, coloque os arquivos em `public/images/`.
- Para adicionar novas categorias ou livros, utilize o painel admin.
- Para restaurar o banco, basta rodar novamente o `bookHub.sql`.

---

Se tiver dúvidas, abra uma issue ou entre em contato!
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
- Banco de dados relacional (MySQL)

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Augustocct/bookhub.git
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
