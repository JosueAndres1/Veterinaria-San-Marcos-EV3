const API_URL = 'http://localhost:8080/api/productos'

export async function obtenerProductos() {
    const respuesta = await fetch(API_URL)

    if (!respuesta.ok) {
        throw new Error('Error al obtener los productos')
    }

    return await respuesta.json()
}

export async function crearProducto(producto) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })

    if (!respuesta.ok) {
        throw new Error('Error al crear el producto')
    }

    return await respuesta.json()
}

export async function actualizarProducto(id, producto) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })

    if (!respuesta.ok) {
        throw new Error('Error al actualizar el producto')
    }

    return await respuesta.json()
}

export async function eliminarProducto(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })

    if (!respuesta.ok) {
        throw new Error('Error al eliminar el producto')
    }
}