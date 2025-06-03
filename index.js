const express = require("express");
const app = express();

const path = require("path");
const ejs = require("ejs");
const getExtrangeras = require("./db");

app.use(express.json());

const PORT = 7050;
/*
const peliculasRouter = require("./rutas/peliculas");
app.use("/peliculas", peliculasRouter);
*/

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/info", async (req, res) => {
  res.render("index", { resultado: await getExtrangeras() });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
