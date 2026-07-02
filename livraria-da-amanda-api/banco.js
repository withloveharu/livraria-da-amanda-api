const Database = require('better-sqlite3')

const db = new Database('livraria.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS autores (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nome   TEXT NOT NULL,
    email  TEXT NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT NOT NULL,
    preco     REAL NOT NULL,
    autor_id  INTEGER NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES autores(id)
  )
`)

module.exports = db