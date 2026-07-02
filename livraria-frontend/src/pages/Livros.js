import { useState, useEffect } from 'react'

const API = 'http://localhost:3000'

function Livros() {
  const [livros, setLivros] = useState([])
  const [autores, setAutores] = useState([])
  const [form, setForm] = useState({ titulo: '', preco: '', autor_id: '' })
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    buscarLivros()
    buscarAutores()
  }, [])

  async function buscarLivros() {
    const res = await fetch(`${API}/livros`)
    const data = await res.json()
    setLivros(data)
  }

  async function buscarAutores() {
    const res = await fetch(`${API}/autores`)
    const data = await res.json()
    setAutores(data)
  }

  function validar() {
    const novosErros = {}
    if (!form.titulo.trim()) novosErros.titulo = 'Título é obrigatório'
    if (!form.preco) novosErros.preco = 'Preço é obrigatório'
    else if (isNaN(form.preco) || Number(form.preco) <= 0) novosErros.preco = 'Preço deve ser um número positivo'
    if (!form.autor_id) novosErros.autor_id = 'Selecione um autor'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function salvar() {
    if (!validar()) return

    const dados = { titulo: form.titulo, preco: Number(form.preco), autor_id: Number(form.autor_id) }

    if (editando) {
      await fetch(`${API}/livros/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
    } else {
      await fetch(`${API}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
    }

    setForm({ titulo: '', preco: '', autor_id: '' })
    setEditando(null)
    setErros({})
    buscarLivros()
  }

  function editar(livro) {
    setForm({ titulo: livro.titulo, preco: livro.preco, autor_id: livro.autor_id })
    setEditando(livro.id)
  }

  async function excluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) return
    await fetch(`${API}/livros/${id}`, { method: 'DELETE' })
    buscarLivros()
  }

  function cancelar() {
    setForm({ titulo: '', preco: '', autor_id: '' })
    setEditando(null)
    setErros({})
  }

  return (
    <div>
      <form>
        <h3>{editando ? 'Editar Livro' : 'Novo Livro'}</h3>

        <div className="form-group">
          <label>Título</label>
          <input
            className={erros.titulo ? 'erro' : ''}
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            placeholder="Título do livro"
          />
          {erros.titulo && <p className="msg-erro">{erros.titulo}</p>}
        </div>

        <div className="form-group">
          <label>Preço (R$)</label>
          <input
            className={erros.preco ? 'erro' : ''}
            value={form.preco}
            onChange={e => setForm({ ...form, preco: e.target.value })}
            placeholder="Ex: 49.90"
          />
          {erros.preco && <p className="msg-erro">{erros.preco}</p>}
        </div>

        <div className="form-group">
          <label>Autor</label>
          <select
            className={erros.autor_id ? 'erro' : ''}
            value={form.autor_id}
            onChange={e => setForm({ ...form, autor_id: e.target.value })}
          >
            <option value="">Selecione um autor...</option>
            {autores.map(a => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
          {erros.autor_id && <p className="msg-erro">{erros.autor_id}</p>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-salvar" onClick={salvar}>
            {editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && (
            <button type="button" className="btn btn-cancelar" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="topo-lista">
        <h2>Livros cadastrados</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Preço</th>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.length === 0 ? (
            <tr><td colSpan="5">Nenhum livro cadastrado.</td></tr>
          ) : (
            livros.map(livro => (
              <tr key={livro.id}>
                <td>{livro.id}</td>
                <td>{livro.titulo}</td>
                <td>R$ {Number(livro.preco).toFixed(2)}</td>
                <td>{livro.autor_nome}</td>
                <td>
                  <button className="btn btn-editar" onClick={() => editar(livro)}>Editar</button>
                  <button className="btn btn-excluir" onClick={() => excluir(livro.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Livros