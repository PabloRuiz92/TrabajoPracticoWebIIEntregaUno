const express = require("express");
const app = express();

app.use(express.json());

const PORT = 7050;

app.use(express.json());

const peliculasRouter = require("./rutas/peliculas");
app.use("/peliculas", peliculasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
