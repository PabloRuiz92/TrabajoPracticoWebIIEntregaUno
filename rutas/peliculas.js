const express = require("express");
const router = express.Router();

//fs es un módulo para manejar archivos y lo vamos a necesitar para leer el JSON
const fs = require("fs");

//Funciones modulares
//Funcion de mensaje Pelicula no encontrada
function indiceIncorrecto(res) {
  return res.json({ error: "Indice ingresado incorrecto." });
}

//Funciones de filtro por rango de anios
function filtrarPorRango(peliculas, desde, hasta) {
  return peliculas.filter((p) => {
    const anio = parseInt(p.indice_tiempo.slice(0, 4));
    return anio >= desde && anio <= hasta;
  });
}

//-----------------------------------------------------

//URL de la DB usada: 
//https://datos.gob.ar/dataset/cultura-sector-audiovisual/archivo/cultura_40ce52b7-2240-4c58-b662-803b97df0bc0
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
    res.status(200).json({ mensaje: "Estrenos en este indice", pelicula });
  } else {
    return indiceIncorrecto(res);
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
    return indiceIncorrecto(res);
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
    return indiceIncorrecto(res);
  }

});

//Filtros con logica particular

//GET: /peliculas/anio/:anio busca por año
router.get("/anio/:anio", (req, res) => {
  const anio = req.params.anio;
  const filtrado = peliculas.filter((p) => p.indice_tiempo.startsWith(anio));

  if (filtrado.length > 0) {
    res.json({ mensaje: `Películas del año ${anio}`, peliculas: filtrado });
  } else {
    return res.json({error: `Año ingresado incorrecto, la DB tiene anios desde 2001 a 2023` });
  }

});

//GET: /peliculas/anios/:desde/:hasta busca por rango de años
router.get("/anios/:desde/:hasta", (req, res) => {
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

  const filtrado = filtrarPorRango(peliculas, desde, hasta);

  if (filtrado.length > 0) {
    res.json({mensaje: `Películas entre ${desde} y ${hasta}` , peliculas: filtrado,});
  } else {
    res.json({error: `Año ingresado incorrecto, la DB tiene años desde 2001 a 2023` });
  }

});

//GET: /peliculas/aniosTotal/:desde/:hasta busca por rango de años y mustra el total de peliculas extranjeras/locales
router.get("/aniosTotal/:desde/:hasta", (req, res) => {
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

  const filtrado = filtrarPorRango(peliculas, desde, hasta);

  if (filtrado.length === 0) {
    return res.json({ error: `Año ingresado incorrecto, la DB tiene años desde 2001 a 2023` });
  }

  // Inicializar contadores
  let totalNacionales = 0;
  let totalExtranjeros = 0;

  // Acumular sumas
  filtrado.forEach((p) => {
  //Usamos el || 0 por si el parseInt devuelve NaN
    totalNacionales += parseInt(p.estrenos_film_nacional) || 0;
    totalExtranjeros += parseInt(p.estrenos_film_extranjero) || 0;
  });

  res.json({
    mensaje: `Total entre ${desde} y ${hasta}`,
    total_estrenos_nacionales: `Nacionales: ${totalNacionales}`,
    total_estrenos_extranjeros: `Extranjeras: ${totalExtranjeros}`,
  });

});

//GET: /peliculas/comparaAnios/:anio1/:anio2 compara la cantidad total de peliculas en un 2 años y responde que año tuvo mas estrenos
router.get("/comparaAnios/:anio1/:anio2", (req, res) => {
  const anio1 = req.params.anio1;
  const anio2 = req.params.anio2;

  const busqueda1 = peliculas.filter((p) => p.indice_tiempo.startsWith(anio1));
  if (busqueda1.length === 0) {
    return res.json({error: `Año ${anio1} incorrecto. La DB tiene años desde 2001 a 2023.` });
  }

  const busqueda2 = peliculas.filter((p) => p.indice_tiempo.startsWith(anio2));
  if (busqueda2.length === 0) {
    return res.json({error: `Año ${anio2} incorrecto. La DB tiene años desde 2001 a 2023.` });
  }

  let totalPeliculas1 = 0;
  let totalPeliculas2 = 0;

  busqueda1.forEach((p) => {
    totalPeliculas1 += parseInt(p.estrenos_film_nacional) || 0;
    totalPeliculas1 += parseInt(p.estrenos_film_extranjero) || 0;
  });

  busqueda2.forEach((p) => {
    totalPeliculas2 += parseInt(p.estrenos_film_nacional) || 0;
    totalPeliculas2 += parseInt(p.estrenos_film_extranjero) || 0;
  });

  if (totalPeliculas1 > totalPeliculas2) {
    res.json({
      mensaje: `En el año ${anio1} hubo mas peliculas que en el ${anio2}`,
      anio1: `Total de estrenos en ${anio1}: ${totalPeliculas1}`,
      anio2: `Total de estrenos en ${anio2}: ${totalPeliculas2}`,
    });
  } else {
    res.json({
      mensaje: `En el año ${anio2} hubo mas peliculas que en el ${anio1}`,
      anio1: `Total de estrenos en ${anio1}: ${totalPeliculas1}`,
      anio2: `Total de estrenos en ${anio2}: ${totalPeliculas2}`,
    });
  }
});

/*Aca un ejemplo del formato original del Json, nosotros agregamos el campo ID al principio
  {
    "indice_tiempo": "2018-01-01",
    "estrenos_film_nacional": 239,
    "estrenos_film_extranjero": 309
  },
*/

module.exports = router;