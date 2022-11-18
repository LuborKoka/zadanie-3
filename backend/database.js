const Pool = require("pg").Pool;
const getenv = require("getenv");
const password = getenv.string("PASS");

const pool = new Pool({
    user: "postgres",
    password: password,
    database: "VAVJS",
    host: "localhost",
    port: 5432
})

module.exports = pool;