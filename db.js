const { Database } = require("@sqlitecloud/drivers");
const { SQLITE_URL } = require("./config.js");

async function getExtrangeras() {
    const database = new Database(SQLITE_URL);

  try {
    const result = await database.sql`SELECT * FROM peliculas_extranjeras;`;
    return result;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    throw error;
  }
}

module.exports = getExtrangeras;