const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool(
    {
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the classlist_db database.`)
  );

  module.exports = pool;