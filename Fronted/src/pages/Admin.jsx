
import { useState, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore.js'
import { formatearPrecio } from '../data/productos.js'
import { imagenes } from '../data/imagenes.js'
import Imagen from '../components/Imagen.jsx'
import {
  cerrarSesion,
  estaAutenticado
} from '../services/authService.js'
import './Admin.css'

const productoVacio = {
  id: '',
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  stockCritico: 5,
  descripcion: '',
}

export default function Admin() {
  const navigate = useNavigate()
  const formularioRef = useRef(null)

  const {
    productos,
    guardarProductoAPI,
    eliminarProductoAPI
  } = useStore()

  const [formulario, setFormulario] = useState(productoVacio)
  const [mensaje, setMensaje] = useState('')
  const [procesando, setProcesando] = useState(false)

  const autorizado =
    estaAutenticado() &&
    localStorage.getItem('rol') === 'ADMIN'

  function cambiarCampo(campo, valor) {
    setFormulario(anterior => ({
      ...anterior,
      [campo]: valor
    }))
  }

  async function guardarProducto(evento) {
    evento.preventDefault()

    const codigoDuplicado = productos.some(
      producto =>
        producto.id === formulario.id.trim() &&
        producto.id !== formulario.idOriginal
    )

    if (codigoDuplicado) {
      setMensaje('Ese código ya está en uso.')
      return
    }

    setProcesando(true)
    setMensaje('')

    try {
      const nuevoProducto = {
        id: formulario.id.trim(),
        nombre: formulario.nombre.trim(),
        categoria: formulario.categoria.trim(),
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        stockCritico: Number(formulario.stockCritico),
        descripcion: formulario.descripcion.trim()
      }

      await guardarProductoAPI(
        nuevoProducto,
        formulario.idOriginal
      )

      setMensaje(
        formulario.idOriginal
          ? 'Producto actualizado correctamente en MongoDB.'
          : 'Producto guardado correctamente en MongoDB.'
      )

      setFormulario(productoVacio)

    } catch (error) {
      setMensaje('Error al guardar el producto: ' + error.message)
    } finally {
      setProcesando(false)
    }
  }

  function editarProducto(producto) {
    setFormulario({
      id: producto.id,
      nombre: producto.nombre ?? '',
      categoria: producto.categoria ?? '',
      precio: producto.precio ?? '',
      stock: producto.stock ?? 0,
      stockCritico: producto.stockCritico ?? 5,
      descripcion: producto.descripcion ?? '',
      idOriginal: producto.id
    })

    setMensaje('Editando producto: ' + producto.nombre)

    formularioRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  function cancelarEdicion() {
    setFormulario(productoVacio)
    setMensaje('')
  }

  async function eliminarProducto(id) {
    const confirmar = window.confirm(
      '¿Eliminar este producto de MongoDB?'
    )

    if (!confirmar) return

    setProcesando(true)
    setMensaje('')

    try {
      await eliminarProductoAPI(id)

      if (formulario.idOriginal === id) {
        setFormulario(productoVacio)
      }

      setMensaje('Producto eliminado correctamente de MongoDB.')

      formularioRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

    } catch (error) {
      setMensaje('Error al eliminar: ' + error.message)
    } finally {
      setProcesando(false)
    }
  }

  function salir() {
    cerrarSesion()
    sessionStorage.removeItem('vsm-admin-demo')
    navigate('/login', { replace: true })
  }

  if (!autorizado) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="v-pagina admin-pagina">

      <header className="admin-cabecera">
        <div>
          <h1>Administrar productos</h1>
          <p>Catálogo conectado con MongoDB Atlas.</p>
          <p>Sesión: {localStorage.getItem('email')}</p>
        </div>

        <button
          type="button"
          className="v-boton v-boton-secundario"
          onClick={salir}
        >
          Cerrar sesión
        </button>
      </header>

      <form
        ref={formularioRef}
        className="admin-form"
        onSubmit={guardarProducto}
      >
        <h2>
          {formulario.idOriginal
            ? 'Editar producto'
            : 'Agregar producto'}
        </h2>

        <div className="admin-campos">

          <label>
            Código
            <input
              required
              disabled={Boolean(formulario.idOriginal)}
              value={formulario.id}
              onChange={e =>
                cambiarCampo('id', e.target.value.toUpperCase())
              }
            />
          </label>

          <label>
            Nombre
            <input
              required
              maxLength="100"
              value={formulario.nombre}
              onChange={e =>
                cambiarCampo('nombre', e.target.value)
              }
            />
          </label>

          <label>
            Categoría
            <input
              required
              value={formulario.categoria}
              onChange={e =>
                cambiarCampo('categoria', e.target.value)
              }
            />
          </label>

          <label>
            Precio (CLP)
            <input
              required
              type="number"
              min="1"
              step="1"
              value={formulario.precio}
              onChange={e =>
                cambiarCampo('precio', e.target.value)
              }
            />
          </label>

          <label>
            Stock
            <input
              required
              type="number"
              min="0"
              step="1"
              value={formulario.stock}
              onChange={e =>
                cambiarCampo('stock', e.target.value)
              }
            />
          </label>

          <label>
            Stock mínimo
            <input
              required
              type="number"
              min="0"
              step="1"
              value={formulario.stockCritico}
              onChange={e =>
                cambiarCampo('stockCritico', e.target.value)
              }
            />
          </label>

          <label className="admin-descripcion">
            Descripción
            <textarea
              required
              maxLength="300"
              value={formulario.descripcion}
              onChange={e =>
                cambiarCampo('descripcion', e.target.value)
              }
            />
          </label>

        </div>

        {mensaje && <p role="status">{mensaje}</p>}

        <button
          className="v-boton"
          type="submit"
          disabled={procesando}
        >
          {procesando
            ? 'Procesando...'
            : formulario.idOriginal
              ? 'Guardar cambios'
              : 'Guardar producto'}
        </button>

        {formulario.idOriginal && (
          <button
            className="v-boton v-boton-secundario ms-2"
            type="button"
            disabled={procesando}
            onClick={cancelarEdicion}
          >
            Cancelar
          </button>
        )}

      </form>

      <h2>Catálogo ({productos.length})</h2>

      <div className="admin-lista">

        {productos.map(producto => (
          <article
            className="admin-producto"
            key={producto.id}
          >
            <div className="admin-producto-info">

              <Imagen
                src={
                  producto.imagen ||
                  imagenes.productos[producto.id]
                }
                alt={producto.nombre}
                className="admin-producto-imagen"
              />

              <div>
                <strong>{producto.nombre}</strong>

                <p>
                  {producto.id} · {producto.categoria} ·{' '}
                  {formatearPrecio(producto.precio)} ·{' '}
                  Stock {producto.stock}
                </p>

                {producto.stock <= producto.stockCritico && (
                  <p style={{ color: 'red' }}>
                    Requiere reposición
                  </p>
                )}
              </div>

            </div>

            <div className="admin-acciones">

              <button
                type="button"
                className="v-boton v-boton-secundario"
                disabled={procesando}
                onClick={() => editarProducto(producto)}
              >
                Editar
              </button>

              <button
                type="button"
                className="v-boton v-boton-secundario"
                disabled={procesando}
                onClick={() => eliminarProducto(producto.id)}
              >
                Eliminar
              </button>

            </div>
          </article>
        ))}

      </div>

      <p className="form-ayuda">
        Panel de administración con autenticación JWT.
      </p>

    </div>
  )
}
