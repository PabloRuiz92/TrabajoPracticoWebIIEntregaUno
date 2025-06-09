Descripción del proyecto:

Este proyecto consiste en una aplicación desarrollada en Node.js utilizando el framework Express, complementada con vistas dinámicas utilizando EJS. La aplicación permite gestionar un catálogo de películas, almacenadas en una base de datos SQLite Cloud. La interfaz permite listar, buscar, agregar, modificar y eliminar películas, además de visualizar estadísticas por año y origen. 
Se utilizo Bootstrap para el desarrollo de la parte frontend y se uso Cypress para la automatización de pruebas.

---

Estructura de la base de datos utilizada:
- peliculas: contiene el título de la película, el ID del año y el ID del origen.
- peliculas_anios: contiene los distintos años de estreno.
- peliculas_origen: contiene los tipos de origen posibles: 'Nacional' o 'Internacional'.

---

Funcionalidad de la aplicación:

La aplicación permite realizar las siguientes acciones:
-	Listar todas las películas registradas de forma general o discriminando por origen
-	Buscar películas por ID o por título
-	Realizar las siguientes acciones a través de formularios:
-	  Buscar películas por ID o por título
-	  Agregar nuevas películas
-	  Editar películas existentes
-	  Eliminar películas por ID o por título

---

Endpoints desarrollados:

- **GET /** – Página de inicio
- **GET /peliculas** – Listado general de películas
- **GET /peliculas/nacionales** – Películas nacionales
- **GET /peliculas/internacionales** – Películas internacionales
- **GET /peliculas/buscar** – Formulario para buscar por ID o título
- **POST /peliculas/buscar** – Resultado de la búsqueda
- **GET /peliculas/agregar** – Formulario para agregar película
- **POST /peliculas/agregar** – Alta de una nueva película
- **GET /peliculas/editar** – Formulario para seleccionar película a editar
- **POST /peliculas/editar** – Guardado de los cambios
- **GET /peliculas/eliminar** – Formulario para eliminar película
- **POST /peliculas/eliminar** – Eliminación por ID o título


