const express = require('express')
const db = require('./banco')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
const PORTA = 3000

// GET — listar todos os autores
app.get('/autores', (req, res) => {
  const autores = db.prepare('SELECT * FROM autores').all()
  res.json(autores)
})

// GET — buscar um autor pelo id
app.get('/autores/:id', (req, res) => {
  const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(req.params.id)
  if (!autor) {
    return res.status(404).json({ mensagem: 'Autor não encontrado' })
  }
  res.json(autor)
})

// POST — cadastrar novo autor
app.post('/autores', (req, res) => {
  const { nome, email } = req.body
  const resultado = db.prepare(
    'INSERT INTO autores (nome, email) VALUES (?, ?)'
  ).run(nome, email)
  res.status(201).json({ id: resultado.lastInsertRowid, nome, email })
})

// PUT — editar um autor
app.put('/autores/:id', (req, res) => {
  const { nome, email } = req.body
  db.prepare(
    'UPDATE autores SET nome = ?, email = ? WHERE id = ?'
  ).run(nome, email, req.params.id)
  res.json({ mensagem: 'Autor atualizado com sucesso!' })
})

// DELETE — remover um autor
app.delete('/autores/:id', (req, res) => {
  db.prepare('DELETE FROM autores WHERE id = ?').run(req.params.id)
  res.json({ mensagem: 'Autor removido com sucesso!' })
})

// GET — listar todos os livros (com dados do autor — duas entidades!)
app.get('/livros', (req, res) => {
  const livros = db.prepare(`
    SELECT livros.id, livros.titulo, livros.preco,
           autores.id AS autor_id, autores.nome AS autor_nome, autores.email AS autor_email
    FROM livros
    JOIN autores ON livros.autor_id = autores.id
  `).all()
  res.json(livros)
})

// GET — buscar um livro pelo id (com dados do autor)
app.get('/livros/:id', (req, res) => {
  const livro = db.prepare(`
    SELECT livros.id, livros.titulo, livros.preco,
           autores.id AS autor_id, autores.nome AS autor_nome, autores.email AS autor_email
    FROM livros
    JOIN autores ON livros.autor_id = autores.id
    WHERE livros.id = ?
  `).get(req.params.id)
  if (!livro) {
    return res.status(404).json({ mensagem: 'Livro não encontrado' })
  }
  res.json(livro)
})

// POST — cadastrar novo livro (vinculado a um autor)
app.post('/livros', (req, res) => {
  const { titulo, preco, autor_id } = req.body
  const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(autor_id)
  if (!autor) {
    return res.status(404).json({ mensagem: 'Autor não encontrado' })
  }
  const resultado = db.prepare(
    'INSERT INTO livros (titulo, preco, autor_id) VALUES (?, ?, ?)'
  ).run(titulo, preco, autor_id)
  res.status(201).json({ id: resultado.lastInsertRowid, titulo, preco, autor_id })
})

// PUT — editar um livro
app.put('/livros/:id', (req, res) => {
  const { titulo, preco, autor_id } = req.body
  db.prepare(
    'UPDATE livros SET titulo = ?, preco = ?, autor_id = ? WHERE id = ?'
  ).run(titulo, preco, autor_id, req.params.id)
  res.json({ mensagem: 'Livro atualizado com sucesso!' })
})

// DELETE — remover um livro
app.delete('/livros/:id', (req, res) => {
  db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id)
  res.json({ mensagem: 'Livro removido com sucesso!' })
})

app.listen(PORTA, () => {
  console.log(`Servidor da livraria rodando em http://localhost:${PORTA}`)
})