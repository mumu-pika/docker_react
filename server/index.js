const keys = require('./keys')

// Express App Setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
/* 
  bodyParser.json() will turn the body of
  the post request into a JSON value that
  Express api can easily work with.
*/
app.use(bodyParser.json())

// Postgres Client Setup
/*
  Postgres is SQL, very similar to MySQL.
  Here PGSQL is going to store the indices
  of any submitted value.
  It's not going to actually store the calculated
  values or anything like that.
*/
// https://node-postgres.com/features/pooling
const { Pool } = require('pg')
const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})

// listener
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// create a table inside the database that house information
// table name : values, and a single column name: number.
pool
  .connect()
  .then(client => {
    return client
      .query('CREATE TABLE IF NOT EXISTS values (number INT)')
      .then(res => {
        client.release()
        // console.log(res.rows[0])
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })

// pool
//   .query('CREATE TABLE IF NOT EXISTS values (number INT)')
//   .catch((err) => console.log(err))

// Redis Client Setup
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

/*
  When a connection is turned into a connection
  that's going to listen or subscribe or publish
  information, it can't be used for other purposes.
  So we have to create a duplication.
*/
const redisPublisher = redisClient.duplicate()

// define different routes
// Express route handlers
app.get('/', (req, res) => {
  res.send('happy')
})

// query a running pgsql instance and retrieve values
app.get('/values/all', async (req, res) => {
  const values = await pool.query('SELECT * from values')
  res.send(values.rows)
})

// get values inside redis instance
app.get('/values/current', async (req, res) => {
  // look at the hashvalue inside the Redis instance and get all.
  redisClient.hgetall('values', (err, val) => {
    res.send(val)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index
  // here, make sure the index that was submitted is less than 40
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high, it should be smaller than 40.')
  }

  // put the value into redis store
  redisClient.hset('values', index, 'To be calculate!')
  redisPublisher.publish('insert', index)

  // store permanent record
  pool.query('INSERT INTO values(number) VALUES($1)', [index])

  // we're doing some work to calculate
  res.send({ working: true })
})

// listen the port
app.listen(5000, err => {
  console.log("Server listening on port 5000")
})