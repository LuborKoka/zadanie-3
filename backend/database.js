const Pool = require("pg").Pool;
//const getenv = require("getenv");
//const password = getenv.string("PASS");

const pool = new Pool({
    user: "postgres",
    password: 'postgres',
    database: "VAVJS",
    host: "db",
    port: 5432
})

module.exports = pool;