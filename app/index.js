const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = 3001;

// Collect default metrics (CPU, memory, event loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metric: HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Custom metric: Request duration histogram (for p95 latency)
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Middleware to track every request automatically
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Sample routes
app.get('/', (req, res) => res.json({ message: 'API is healthy' }));

app.get('/slow', async (req, res) => {
  await new Promise(r => setTimeout(r, Math.random() * 2000));
  res.json({ message: 'slow response' });
});

app.get('/error', (req, res) => {
  res.status(500).json({ error: 'Simulated server error' });
});

// Prometheus scrape endpoint — Prometheus will call this
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
