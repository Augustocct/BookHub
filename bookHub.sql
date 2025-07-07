CREATE DATABASE IF NOT EXISTS bookhub;
USE bookhub;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user`
(id, nome, email, senha, status, data_registro)
VALUES(1, 'Augusto', 'augustoconte@gmail.com', '12345678', 'ativo', '2025-06-11 19:09:01');

CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categoria` VALUES 
(1,'Fantasia'),
(2,'Aventura'),
(3,'Ficção'),
(4, 'Terror'),
(5, 'Fantasia'),
(6, 'Biografia'),
(7, 'História'),
(8, 'Mistério');

CREATE TABLE `livro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `autor` varchar(45) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `capa_url` varchar(100) DEFAULT NULL,
  `pdf_url` varchar(100) DEFAULT NULL,
  `avaliacao` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `livro` (id, titulo, autor, descricao, capa_url, pdf_url, avaliacao) VALUES 
(1, '1984', 'George Orwell', 'Livro futurista utopico', '/images/1984.jpg', '/images/hpSecreta.pdf', 3),
(2, 'O Hobbit', 'J.R.R. Tolkien', 'Aventura fantástica na Terra Média', '/images/hobbit.jpg', '/images/hpSecreta.pdf', 3),
(3, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'O início da saga do bruxo Harry Potter', '/images/hp.jpg', '/images/hpSecreta.pdf', 2),
(4, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg', '/images/hpSecreta.pdf', 1),
(5, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg', '/images/hpSecreta.pdf', 4),
(6, 'X-Men: Dias de um Futuro Esquecido', 'Chris Claremont', 'Clássico dos quadrinhos dos mutantes', '/images/xmen.jpg', '/images/hpSecreta.pdf', 5);

CREATE TABLE `livro_categoria` (
  `livro_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  PRIMARY KEY (`livro_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `livro_categoria_ibfk_1` FOREIGN KEY (`livro_id`) REFERENCES `livro` (`id`),
  CONSTRAINT `livro_categoria_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO livro_categoria (livro_id, categoria_id) VALUES
(1, 3),
(2, 2),
(3, 1),
(4, 3),
(5, 2),
(6, 4);


CREATE TABLE `comentarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensagem` text NOT NULL,
  `data_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO comentarios (id, mensagem, data_registro) VALUES 
(1, 'Adorei esse livro, a história é envolvente do começo ao fim!', '2025-06-11 19:09:01'),
(2, 'Os personagens são muito bem construídos, recomendo a leitura.', '2025-06-11 19:09:01'),
(3, 'Achei o final surpreendente, não esperava por isso!', '2025-06-11 19:09:01'),
(4, 'A narrativa é um pouco lenta no início, mas depois melhora bastante.', '2025-06-11 19:09:01'),
(5, 'Um dos melhores livros que já li sobre esse tema.', '2025-06-11 19:09:01');

CREATE TABLE `livro_comentario` (
  `livro_id` int NOT NULL,
  `comentario_id` int NOT NULL,
  PRIMARY KEY (`livro_id`,`comentario_id`),
  KEY `comentario_id` (`comentario_id`),
  CONSTRAINT `livro_comentario_ibfk_1` FOREIGN KEY (`livro_id`) REFERENCES `livro` (`id`),
  CONSTRAINT `livro_comentario_ibfk_2` FOREIGN KEY (`comentario_id`) REFERENCES `comentarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO livro_comentario (livro_id, comentario_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

CREATE TABLE `livro_favorito` (
  `user_id` int NOT NULL,
  `livro_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`livro_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `livro_favorito_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `livro_favorito_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livro` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO livro_favorito (user_id, livro_id) VALUES
(1, 1),
(1, 2),
(1, 3);

CREATE TABLE `livro_lido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `livro_id` int NOT NULL,
  `data_leitura` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('lido','andamento') NOT NULL DEFAULT 'lido',
  `percentual` int DEFAULT '100',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`livro_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `livro_lido_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `livro_lido_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livro` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO livro_lido (user_id, livro_id, data_leitura, status, percentual) VALUES
(1, 1, '2025-07-07 19:24:04', 'lido', 100),
(1, 2, '2025-07-07 19:24:09', 'andamento', 40),
(1, 3, '2025-07-07 19:24:13', 'lido', 100),
(1, 4, '2025-07-07 19:24:19', 'andamento', 60);

CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admemail` varchar(100) NOT NULL,
  `admsenha` varchar(100) NOT NULL,
  `admnome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO admin (admemail, admsenha, admnome) VALUES
('admin@bookhub.com', 'admin123', 'Administrador');