package cl.veterinariasanmarcos.backend.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/estado")
public class EstadoController {

    @GetMapping
    public Map<String, String> obtenerEstado() {
        return Map.of(
            "estado", "OK",
            "mensaje", "Backend Veterinaria San Marcos funcionando"
        );
    }
}