const express = require("express");
const router = express.Router();

//fs es un módulo para manejar archivos y lo vamos a necesitar para leer el JSON
const fs = require("fs");

//Funciones modulares
//Funcion de mensaje Periodo no encontrado
  function indiceIncorrecto(res) {
    return res.json({ error: "Indice ingresado incorrecto." });
  }

  //Funciones de filtro por rango de anios
  function filtrarPorRango(periodos, desde, hasta) {
    return periodos.filter((p) => {
      const anio = parseInt(p.indice_tiempo.slice(0, 4));
      return anio >= desde && anio <= hasta;
    });
  }

//-----------------------------------------------------

//URL de la DB usada: 
//https://datos.gob.ar/dataset/cultura-sector-audiovisual/archivo/cultura_26914562-e043-4690-8251-fc94dd5ad3cd
//Definimos origen del JSON en un constante para su uso posterior
const RUTA_JSON = "./estrenosCinePorOrigen.json";

//Iniciamos el array periodos para ingresarle los datos del JSON
let periodos = [];

//Aca intentamos leer y guardar el JSON en el array peliculas
try {
  //Leemos el Json y lo guardamos en constante datos
  const datos = fs.readFileSync(RUTA_JSON, "utf8");
  //Convertimos el contenido del archivo JSON en un array de objetos
  periodos = JSON.parse(datos);

  //Agregamos un campo 'id' numérico a cada periodo porque no lo tenian
  periodos = periodos.map((p, idx) => ({
    id: idx + 1,
    ...p,
  }));

  console.log(`Periodos cargados desde archivo JSON (${periodos.length})`);
} catch (error) {
  console.error("Error al leer el archivo JSON:", error.message);
}

//CRUD
//GET /peliculas/ 
//Muestra todos las periodos del JSON
router.get("/", (req, res) => {
  res.json({ mensaje: "Listando Periodos", periodos });

});

//POST /peliculas/ 
//Agrega perdiodo nuevo
router.post("/", (req, res) => {
  const nueva = { id: periodos.length + 1, ...req.body };
  periodos.push(nueva);
  res.json({ mensaje: "Periodo agregado", periodo: nueva });

});

//GET /peliculas/id/:id 
//Busca en periodos por ID
router.get("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = periodos.findIndex((p) => p.id === id);

  if (index !== -1) {
    const periodo = periodos[index];
    res.json({ mensaje: `Estrenos en periodo indice ${id}`, periodo });
  } else {
    return indiceIncorrecto(res);
  }
});

//PUT /peliculas/id/:id 
//Actualiza un periodo por ID
router.put("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = periodos.findIndex((p) => p.id === id);

  if (index !== -1) {
    periodos[index] = { id, ...req.body }; // Reemplazamos los datos
    res.json({ mensaje: "Periodo actualizado", periodo: periodos[index] });
  } else {
    return indiceIncorrecto(res);
  }
});

//DELETE /peliculas/id/:id 
//Elimina un periodo por ID
router.delete("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = periodos.findIndex((p) => p.id === id);

  if (index !== -1) {
    periodos.splice(index, 1);
    res.json({ mensaje: "Periodo eliminado" });
  } else {
    return indiceIncorrecto(res);
  }

});

//Operaciones con logica interna

//GET /peliculas/anio/:anio 
//Busca periodo por año
router.get("/anio/:anio", (req, res) => {
  const anio = req.params.anio;
  const filtrado = periodos.filter((p) => p.indice_tiempo.startsWith(anio));

  if (filtrado.length > 0) {
    res.json({ mensaje: `Películas del año ${anio}`, periodo: filtrado });
  } else {
    return res.json({error: `Año ingresado incorrecto.` });
  }

});

//GET /peliculas/anios/:desde/:hasta
//Muestra los periodos entre 2 años.
router.get("/anios/:desde/:hasta", (req, res) => {
  let desde = parseInt(req.params.desde);
  let hasta = parseInt(req.params.hasta);

  //Esto es por si el usuario ingreso un año mas grande primero, los invierte
  if(desde > hasta){
    let aux = desde;
    desde = hasta;
    hasta = aux;
  }

  const filtrado = filtrarPorRango(periodos, desde, hasta);

  if (filtrado.length > 0) {
    res.json({mensaje: `Películas entre ${desde} y ${hasta}` , periodo: filtrado,});
  } else {
    res.json({error: `Año ingresado incorrecto.` });
  }

});

//GET /peliculas/aniosTotal/:desde/:hasta 
//Busca por rango de años y mustra el total de peliculas extranjeras/locales
router.get("/aniosTotal/:desde/:hasta", (req, res) => {
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

  if (desde > hasta) {
    let aux = desde;
    desde = hasta;
    hasta = aux;
  }

  const filtrado = filtrarPorRango(periodos, desde, hasta);

  if (filtrado.length === 0) {
    return res.json({ error: `Año ingresado incorrecto.` });
  }

  //Inicializar contadores
  let totalNacionales = 0;
  let totalExtranjeros = 0;

  //Acumular sumas
  filtrado.forEach((p) => {
    //Usamos el || 0 por si el parseInt devuelve NaN
    totalNacionales += parseInt(p.estrenos_film_nacional) || 0;
    totalExtranjeros += parseInt(p.estrenos_film_extranjero) || 0;
  });

  res.json({
    mensaje: `Total entre ${desde} y ${hasta}`,
    total_estrenos_nacionales: `${totalNacionales}`,
    total_estrenos_extranjeros: `${totalExtranjeros}`,
  });
});

//GET /peliculas/comparaAnios/:anio1/:anio2 
//Compara la cantidad total de peliculas en 2 años diferentes y responde que año tuvo mas estrenos
/*
router.get("/comparaAnios/:anio1/:anio2", (req, res) => {
  const anio1 = req.params.anio1;
  const anio2 = req.params.anio2;

  const busqueda1 = periodos.filter((p) => p.indice_tiempo.startsWith(anio1));
  const busqueda2 = periodos.filter((p) => p.indice_tiempo.startsWith(anio2));

  if (busqueda1.length === 0 || busqueda2.length === 0) {
    return res.json({ error: `Año ingresado inválido.` });
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
      mensaje: `En el año ${anio1} hubo más estrenos que en ${anio2}`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  } else if (totalPeliculas1 < totalPeliculas2) {
    res.json({
      mensaje: `En el año ${anio2} hubo más estrenos que en ${anio1}`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  } else {
    res.json({
      mensaje: `Ambos años tuvieron la misma cantidad de estrenos`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  }
});*/

//GET /peliculas/comparaAnios?anio1=value&anio2=value
//Compara la cantidad total de peliculas en 2 años diferentes y responde que año tuvo mas estrenos
router.get("/comparaAnios", (req, res) => {
  const anio1 = req.query.anio1;
  const anio2 = req.query.anio2;

  if (!anio1 || !anio2) {
    return res.json({ error: "Debes especificar anio1 y anio2 como parámetros de consulta" });
  }

  const busqueda1 = periodos.filter(p => p.indice_tiempo.startsWith(anio1));
  const busqueda2 = periodos.filter(p => p.indice_tiempo.startsWith(anio2));

  if (busqueda1.length === 0 || busqueda2.length === 0) {
    return res.json({ error: `Año ingresado inválido.` });
  }

  let totalPeliculas1 = 0;
  let totalPeliculas2 = 0;

  busqueda1.forEach(p => {
    totalPeliculas1 += parseInt(p.estrenos_film_nacional) || 0;
    totalPeliculas1 += parseInt(p.estrenos_film_extranjero) || 0;
  });

  busqueda2.forEach(p => {
    totalPeliculas2 += parseInt(p.estrenos_film_nacional) || 0;
    totalPeliculas2 += parseInt(p.estrenos_film_extranjero) || 0;
  });

  if (totalPeliculas1 > totalPeliculas2) {
    res.json({
      mensaje: `En el año ${anio1} hubo más estrenos que en ${anio2}`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  } else if (totalPeliculas1 < totalPeliculas2) {
    res.json({
      mensaje: `En el año ${anio2} hubo más estrenos que en ${anio1}`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  } else {
    res.json({
      mensaje: `Ambos años tuvieron la misma cantidad de estrenos`,
      anio1: `Total: ${totalPeliculas1}`,
      anio2: `Total: ${totalPeliculas2}`,
    });
  }
});

module.exports = router;