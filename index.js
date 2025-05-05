import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3'; // Importar o tipo Database
import { initializeDatabase } from './db'; // Importar a função de inicialização
const dbPromise = initializeDatabase(); // Inicializar o banco de dados e obter a Promise

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Função para validar os dados de cadastro
function validateCadastro(name, email) {
  const errors = [];
  if (!name) errors.push('Nome é obrigatório.');
  if (!email) errors.push('Email é obrigatório.');
  // Adicione validações mais robustas aqui (ex: formato de email)
  return errors;
}

// Rota para inserir dados do formulário
app.post('/cadastro', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const errors = validateCadastro(name, email);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const db = await dbPromise; // Aguardar a inicialização do banco

    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    stmt.run(name, email, function (err) {
      if (err) {
        console.error(err);
        return next(err); // Passar o erro para o middleware
      }
      res.json({ success: true, id: this.lastID }); // Envia o ID do novo usuário
    });

  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});