import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3'; 
import { initializeDatabase } from './db'; 
const dbPromise = initializeDatabase(); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

function validateCadastro(name, email) {
  const errors = [];
  if (!name) errors.push('Nome é obrigatório.');
  if (!email) errors.push('Email é obrigatório.');
  // Adicione validações mais robustas aqui (ex: formato de email)
  return errors;
}

app.post('/cadastro', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const errors = validateCadastro(name, email);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const db = await dbPromise; 

    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    stmt.run(name, email, function (err) {
      if (err) {
        console.error(err);
        return next(err); 
      }
      res.json({ success: true, id: this.lastID }); 
    });

  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
