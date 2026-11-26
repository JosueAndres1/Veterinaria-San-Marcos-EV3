import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import Imagen from '../components/Imagen.jsx'
import { imagenes } from '../data/imagenes.js'
import { iniciarSesion } from '../services/authService.js'
import '../styles/Formularios.css'

export default function Login() {
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const datos = await iniciarSesion(correo, contrasena)

      if (datos.rol === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="v-pagina">
      <section
        className="form-tarjeta"
        aria-label="Formulario de inicio de sesión"
      >
        <Imagen
          src={imagenes.logo}
          alt="Veterinaria revisando a un perro y un gato"
          style={{ aspectRatio: '2 / 1' }}
        />

        <h1>Iniciar sesión</h1>

        {error && (
          <p className="form-aviso" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={enviar}>
          <Campo
            name="correo"
            etiqueta="Correo electrónico"
            tipo="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            maxLength={100}
            required
            autoComplete="email"
          />

          <Campo
            name="contrasena"
            etiqueta="Contraseña"
            tipo="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            className="v-boton form-boton"
            type="submit"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="form-pie">
          ¿No tienes cuenta?{' '}
          <Link className="v-enlace" to="/registro">
            Regístrate aquí
          </Link>
        </p>
      </section>
    </div>
  )
}