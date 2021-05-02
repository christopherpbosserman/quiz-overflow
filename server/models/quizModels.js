const { Pool } = require('pg');
require('dotenv').config();

const PGURI = process.env.PGURI;

const pool = new Pool({
  connectionString: PGURI,
  max: 3,
});

module.exports = {
  query: (text, params, callback) => {
    // console.log('Executed query:', text);
    return pool.query(text, params, callback);
  },
};
