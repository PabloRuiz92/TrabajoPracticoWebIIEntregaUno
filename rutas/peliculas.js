const express = require("express");
const router = express.Router();

const fs = require("fs");

const RUTA_JSON = "./estrenosCinePorOrigen.json";

let peliculas = [];

try {
  const datos = fs.readFileSync(RUTA_JSON, "utf8");
  peliculas = JSON.parse(datos);

  peliculas = peliculas.map((p, idx) => ({
    id: idx + 1, 
    ...p,
  }));

  console.log(`Películas cargadas desde archivo JSON (${peliculas.length})`);
} catch (error) {
  console.error("Error al leer el archivo JSON:", error.message);
}

router.get("/", (req, res) => {
  res.status(200).json(peliculas);
});

module.exports = router;