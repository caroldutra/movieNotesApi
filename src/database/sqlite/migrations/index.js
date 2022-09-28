const sqliteConnection = require("..");
const createUsers = require("./createUsers");

async function migrationsRun() {
  const schemas = [createUsers].join("");

  await sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => {
      console.error(error);
    });
}

module.exports = migrationsRun;
