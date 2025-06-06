const express = require("express");
const app = express();
const peliculasRouter = require("./rutas/peliculas");

const path = require("path");
const ejs = require("ejs");

// Middleware para permitir la form
app.use(express.urlencoded({ extended: true }));

// Middleware para permitir recibir JSON en el body de las solicitudes
app.use(express.json());

// Aca agregamos el css y usamos /public como ruta para las imagenes para las imagenes
app.use("/css", express.static(path.join(__dirname, "css")));
app.use(express.static("public"));

// Middleware para rutas de películas
app.use("/peliculas", peliculasRouter);

// Motor de vistas y ruta a la carpeta de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = 7050;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
