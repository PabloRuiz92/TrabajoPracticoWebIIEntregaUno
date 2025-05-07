const express = require("express");
const router = express.Router();

//fs es un módulo para manejar archivos y lo vamos a necesitar para leer el JSON
const fs = require("fs");

//URL de la DB usada: 
//https://datos.gob.ar/dataset/cultura-sector-audiovisual/archivo/cultura_40ce52b7-2240-4c58-b662-803b97df0bc0
//Definimos origen del JSON en un constante para su uso posterior
const RUTA_JSON = "./estrenosCinePorOrigen.json";

//Iniciamos el array peliculas para ingresarle los datos del JSON
let peliculas = [];

function peliculaNoEncontrada(res) {
  return res.json({ error: "Película no encontrada" });
}

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
  res.json({ mensaje: "Listando Peliculas", peliculas});
});

//POST: /peliculas/ agrega película nueva
router.post("/", (req, res) => {
  const nueva = { id: peliculas.length + 1, ...req.body };
  peliculas.push(nueva);
  res.json({ mensaje: "Película agregada", pelicula: nueva });
});

//GET: /peliculas/:id busca en peliculas por ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    const pelicula = peliculas[index];
    res.status(200).json({ mensaje: "Película encontrada", pelicula });
  } else {
    return peliculaNoEncontrada(res);
  }

});

//PUT: /peliculas/:id actualiza una película por ID
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.id === id);

  if (index !== -1) {
    peliculas[index] = { id, ...req.body }; // Reemplazamos los datos
    res.json({ mensaje: "Película actualizada", pelicula: peliculas[index] });
  } else {
    return peliculaNoEncontrada(res);
  }
});

// DELETE: /peliculas/:id elimina una película por ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.id === id);

  if (index !== -1) {
    peliculas.splice(index, 1);
    res.json({ mensaje: "Película eliminada" });
  } else {
    return peliculaNoEncontrada(res);
  }
});

//Filtros con logica particular

///GET: /peliculas/anio/:anio busca por año
router.get("/anio/:anio", (req, res) => {
  const anio = req.params.anio;
  const filtrado = peliculas.filter((p) => p.indice_tiempo.startsWith(anio));

  if (filtrado.length > 0) {
    res.json({ mensaje: `Películas del año ${anio}`, peliculas: filtrado });
  } else {
    return res.json({ error: `No se encontraron películas del año ${anio}` });
  }
});

///GET: /peliculas/anios/:desde/:hasta busca por rango de años
router.get("/anios/:desde/:hasta", (req, res) => {
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

const filtrado = peliculas.filter((p) => {
  const anio = parseInt(p.indice_tiempo.slice(0, 4));
  return anio >= desde && anio <= hasta;
});

if (filtrado.length > 0) {
  res.json({mensaje: `Películas entre ${desde} y ${hasta}` , peliculas: filtrado,});
} else {
  res.json({ error: `No se encontraron películas entre ${desde} y ${hasta}` });
}
});

module.exports = router;