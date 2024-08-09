const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.on('error', (err) => {
    console.error('Redis error:', err);
});
const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        setTimeout(connectRedis, 5000);
    }
};
connectRedis();
client.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});
client.on('end', () => {
    console.log('Redis connection closed');
    setTimeout(connectRedis, 5000);
});

module.exports = client;
