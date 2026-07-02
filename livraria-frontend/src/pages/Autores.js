import { useState, useEffect } from 'react'

const API = 'http://localhost:3000'

function Autores() {
  const [autores, setAutores] = useState([])
  const [form, setForm] = useState({ nome: '', email: '' })
  const [erros, setErros] = useState({})
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    buscarAutores()
  }, [])

  async function buscarAutores() {
    const res = await fetch(`${API}/autores`)
    const data = await res.json()
    setAutores(data)
  }

  function validar() {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório'
    if (!form.email.trim()) novosErros.email = 'Email é obrigatório'
    else if (!form.email.includes('@')) novosErros.email = 'Email inválido'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function salvar() {
    if (!validar()) return

    if (editando) {
      await fetch(`${API}/autores/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(`${API}/autores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }

    setForm({ nome: '', email: '' })
    setEditando(null)
    setErros({})
    buscarAutores()
  }

  function editar(autor) {
    setForm({ nome: autor.nome, email: autor.email })
    setEditando(autor.id)
  }

  async function excluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este autor?')) return
    await fetch(`${API}/autores/${id}`, { method: 'DELETE' })
    buscarAutores()
  }

  function cancelar() {
    setForm({ nome: '', email: '' })
    setEditando(null)
    setErros({})
  }

  return (
    <div>
      <form>
        <h3>{editando ? 'Editar Autor' : 'Novo Autor'}</h3>

        <div className="form-group">
          <label>Nome</label>
          <input
            className={erros.nome ? 'erro' : ''}
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            placeholder="Nome do autor"
          />
          {erros.nome && <p className="msg-erro">{erros.nome}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            className={erros.email ? 'erro' : ''}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="email@exemplo.com"
          />
          {erros.email && <p className="msg-erro">{erros.email}</p>}
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
        <h2>Autores cadastrados</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {autores.length === 0 ? (
            <tr><td colSpan="4">Nenhum autor cadastrado.</td></tr>
          ) : (
            autores.map(autor => (
              <tr key={autor.id}>
                <td>{autor.id}</td>
                <td>{autor.nome}</td>
                <td>{autor.email}</td>
                <td>
                  <button className="btn btn-editar" onClick={() => editar(autor)}>Editar</button>
                  <button className="btn btn-excluir" onClick={() => excluir(autor.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Autores