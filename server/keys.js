/*
  House the variables that we 're going
  to need to connect to the running instance
  of redis and the running instance of PostgreSQL
  that will be associated with our application.
*/

module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT
}