const express = require("express");
const router = express.Router();

//fs es un módulo para manejar archivos y lo vamos a necesitar para leer el JSON
const fs = require("fs");

//Definimos origen del JSON en un constante para su uso posterior
const RUTA_JSON = "./estrenosCinePorOrigen.json";

//Iniciamos el array peliculas para ingresarle los datos del JSON
let peliculas = [];

//Aca intentamos leer y guardar el JSON en el array peliculas
try {
  //Leemos el Json y lo guardamos en constante datos
  const datos = fs.readFileSync(RUTA_JSON, "utf8");
  //Convertimos el contenido del archivo JSON en un array de objetos
  peliculas = JSON.parse(datos);

  //Agregamos un campo 'id' numérico a cada película porque no lo tenian
  peliculas = peliculas.map((p, idx) => ({
    id: idx + 1,
    ...p,
  }));

  console.log(`Películas cargadas desde archivo JSON (${peliculas.length})`);
} catch (error) {
  console.error("Error al leer el archivo JSON:", error.message);
}

//CRUD
//GET: /peliculas/ muestra todas las películas en formato JSON
router.get("/", (req, res) => {
  res.status(200).json(peliculas);
});

//POST: /peliculas/ agrega película nueva
router.post("/", (req, res) => {
  const nueva = { id: peliculas.length + 1, ...req.body };
  peliculas.push(nueva);
  res.status(201).json({ mensaje: "Película agregada", pelicula: nueva });
});

//PUT: /peliculas/:id actualiza una película por ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.id === id);

  if (index !== -1) {
    peliculas[index] = { id, ...req.body }; // Reemplazamos los datos
    res.status(200).json({ mensaje: 'Película actualizada', pelicula: peliculas[index] });
  } else {
    res.status(200).json({ error: 'Película no encontrada' });
  }
});

module.exports = router;