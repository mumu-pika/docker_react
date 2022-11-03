/* 
  Primary logic for connecting to us,
  watching redis for new indices,
  and then eventually calculating our Fibonacci value.
  Pull each new indices, calculates new value then put
  back into redis.
*/

const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // 重试策略：如果和redis server断连了, 应该尝试每隔1000ms自动重连
  retry_strategy: () => 1000
})

const sub = redisClient.duplicate()

// 斐波那契函数
function fib() {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

/*
  Any time that we get a new value that shows up in redis,
  we're going to calculate a new Fibonacci value and then
  insert that into a hash of values or a hash called values.

  The key will be the index that we receive, so message right
  here is going to be the index value that was submitted into
  our form.
*/
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parent(message)))

})

/*
  Any time someone inserts a new value into redis,
  we' re going to get that value and attempt to calculate
  the Fibonacci value for it and then toss that value
  back into the redis instance

*/
sub.subscribe('insert') // waiting for insert value function 's trigger.