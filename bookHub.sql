-- Tabela user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(45) NOT NULL,
  `data_registro` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user` VALUES (1,'Augusto','augustoconte@gmail.com', 'GutoTeste', '2025-06-11 19:09:01');

-- Tabela categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Tabela livro
CREATE TABLE IF NOT EXISTS `livro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `autor` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(255) NULL,
  `capa_url` VARCHAR(100) NULL,
  `pdf_url` VARCHAR(100) NULL,
  `avaliacao`INT(5) NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `livro` VALUES 
(1,'1984','George Orwell', 'Livro futurista utopico', '/images/1984.jpg'),
(2, 'O Hobbit', 'J.R.R. Tolkien', 'Aventura fantástica na Terra Média', '/images/hobbit.jpg'),
(3, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'O início da saga do bruxo Harry Potter', '/images/hp.jpg', '/images/hpSecreta.pdf'),
(4, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg'),
(5, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg'),
(6, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg');

-- Atualizações nas descrições
UPDATE livro SET descricao = 'Em um futuro distópico, o governo totalitário controla todos os aspectos da vida. Winston Smith desafia o sistema em busca de liberdade e verdade, enfrentando vigilância constante e manipulação da realidade.' WHERE id = 1;

UPDATE livro SET descricao = 'Bilbo Bolseiro embarca em uma jornada inesperada com um grupo de anões para recuperar um tesouro guardado por um dragão. Pelo caminho, enfrenta perigos, descobre coragem e encontra o Um Anel.' WHERE id = 2;

UPDATE livro SET descricao = 'Harry Potter descobre aos 11 anos que é um bruxo e vai estudar em Hogwarts. Lá, faz amigos, enfrenta desafios mágicos e começa a desvendar o mistério de sua origem e do vilão Voldemort.' WHERE id = 3;

UPDATE livro SET descricao = 'Os X-Men precisam impedir um futuro apocalíptico onde mutantes são caçados por Sentinelas. A história alterna entre passado e futuro, mostrando sacrifícios e batalhas para mudar o destino da humanidade.' WHERE id = 4;

UPDATE livro SET descricao = 'Os X-Men enfrentam um cenário sombrio em que a sobrevivência dos mutantes está ameaçada. Viagens no tempo e decisões difíceis marcam essa saga clássica dos quadrinhos.' WHERE id = 5;

UPDATE livro SET descricao = 'Em uma das histórias mais marcantes dos X-Men, os heróis lutam para evitar um futuro devastador, onde a intolerância levou à quase extinção dos mutantes.' WHERE id = 6;

-- Inserção de categorias
INSERT INTO `categoria` VALUES 
(1,'Fantasia'),
(2,'Aventura'),
(3,'Ficção'),
(4, 'Terror'),
(5, 'Fantasia'),
(6, 'Biografia'),
(7, 'História'),
(8, 'Mistério');

-- Tabela livro_categoria
CREATE TABLE IF NOT EXISTS livro_categoria (
  livro_id INT,
  categoria_id INT,
  PRIMARY KEY (livro_id, categoria_id),
  FOREIGN KEY (livro_id) REFERENCES livro(id),
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Tabela comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id INT NOT NULL AUTO_INCREMENT,
  mensagem TEXT NOT NULL,
  data_registro DATETIME NULL,
  PRIMARY KEY (id)
);

-- Tabela livro_comentario
CREATE TABLE IF NOT EXISTS livro_comentario (
  livro_id INT,
  comentario_id INT,
  PRIMARY KEY (livro_id, comentario_id),
  FOREIGN KEY (livro_id) REFERENCES livro(id),
  FOREIGN KEY (comentario_id) REFERENCES comentarios(id)
);

-- Inserções nos comentários
INSERT INTO comentarios (id, mensagem, data_registro) VALUES 
(1, 'Adorei esse livro, a história é envolvente do começo ao fim!', '2025-06-11 19:09:01'),
(2, 'Os personagens são muito bem construídos, recomendo a leitura.', '2025-06-11 19:09:01'),
(3, 'Achei o final surpreendente, não esperava por isso!', '2025-06-11 19:09:01'),
(4, 'A narrativa é um pouco lenta no início, mas depois melhora bastante.', '2025-06-11 19:09:01'),
(5, 'Um dos melhores livros que já li sobre esse tema.', '2025-06-11 19:09:01');

CREATE TABLE livro_favorito (
  user_id INT NOT NULL,
  livro_id INT NOT NULL,
  PRIMARY KEY (user_id, livro_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (livro_id) REFERENCES livro(id)
);

INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (1, 1);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (1, 2);

-- Livro 2 em três categorias
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (2, 1);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (2, 2);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (2, 3);

-- Livro 3 em uma categoria
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (3, 1);

-- Livro 4 em duas categorias
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (4, 2);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (4, 3);

-- Livro 5 em todas as categorias
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (5, 1);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (5, 2);
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (5, 3);

-- Livro 6 em uma categoria
INSERT INTO livro_categoria (livro_id, categoria_id) VALUES (6, 3);

INSERT INTO livro_comentario (livro_id, comentario_id) VALUES (1, 1);
INSERT INTO livro_comentario (livro_id, comentario_id) VALUES (1, 2);
INSERT INTO livro_comentario (livro_id, comentario_id) VALUES (2, 3);
INSERT INTO livro_comentario (livro_id, comentario_id) VALUES (2, 4);
INSERT INTO livro_comentario (livro_id, comentario_id) VALUES (3, 5);


CREATE TABLE admin (
	id int(11) auto_increment NOT NULL,
	admemail varchar(100) NOT NULL,
	admsenha varchar(100) NOT NULL,
	admnome varchar(100) NOT NULL,
	CONSTRAINT admin_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO admin
(id, admemail, admsenha, admnome)
VALUES(0, 'admTeste@gmail.com', 'admSenha', 'Adm Augusto');