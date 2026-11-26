package cl.veterinariasanmarcos.backend.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtEncoder jwtEncoder;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    public AuthController(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> datos) {

        String email = datos.get("email");
        String password = datos.get("password");

        if (!adminEmail.equals(email)
                || !adminPassword.equals(password)) {

            return ResponseEntity.status(401)
                .body(Map.of(
                    "mensaje", "Credenciales incorrectas"
                ));
        }

        Instant ahora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("petmarket")
            .issuedAt(ahora)
            .expiresAt(ahora.plusSeconds(3600))
            .subject(email)
            .claim("roles", "ADMIN")
            .build();

        JwsHeader header = JwsHeader
            .with(MacAlgorithm.HS256)
            .build();

        String token = jwtEncoder.encode(
            JwtEncoderParameters.from(header, claims)
        ).getTokenValue();

        return ResponseEntity.ok(Map.of(
            "token", token,
            "rol", "ADMIN",
            "email", email
        ));
    }
}