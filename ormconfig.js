const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "type": "postgres",
  "host": process.env.DB_HOST,
  "port": parseInt(process.env.DB_PORT),
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "entities": [`${__dirname}/**/shared/typeorm/entities/*.entity.{ts,js}`],
  "migrations": [
    `${__dirname}/**/typeorm/migrations/*.{ts,js}`
  ],
  "cli": {
    "migrationsDir": "./src/shared/typeorm/migrations"
  }
}
