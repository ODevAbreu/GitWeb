CREATE DATABASE Veiculos; 
USE Veiculos;

CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    CPF VARCHAR(20) NOT NULL UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Veiculos  (
	tipo_veiculo VARCHAR(50) NOT NULL , 
    id_veiculo INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    ano INT NOT NULL CHECK (ano>=1886) , 
    placa VARCHAR(10) NOT NULL UNIQUE,
    preco_diaria DECIMAL(10,2) NOT NULL,
    disponibilidade BOOLEAN DEFAULT TRUE
);

INSERT INTO Veiculos ( tipo_veiculo ,modelo, marca, ano, placa, preco_diaria, disponibilidade) VALUES
('CARRO' , ' 911 ' ,  ' PORSHE ' , 2023 , 'ABCDEFG ' , 1000 , TRUE );

select * FROM Veiculos;

CREATE TABLE Reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_carro INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    valor_total DECIMAL(10,2),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_veiculo) REFERENCES Carros(id_veiculo)
);



