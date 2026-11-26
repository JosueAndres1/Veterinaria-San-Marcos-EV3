# Veterinaria San Marcos - Evaluación 3

## Descripción del proyecto

Veterinaria San Marcos es una aplicación web Fullstack orientada
a la gestión y comercialización de productos y servicios veterinarios.

El sistema permite consultar productos, visualizar sus detalles,
utilizar un carrito de compras y administrar el inventario mediante
una conexión con una base de datos no relacional MongoDB Atlas.

## Integrantes

- Josué Vera
- Pablo Díaz

## Tecnologías utilizadas

### Frontend
- React
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Java 21
- Spring Boot
- Maven
- API REST
- Spring Data MongoDB

### Base de datos
- MongoDB Atlas
- Base de datos: petmarket_ev3
- Colección: productos

## Funcionalidades implementadas

- Catálogo de productos.
- Búsqueda y filtrado por categorías.
- Visualización de detalles de productos.
- Carrito de compras.
- Registro e inicio de sesión.
- Panel de administración demostrativo.
- Creación de productos.
- Consulta de productos.
- Actualización de productos.
- Eliminación de productos.
- Alerta de reposición por stock mínimo.
- Persistencia de productos en MongoDB Atlas.

## Arquitectura del sistema

React → API REST → Spring Boot → MongoDB Atlas

El frontend realiza solicitudes HTTP al backend, que procesa
las operaciones y se comunica con la base de datos.

## Endpoints de la API REST

| Método | Endpoint | Funcionalidad |
|--------|----------|---------------|
| GET | /api/productos | Listar productos |
| GET | /api/productos/{id} | Buscar producto |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/{id} | Actualizar producto |
| DELETE | /api/productos/{id} | Eliminar producto |

## Estructura del proyecto

- Backend/: aplicación Spring Boot.
- Fronted/: aplicación React.
- .gitignore: exclusión de archivos innecesarios y configuraciones locales.

## Instrucciones de ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/JosueAndres1/Veterinaria-San-Marcos-EV3.git
cd Veterinaria-San-Marcos-EV3
```

### 2. Ejecutar el backend

Desde PowerShell:

```powershell
cd Backend
$env:MONGODB_URI = "URI_DE_CONEXION"
.\mvnw.cmd spring-boot:run
```

La URI debe configurarse con las credenciales autorizadas de MongoDB Atlas.

Backend disponible en:
http://localhost:8080

### 3. Ejecutar el frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
cd Fronted
npm install
npm run dev
```

Frontend disponible en:
http://localhost:5173

## Seguridad

Las credenciales de MongoDB se administran mediante variables
de entorno y no deben publicarse en GitHub.

El acceso administrativo actual es de carácter académico
y demostrativo, no corresponde a una autenticación de producción.

## Contexto académico

- Institución: Duoc UC
- Carrera: Ingeniería en Informática
- Asignatura: Desarrollo Fullstack II
- Evaluación Parcial 3
- Año: 2026

## Estado del proyecto

Proyecto académico en desarrollo, con integración funcional
entre frontend, backend y base de datos no relacional.
