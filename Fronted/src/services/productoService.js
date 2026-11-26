const API_URL = 'http://localhost:8080/api/productos'

function obtenerHeaders() {
    const token = localStorage.getItem('token')

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

export async function obtenerProductos() {
    const respuesta = await fetch(API_URL)

    if (!respuesta.ok) {
        throw new Error(`Error al obtener productos: HTTP ${respuesta.status}`)
    }

    return await respuesta.json()
}

export async function crearProducto(producto) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: obtenerHeaders(),
        body: JSON.stringify(producto)
    })

    if (!respuesta.ok) {
        throw new Error(`Error al crear producto: HTTP ${respuesta.status}`)
    }

    return await respuesta.json()
}

export async function actualizarProducto(id, producto) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: obtenerHeaders(),
        body: JSON.stringify(producto)
    })

    if (!respuesta.ok) {
        throw new Error(`Error al actualizar producto: HTTP ${respuesta.status}`)
    }

    return await respuesta.json()
}

export async function eliminarProducto(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: obtenerHeaders()
    })

    if (!respuesta.ok) {
        throw new Error(`Error al eliminar producto: HTTP ${respuesta.status}`)
    }
}