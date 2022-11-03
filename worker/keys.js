/*
  This file contains the hostname and
  the port required for connecting over
  to retests
  包含主机名和连接重新测试所需的端口
*/


module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}