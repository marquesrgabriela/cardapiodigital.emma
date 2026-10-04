const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());
app.use(express.static('public'));


// ========================================
// CONEXÃO COM O POSTGRESQL
// ========================================

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cardapio_escolar',
    password: ,
    port: 5432
});


// ========================================
// TESTE DE CONEXÃO COM O BANCO
// ========================================

db.query('SELECT NOW()')
    .then(() => {

        console.log('PostgreSQL conectado com sucesso!');

    })
    .catch((erro) => {

        console.log('Erro ao conectar ao PostgreSQL:');

        console.log(erro.message);

    });


// ========================================
// BUSCAR CARDÁPIO
// ========================================

app.get('/cardapio', async (req, res) => {

    try {

        const resultado = await db.query(`
            SELECT *
            FROM cardapio
            ORDER BY data,
                     CASE
                         WHEN tipo_refeicao = 'Almoço' THEN 1
                         WHEN tipo_refeicao = 'Jantar' THEN 2
                         ELSE 3
                     END
        `);


        res.json(resultado.rows);


    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: 'Erro ao consultar o cardápio'

        });

    }

});


// ========================================
// CADASTRO DE USUÁRIO
// ========================================

app.post('/cadastro', async (req, res) => {

    try {

        const {
            nome,
            cpf,
            email,
            senha,
            tipo_usuario
        } = req.body;


        // Verifica se todos os campos foram preenchidos

        if (!nome || !cpf || !email || !senha || !tipo_usuario) {

            return res.status(400).json({

                sucesso: false,

                mensagem: 'Preencha todos os campos obrigatórios.'

            });

        }


        // Verifica se o usuário já existe

        const usuarioExistente = await db.query(`

            SELECT id_usuario
            FROM usuario
            WHERE email = $1
               OR cpf = $2

        `, [
            email,
            cpf
        ]);


        if (usuarioExistente.rows.length > 0) {

            return res.status(400).json({

                sucesso: false,

                mensagem: 'Este e-mail ou CPF já está cadastrado.'

            });

        }


        // Insere o novo usuário

        const resultado = await db.query(`

            INSERT INTO usuario
                (nome, cpf, email, senha, tipo_usuario)

            VALUES
                ($1, $2, $3, $4, $5)

            RETURNING
                id_usuario,
                nome,
                email,
                tipo_usuario

        `, [
            nome,
            cpf,
            email,
            senha,
            tipo_usuario
        ]);


        res.status(201).json({

            sucesso: true,

            mensagem: 'Cadastro realizado com sucesso!',

            usuario: resultado.rows[0]

        });


    } catch (erro) {

        console.error('Erro ao cadastrar usuário:', erro);


        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao realizar o cadastro.'

        });

    }

});


// ========================================
// LOGIN
// ========================================

app.post('/login', async (req, res) => {

    try {

        const {
            email,
            senha
        } = req.body;


        // Verifica se os campos foram preenchidos

        if (!email || !senha) {

            return res.status(400).json({

                sucesso: false,

                mensagem: 'Preencha o e-mail e a senha.'

            });

        }


        // Procura o usuário no banco

        const resultado = await db.query(`

            SELECT
                id_usuario,
                nome,
                email,
                tipo_usuario

            FROM usuario

            WHERE email = $1
              AND senha = $2

        `, [
            email,
            senha
        ]);


        // Usuário não encontrado

        if (resultado.rows.length === 0) {

            return res.status(401).json({

                sucesso: false,

                mensagem: 'E-mail ou senha incorretos.'

            });

        }


        // Login realizado

        res.json({

            sucesso: true,

            mensagem: 'Login realizado com sucesso!',

            usuario: resultado.rows[0]

        });


    } catch (erro) {

        console.error('Erro ao realizar login:', erro);


        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao realizar o login.'

        });

    }

});


// ========================================
// SALVAR COMENTÁRIO
// ========================================

app.post('/comentario', async (req, res) => {

    try {

        const {
            id_usuario,
            id_cardapio,
            texto
        } = req.body;


        // Verifica se todos os campos foram preenchidos

        if (!id_usuario || !id_cardapio || !texto) {

            return res.status(400).json({

                sucesso: false,

                mensagem: 'Preencha todos os campos obrigatórios.'

            });

        }


        // Insere o comentário no banco

        const resultado = await db.query(`

            INSERT INTO comentario
                (texto, id_usuario, id_cardapio)

            VALUES
                ($1, $2, $3)

            RETURNING
                id_comentario,
                texto,
                data_comentario,
                id_usuario,
                id_cardapio

        `, [
            texto,
            id_usuario,
            id_cardapio
        ]);


        // Retorna os dados do comentário criado

        res.status(201).json({

            sucesso: true,

            mensagem: 'Comentário enviado com sucesso!',

            comentario: resultado.rows[0]

        });


    } catch (erro) {

        console.error('Erro ao salvar comentário:', erro);


        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao salvar o comentário.'

        });

    }

});


// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(3000, () => {

    console.log(
        'Servidor rodando em http://localhost:3000'
    );

});
