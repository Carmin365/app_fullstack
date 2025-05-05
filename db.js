import sqlite3 from 'sqlite3';
import path from 'path';


const dbPath = path.resolve(__dirname, 'slnx.sqlite'); 
const sqlite3db = sqlite3.verbose(); a

let db: sqlite3.Database; 

function connectToDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    db = new sqlite3db.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao abrir banco:', err);
        reject(err);
      } else {
        console.log('Conectado ao banco slnx.sqlite');
        resolve(db);
      }
    });
  });
}

function createUsersTable(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      )
      `,
      (err) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function initializeDatabase() {
  try {
    await connectToDatabase();
    await createUsersTable();
  } catch (error) {
    console.error('Falha ao inicializar o banco de dados:', error);
    throw error; 
  }
}

export { initializeDatabase, db }; 
