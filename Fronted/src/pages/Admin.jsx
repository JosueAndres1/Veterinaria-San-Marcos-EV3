import { useState } from 'react'
import { useStore } from '../hooks/useStore.js'
import { formatearPrecio } from '../data/productos.js'
import { imagenes } from '../data/imagenes.js'
import Imagen from '../components/Imagen.jsx'
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
  const {
    productos,
    guardarProductoAPI,
    eliminarProductoAPI
  } = useStore()

  const [autorizado, setAutorizado] = useState(
    () => sessionStorage.getItem('vsm-admin-demo') === 'si'
  )

  const [credenciales, setCredenciales] = useState({
    usuario: '',
    clave: '',
  })

  const [formulario, setFormulario] = useState(productoVacio)
  const [mensaje, setMensaje] = useState('')
  const [procesando, setProcesando] = useState(false)

  function ingresar(evento) {
    evento.preventDefault()

    const credencialesCorrectas =
      credenciales.usuario.trim().toLowerCase() === 'admin' &&
      credenciales.clave.trim() === 'admin123'

    if (!credencialesCorrectas) {
      setMensaje('Usuario o contraseña incorrectos.')
      return
    }

    sessionStorage.setItem('vsm-admin-demo', 'si')
    setMensaje('')
    setAutorizado(true)
  }

  async function guardarProducto(evento) {
    evento.preventDefault()

    const codigoDuplicado = productos.some(
      (producto) =>
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

      setFormulario(productoVacio)
      setMensaje('Producto guardado correctamente en MongoDB.')

    } catch (error) {
      setMensaje('Error al guardar el producto: ' + error.message)
    } finally {
      setProcesando(false)
    }
  }

  function editarProducto(producto) {
    setFormulario({
      ...producto,
      stockCritico: producto.stockCritico ?? 5,
      idOriginal: producto.id
    })

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
    } catch (error) {
      setMensaje('Error al eliminar: ' + error.message)
    } finally {
      setProcesando(false)
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem('vsm-admin-demo')
    setAutorizado(false)
    setCredenciales({ usuario: '', clave: '' })
    setMensaje('')
  }

  if (!autorizado) {
    return (
      <div className="v-pagina">
        <section className="form-tarjeta">
          <h1>Administración</h1>

          <p className="form-ayuda">
            Acceso académico de demostración.
          </p>

          <form onSubmit={ingresar} autoComplete="off">
            <label>
              Usuario
              <input
                required
                value={credenciales.usuario}
                onChange={(evento) =>
                  setCredenciales({
                    ...credenciales,
                    usuario: evento.target.value
                  })
                }
              />
            </label>

            <label>
              Contraseña
              <input
                required
                type="password"
                value={credenciales.clave}
                onChange={(evento) =>
                  setCredenciales({
                    ...credenciales,
                    clave: evento.target.value
                  })
                }
              />
            </label>

            {mensaje && <p role="alert">{mensaje}</p>}

            <button className="v-boton" type="submit">
              Ingresar
            </button>
          </form>

          <p className="form-ayuda">
            Usuario: admin · Clave: admin123
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="v-pagina admin-pagina">

      <header className="admin-cabecera">
        <div>
          <h1>Administrar productos</h1>
          <p>Catálogo conectado con MongoDB Atlas.</p>
        </div>

        <button
          className="v-boton v-boton-secundario"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </header>

      <form
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
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  id: evento.target.value.toUpperCase()
                })
              }
            />
          </label>

          <label>
            Nombre
            <input
              required
              maxLength="100"
              value={formulario.nombre}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  nombre: evento.target.value
                })
              }
            />
          </label>

          <label>
            Categoría
            <input
              required
              value={formulario.categoria}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  categoria: evento.target.value
                })
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
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  precio: evento.target.value
                })
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
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  stock: evento.target.value
                })
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
              disabled={Boolean(formulario.idOriginal)}
              value={formulario.stockCritico}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  stockCritico: evento.target.value
                })
              }
            />
          </label>

          <label className="admin-descripcion">
            Descripción
            <textarea
              required
              maxLength="300"
              value={formulario.descripcion}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  descripcion: evento.target.value
                })
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
          {procesando ? 'Procesando...' : 'Guardar producto'}
        </button>

        {formulario.idOriginal && (
          <button
            className="v-boton v-boton-secundario ms-2"
            type="button"
            onClick={() => setFormulario(productoVacio)}
          >
            Cancelar
          </button>
        )}

      </form>

      <h2>Catálogo ({productos.length})</h2>

      <div className="admin-lista">

        {productos.map((producto) => (
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
                  {formatearPrecio(producto.precio)} ·
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
                className="v-boton v-boton-secundario"
                disabled={procesando}
                onClick={() => editarProducto(producto)}
              >
                Editar
              </button>

              <button
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
        Acceso académico de demostración.
      </p>

    </div>
  )
}