var express = require('express'); // npm instal express mysql
const cors = require('cors'); // nmp install cors
const session = require('express-session');
const multer = require('multer');
const path = require('path');
var app = express();
const bodyParser = require('body-parser');


// Aumente o limite para, por exemplo, 10MB (em bytes)
app.use(bodyParser.json({ limit: '10mb' }));  // Para JSON
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Para dados de formulários

app.use(session({
    secret: 'codigo', // Uma chave secreta para proteger a sessão
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 'secure: true' apenas se estiver usando HTTPS
}));

app.use(cors());
app.use(express.static('./pages'));

const port = 3000;
const router = express.Router();
app.use(express.json());

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loja"
});

//con.connect((err) => {
///    if (err) throw err;
//    console.log("Connected!");
//});


//logins
router.post("/api/login", (request, response) => {
    const usuario = request.body;
    const email = usuario.email;
    const senha = usuario.senha;

    //const sql = `SELECT * FROM clientes where email = '${email}' and senha = '${senha}'`;
    //con.query(sql, function (err, result) {

    const sql = `SELECT * FROM clientes WHERE email = ? AND senha = ?`;
    con.query(sql, [email, senha], function (err, result) {
        if (err) {
            return response.status(500).json({ error: 'Erro ao acessar o banco de dados' });
        }
        if (err) throw err;
        //TODO caso não ache o usuário deve ser 401
        if (result.length === 0) {
            return response.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        console.log(result);

        request.session.login = result[0];
        response.status(200).json(result[0]);
    });
});

router.get("/api/protected", (request, response) => {
    if (!request.session.login) {
        return response.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Caso esteja autenticado, pode acessar dados da sessão
    response.status(200).json({
        message: 'Acesso autorizado',
        usuario: request.session.login
    });
});
router.get("/api/logout", (request, response) => {
    // Destruir a sessão
    request.session.destroy((err) => {
        if (err) {
            return response.status(500).json({ error: 'Erro ao tentar deslogar' });
        }

        // Redireciona para a página inicial ou outra página de sua escolha
        response.status(200).json({ message: 'Usuário deslogado com sucesso' });
    });
});


// cadastro cliete

router.post("/api/cadastro", (request, response) => {
    const usuario = request.body;

    var sql = `INSERT INTO clientes (nome, email, telefone, CPF, data_cadastro) 
            VALUES 
            (
            '${usuario.nome}', 
            '${usuario.email}', 
            '${usuario.telefone}', 
            '${usuario.cpf}', 
            'NOW()');`;


    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(usuario);
});

// Configuração do multer para salvar a imagem
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Diretório onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Definindo o nome do arquivo com base na data
    }
});

const upload = multer({ storage: storage });

router.post('/api/cadastro_carro_img', upload.single('imagem'), (req, res) => {

    const { modelo, marca, ano, placa, preco_diaria, tipo } = req.body;
    const imagemPath = req.file ? req.file.path : null; // Caminho da imagem

    // Salvar os dados no banco, incluindo o caminho da imagem
    const query = 'INSERT INTO veiculos (modelo, marca, ano, placa, preco_diaria, id_tipo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [modelo, marca, ano, placa, preco_diaria, tipo, imagemPath];

    // Executando a consulta no banco
    con.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar carro' });
        }
        res.status(200).json({ message: 'Carro salvo com sucesso!' });
    });
});
router.post("/api/cadastro_carro", (request, response) => {
    const carro = request.body;

    var sql = `INSERT INTO veiculos (modelo, marca, ano, placa, preco_diaria, disponibilidade, id_tipo) 
            VALUES 
            (
            '${carro.modelo}', 
            '${carro.marca}', 
            '${carro.ano}', 
            '${carro.placa}', 
            '${carro.preco_diaria}',
            '1',
            '${carro.tipo}');`;

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(carro);
});

//update
router.post("/api/update_cli", (request, response) => {
    const usuario = request.body;


    if (usuario.senha == "") {
        var sql = `UPDATE clientes SET email =  '${usuario.email}', telefone =  '${usuario.telefone}' WHERE (id_cliente =  ${usuario.id});`;
    } else {
        var sql = `UPDATE clientes SET email =  '${usuario.email}', telefone =  '${usuario.telefone}', senha =  '${usuario.senha}' WHERE (id_cliente =  '${usuario.id}');`;
    }

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(usuario);
});

router.post("/api/update_carro", (request, response) => {
    const carro = request.body;

    var sql = `UPDATE veiculos SET modelo =  '${carro.modelo}', marca =  '${carro.marca}', ano =  '${carro.ano}', 
    placa = '${carro.placa}', preco_diaria = '${carro.preco_diaria}' WHERE (id_veiculo =  ${carro.id_veiculo});`;

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(carro);
});


//deletar

router.post("/api/deletar_cli", (request, response) => {
    const usuario = request.body;
    var sql = `DELETE FROM clientes WHERE (id_cliente =  ${usuario.id});`;


    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(usuario);
});
router.post("/api/deletar_carro", (request, response) => {
    const carro = request.body;
    var sql = `DELETE FROM veiculos WHERE (id_veiculo =  ${carro.id_veiculo});`;


    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    response.status(201).json(carro);
});




//select

router.get("/api/select_car", (request, response) => {
    var sql = 'SELECT * FROM veiculos';
    con.query(sql, function (err, result) {
        if (err) throw err;
        response.status(200).json(result);
    });
});

app.get('/api/select_id', (req, res) => {
    const id_veiculo = req.query.id; // Pega o parâmetro id da URL
  
    if (!id_veiculo) {
      return res.status(400).json({ error: 'ID do veículo é necessário' });
    }
  
    // Consulta ao banco de dados para pegar os detalhes do carro
    const query = 'SELECT * FROM veiculos WHERE id_veiculo = ?';
    
    con.query(query, [id_veiculo], (err, results) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
  
      res.json(results[0]); // Retorna os detalhes do carro
    });
  });
  


//filter
//reduce
//map

app.use(router);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});