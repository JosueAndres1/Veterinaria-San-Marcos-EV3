const API_URL = 'http://localhost:8080/api/auth'

export async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    if (!respuesta.ok) {
        throw new Error('Correo o contraseña incorrectos')
    }

    const datos = await respuesta.json()

    localStorage.setItem('token', datos.token)
    localStorage.setItem('rol', datos.rol)
    localStorage.setItem('email', datos.email)

    return datos
}

export function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('email')
}

export function obtenerToken() {
    return localStorage.getItem('token')
}

export function estaAutenticado() {
    return !!obtenerToken()
}