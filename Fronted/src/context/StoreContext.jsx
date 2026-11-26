import { useState, useEffect } from 'react'
import { productos as productosIniciales } from '../data/productos.js'
import { agregarArticulo, cambiarCantidadArticulo, calcularSubtotal } from '../data/carrito.js'
import { StoreContext } from './store.js'
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productoService.js'

const leer = (clave, respaldo) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? respaldo
  } catch {
    return respaldo
  }
}

const adaptarProducto = (producto) => ({
  ...producto,
  categoria: producto.categoria?.nombre ?? 'Sin categoria',
  stockCritico: producto.stockMinimo,
  descripcion: producto.descripcion ?? ''
})

export function StoreProvider({ children }) {
  const [productos, setProductos] = useState(productosIniciales)
  const [carrito, setCarrito] = useState(() => leer('vsm-carrito', []))

  const cargarProductos = async () => {
    const datos = await obtenerProductos()
    setProductos(datos.map(adaptarProducto))
  }

  useEffect(() => {
    cargarProductos().catch((error) => {
      console.error('Error de conexion:', error)
    })
  }, [])

  const guardarProductos = (actualizados) => {
    setProductos(actualizados)
    localStorage.setItem('vsm-productos', JSON.stringify(actualizados))
  }

  const guardarProductoAPI = async (producto, idOriginal) => {
    const anterior = productos.find((p) => p.id === idOriginal)

    const datos = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
      stockMinimo: anterior?.stockMinimo ?? producto.stockCritico ?? 5,
      categoria: {
        nombre: producto.categoria
      },
      proveedorId: anterior?.proveedorId ?? 1
    }

    if (idOriginal) {
      await actualizarProducto(idOriginal, datos)
    } else {
      await crearProducto(datos)
    }

    await cargarProductos()
  }

  const eliminarProductoAPI = async (id) => {
    await eliminarProducto(id)
    await cargarProductos()
  }

  const guardarCarrito = (actualizado) => {
    setCarrito(actualizado)
    localStorage.setItem('vsm-carrito', JSON.stringify(actualizado))
  }

  const agregar = (producto) => {
    guardarCarrito(agregarArticulo(carrito, producto))
  }

  const cambiarCantidad = (id, cantidad) => {
    guardarCarrito(cambiarCantidadArticulo(carrito, id, cantidad))
  }

  const quitar = (id) => {
    guardarCarrito(carrito.filter((item) => item.id !== id))
  }

  const vaciar = () => guardarCarrito([])
  const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0)
  const subtotal = calcularSubtotal(carrito)

  const valor = {
    productos,
    guardarProductos,
    guardarProductoAPI,
    eliminarProductoAPI,
    cargarProductos,
    carrito,
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
    cantidad,
    subtotal,
  }

  return (
    <StoreContext.Provider value={valor}>
      {children}
    </StoreContext.Provider>
  )
}