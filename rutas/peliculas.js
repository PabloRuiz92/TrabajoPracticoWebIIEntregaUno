const express = require("express");
const router = express.Router();
const { Database } = require("@sqlitecloud/drivers");
const { SQLITE_URL } = require("../config");

// Crear una instancia de la base de datos
const database = new Database(SQLITE_URL);

// GET /peliculas/ - Obtiene todas las películas de la base de datos con el año de estreno y el origen
router.get("/listado", async (req, res) => {
  try {
    const peliculas = await database.sql`
      SELECT p.id, p.titulo, pa.anio, po.origen
      FROM peliculas p
      JOIN peliculas_anios pa ON p.anio_id = pa.id
      JOIN peliculas_origen po ON p.origen_id = po.id
      ORDER BY pa.anio;
    `;

    res.render("listado", { peliculas });
  } catch (error) {
    console.error("Error al obtener películas:", error.message);
  }
});

// GET /peliculas/nacionales - Obtiene todas las películas nacionales de la base de datos
router.get("/nacionales", async (req, res) => {
  try {
    const peliculas = await database.sql`
      SELECT p.id, p.titulo, pa.anio, po.origen
      FROM peliculas p
      JOIN peliculas_anios pa ON p.anio_id = pa.id
      JOIN peliculas_origen po ON p.origen_id = po.id
      WHERE po.origen = 'Nacional'
      ORDER BY pa.anio;
    `;

    res.render("nacionales", { peliculas });
  } catch (error) {
    console.error("Error al obtener películas:", error.message);
  }
});

// GET /peliculas/extrangeras - Obtiene todas las películas internacionales de la base de datos
router.get("/internacionales", async (req, res) => {
  try {
    const peliculas = await database.sql`
      SELECT p.id, p.titulo, pa.anio, po.origen
      FROM peliculas p
      JOIN peliculas_anios pa ON p.anio_id = pa.id
      JOIN peliculas_origen po ON p.origen_id = po.id
      WHERE po.origen = 'Internacional'
      ORDER BY pa.anio;
    `;

    res.render("internacionales", { peliculas });
  } catch (error) {
    console.error("Error al obtener películas:", error.message);
  }
});

// POST /peliculas/agregar - Pagina con formulario para agregar peliculas
router.get("/agregar", (req, res) => {
  res.render("agregar", { mensaje: null });
});

// Aca esta el metodo que usa la form para agregar pelicula
router.post("/agregar", async (req, res) => {
  const { titulo, anio, origen } = req.body;

  try {
    // Buscamos si ya existe ese año
    let comprobar_anio =
      await database.sql`SELECT id FROM peliculas_anios WHERE anio = ${anio}
    `;

    let anioId;

    // Aca comprobamos si ya existe o no el año ingresado
    if (comprobar_anio.length > 0) {
      // Si existe lo guardamos para el insert
      anioId = comprobar_anio[0].id;
    } else {
      // Si no existe, lo insertamos y usamos returning para recuperar el id de la query insert
      const insert = await database.sql`INSERT INTO peliculas_anios (anio) 
        VALUES (${anio})
        RETURNING id
      `;
      anioId = insert[0].id;
    }

    // Hacemos el insert dependiendo si es de origen nacional o extrangera
    if (origen === "Nacional") {
      await database.sql`
        INSERT INTO peliculas (titulo, anio_id, origen_id)
        VALUES (${titulo}, ${anioId}, 1)
      `;
    } else {
      await database.sql`
        INSERT INTO peliculas (titulo, anio_id, origen_id)
        VALUES (${titulo}, ${anioId}, 2)
      `;
    }

    res.render("agregar", {
      mensaje: "Película insertada correctamente.",
    });

    //res.redirect("/peliculas/listado");
  } catch (error) {
    console.error("Error al agregar película:", error);
    res.render("agregar", {
      mensaje: "Error al agregar película.",
    });
  }
});

// GET /peliculas/buscar - Pagina con formularios para buscar peliculas por ID o titulo
router.get("/buscar", (req, res) => {
  res.render("buscar", { mensaje: null, busqueda: null });
});

// Aca esta el metodo que usa la form para buscar pelicula por ID
router.post("/buscar_id", async (req, res) => {
  const { id } = req.body;

  try {
    let busqueda = await database.sql`
      SELECT p.id, p.titulo, pa.anio, po.origen
      FROM peliculas p
      JOIN peliculas_anios pa ON p.anio_id = pa.id
      JOIN peliculas_origen po ON p.origen_id = po.id
      WHERE p.id = ${id}
    `;

    if (busqueda.length > 0) {
      res.render("buscar", {
        busqueda: busqueda[0],
        mensaje: "Película encontrada.",
      });
    } else {
      res.render("buscar", {
        busqueda: null,
        mensaje: "No se encontró la película con ese ID.",
      });
    }

  } catch (error) {
    console.error("Error al buscar película:", error);
    res.render("buscar", {
      busqueda: null,
      mensaje: "Error al buscar película.",
    });
  }
});

// Aca esta el metodo que usa la form para buscar pelicula por titulo
router.post("/buscar_titulo", async (req, res) => {
  const { titulo } = req.body;

  try {
    let busqueda = await database.sql`
        SELECT p.id, p.titulo, pa.anio, po.origen
        FROM peliculas p
        JOIN peliculas_anios pa ON p.anio_id = pa.id
        JOIN peliculas_origen po ON p.origen_id = po.id
        WHERE p.titulo = ${titulo}
      `;

    if (busqueda.length > 0) {
      res.render("buscar", {
        busqueda: busqueda[0],
        mensaje: "Película encontrada.",
      });
    } else {
      res.render("buscar", {
        busqueda: null,
        mensaje: "No se encontró la película con ese título.",
      });
    }
  } catch (error) {
    console.error("Error al buscar película:", error);
    res.render("buscar", {
      busqueda: null,
      mensaje: "Error al buscar película.",
    });
  }
});

// PUT /peliculas/editar - Pagina con formulario para editar peliculas
router.get("/editar", async (req, res) => {
  try {
    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;

    res.render("editar", { mensaje: null, titulos });
  } catch (error) {
    console.error("Error al buscar datos:", error);
    res.render("editar", {
      mensaje: "Error al buscar datos.",
      titulos: [],
    });
  }
});

// Aca esta el metodo que usa la form para editar peliculas
router.post("/editar", async (req, res) => {
  const { tituloViejo, tituloNuevo, anioNuevo, origenNuevo } = req.body;

  try {
    // Primero buscamos si el año nuevo ya existe o hay que insertarlo
    // como hicimos antes pero esta vez es porque si llegan a updatear una pelicula a un año que no exite hay que agregarlo
    let comprobar_anio =
      await database.sql`SELECT id FROM peliculas_anios WHERE anio = ${anioNuevo}
    `;

    let anioId;

    // Aca comprobamos si ya existe o no el año ingresado
    if (comprobar_anio.length > 0) {
      // Si existe lo guardamos para el insert
      anioId = comprobar_anio[0].id;
    } else {
      // Si no existe, lo insertamos y usamos returning para recuperar el id de la query insert
      const insert = await database.sql`INSERT INTO peliculas_anios (anio) 
        VALUES (${anioNuevo})
        RETURNING id
      `;
      anioId = insert[0].id;
    }

    await database.sql`
        UPDATE peliculas
        SET titulo = ${tituloNuevo}, anio_id = ${anioId}, origen_id = ${origenNuevo}
        WHERE titulo = ${tituloViejo}
      `;

    mensaje= "Película actualizada correctamente.";

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;

    res.render("editar", { mensaje, titulos });

  } catch (error) {
    console.error("Error al editar película:", error);
    res.render("editar", {
      mensaje: "Error al intentar editar la película.",
      titlos,
    });
  }
});

// DELETE /peliculas/eliminar - Pagina con formulario para eliminar peliculas por titulo
router.get("/eliminar", async (req, res) => {
  try {
    const ids = await database.sql`
      SELECT id 
      FROM peliculas
      ORDER BY id ASC;
    `;

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;

    res.render("eliminar", { mensaje: null, ids, titulos });
  } catch (error) {
    console.error("Error al buscar datos:", error);

    res.render("eliminar", {
      mensaje: "Error al buscar datos.",
      ids: [],
      titulos: [],
    });
  }
});

// Aca esta el metodo que usa la form para eliminar peliculas por titulo
router.post("/eliminar_id", async (req, res) => {
  const { id } = req.body;

  try {
    //Buscamos apra ver si existe la pelicula en la db
    let busqueda = await database.sql`
        SELECT * FROM peliculas
        WHERE id = ${id};
      `;

    if (busqueda.length > 0) {
      // Si existe la borramos
      await database.sql`
        DELETE FROM peliculas
        WHERE id = ${id};
      `;

      mensaje= `Película "${busqueda[0].titulo}" borrada correctamente.`;

    //Si no existe informamos al usuario
    } else {
      mensaje= "No se encontró la película con ese ID. Borrado abortado";
    }

    const ids = await database.sql`
      SELECT id 
      FROM peliculas
      ORDER BY id ASC;
    `;

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;

    res.render("eliminar", { mensaje, ids, titulos });

  } catch (error) {
    console.error("Error al borrar película:", error);
    const ids = await database.sql`
      SELECT id 
      FROM peliculas
      ORDER BY id ASC;
    `;

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;
    res.render("eliminar", {
      mensaje: "Error al borrar película.",
      ids,
      titulos,
    });
  }
});

// Aca esta el metodo que usa la form para eliminar peliculas por titulo
router.post("/eliminar_titulo", async (req, res) => {
  const { titulo } = req.body;

  try {
    //Buscamos apra ver si existe la pelicula en la db
    let busqueda = await database.sql`
        SELECT * FROM peliculas
        WHERE titulo = ${titulo};
      `;

    if (busqueda.length > 0) {
      // Si existe la borramos
      await database.sql`
        DELETE FROM peliculas
        WHERE titulo = ${titulo};
      `;

      mensaje= `Película "${busqueda[0].titulo}" borrada correctamente.`;

    } else {
      mensaje= "No se encontró la película con ese título. Borrado abortado";
    }

    const ids = await database.sql`
      SELECT id 
      FROM peliculas
      ORDER BY id ASC;
    `;

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;

    res.render("eliminar", { mensaje, ids, titulos });

  } catch (error) {
    const ids = await database.sql`
      SELECT id 
      FROM peliculas
      ORDER BY id ASC;
    `;

    const titulos = await database.sql`
      SELECT DISTINCT titulo 
      FROM peliculas
      ORDER BY titulo ASC;
    `;
    res.render("eliminar", {
      mensaje: "Error al borrar película.",
      ids,
      titulos,
    });
  }
});

// Comparador /peliculas/comparar - Pagina con formulario para elegir los años a comparar
router.get("/comparar", async (req, res) => {
  try {
    const anios = await database.sql`
      SELECT DISTINCT anio 
      FROM peliculas_anios 
      ORDER BY anio ASC;
    `;

    res.render("comparar", { mensaje: null, anios });

  } catch (error) {
    console.error("Error al buscar años:", error);

    res.render("comparar", {
      mensaje: "Error al buscar años.",
      anios: [],
    });

  }
});

// Aca esta el metodo que usa la form para eliminar peliculas por titulo
router.post("/comparar", async (req, res) => {
  const { anioA , anioB } = req.body;

  try {
    //Creamos una variable para guardar id de años
    const IdAnioA = await database.sql`
      SELECT id
      FROM peliculas_anios
      WHERE anio = ${anioA};
    `;

    const IdAnioB = await database.sql`
      SELECT id
      FROM peliculas_anios
      WHERE anio = ${anioB};
    `;

    const idA = IdAnioA[0].id;
    const idB = IdAnioB[0].id;

    //Contamos cantidades de cada año
    const cantidadA = (await database.sql`
      SELECT COUNT(*) AS cantidad
      FROM peliculas
      WHERE anio_id = ${idA};
    `)[0].cantidad;

    const cantidadB = (await database.sql`
      SELECT COUNT(*) AS cantidad
      FROM peliculas
      WHERE anio_id = ${idB};
    `)[0].cantidad;

    let mensaje;

    if (cantidadA > cantidadB) {
      mensaje = `En el año ${anioA} hubo más estrenos (${cantidadA}) que en ${anioB} (${cantidadB}).`;
    } else if (cantidadA < cantidadB) {
      mensaje = `En el año ${anioB} hubo más estrenos (${cantidadB}) que en ${anioA} (${cantidadA}).`;
    } else {
      mensaje = `Ambos años tuvieron la misma cantidad de estrenos (${cantidadA}).`;
    }

    //Traemos de vuelta los datos para los selectores
    const anios = await database.sql`
      SELECT DISTINCT anio 
      FROM peliculas_anios 
      ORDER BY anio ASC;
    `;

    res.render("comparar", {
      mensaje,
      anios,
    });
    
  } catch (error) {
    console.error("Error al comparar arños:", error);
    res.render("comparar", {
      mensaje: "Error al comparar años.",
      anios: [],
    });
  }
});

module.exports = router;