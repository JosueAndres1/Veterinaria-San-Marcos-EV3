package cl.veterinariasanmarcos.backend.service;

import cl.veterinariasanmarcos.backend.model.Producto;
import cl.veterinariasanmarcos.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listarProductos() {
        return repository.findAll();
    }

    public Optional<Producto> buscarProducto(String id) {
        return repository.findById(id);
    }

    public Producto crearProducto(Producto producto) {
        return repository.insert(producto);
    }

    public Optional<Producto> actualizarProducto(String id, Producto producto) {
        return repository.findById(id).map(existente -> {
            producto.setId(id);
            return repository.save(producto);
        });
    }

    public void eliminarProducto(String id) {
        repository.deleteById(id);
    }
}