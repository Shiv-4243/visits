// index.js
const http = require('http');
const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  host: 'redis-server'
});

// Connect to Redis server
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    // Increment the visit count
    try {
      const visitCount = await new Promise((resolve, reject) => {
        redisClient.incr('visit_count', (err, reply) => {
          if (err) reject(err);
          else resolve(reply);
        });
      });

      // Send response
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Number of visits: ${visitCount}`);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error occurred');
      console.error('Error incrementing visit count:', error);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`listaning on port 8081`);
});
