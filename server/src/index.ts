import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import net from 'net';
import { migrate } from './db/migrate';
import { initDb, saveDb, getDb, getSqlite } from './db';
import scanRoutes from './routes/scan';
import findingsRoutes from './routes/findings';
import triageRoutes from './routes/triage';
import exportRoutes from './routes/export';
import baselineRoutes from './routes/baseline';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/scan', scanRoutes);
app.use('/api/findings', findingsRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/baseline', baselineRoutes);

app.get('/api/checklist', (_req, res) => {
  res.json({
    authentication: [
      { item: 'Authentication mechanisms (JWT, sessions)', status: 'pending' },
      { item: 'Password policies and hashing', status: 'pending' },
      { item: 'Session management and expiry', status: 'pending' },
      { item: 'MFA/2FA implementation', status: 'pending' },
      { item: 'Brute force protection', status: 'pending' },
    ],
    accessControl: [
      { item: 'Role-based access control (RBAC)', status: 'pending' },
      { item: 'Authorization checks on all endpoints', status: 'pending' },
      { item: 'Principle of least privilege', status: 'pending' },
      { item: 'CORS configuration', status: 'pending' },
    ],
    inputValidation: [
      { item: 'Input sanitization and validation', status: 'pending' },
      { item: 'Parameterized queries (SQL injection)', status: 'pending' },
      { item: 'Command injection prevention', status: 'pending' },
      { item: 'Cross-site scripting (XSS) prevention', status: 'pending' },
    ],
    logging: [
      { item: 'Security event logging', status: 'pending' },
      { item: 'No sensitive data in logs', status: 'pending' },
      { item: 'Log levels and rotation', status: 'pending' },
    ],
    secrets: [
      { item: 'No hardcoded credentials', status: 'pending' },
      { item: 'Environment variables for secrets', status: 'pending' },
      { item: 'Secrets management solution', status: 'pending' },
    ],
    dependencies: [
      { item: 'Known vulnerability scan (SCA)', status: 'pending' },
      { item: 'Outdated package versions', status: 'pending' },
      { item: 'Dependency license compliance', status: 'pending' },
    ],
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const FRONTEND_DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

function findFreePort(preferred: number, min = 42000, max = 49999): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(preferred, () => {
      const addr = server.address();
      server.close(() => resolve(typeof addr === 'object' ? addr!.port : preferred));
    });
    server.on('error', () => {
      const tryPort = Math.floor(Math.random() * (max - min + 1)) + min;
      const s2 = net.createServer();
      s2.listen(tryPort, () => {
        const addr = s2.address();
        s2.close(() => resolve(typeof addr === 'object' ? addr!.port : tryPort));
      });
      s2.on('error', () => resolve(findFreePort(min, min, max)));
    });
  });
}

async function start() {
  await migrate();

  const preferredPort = parseInt(process.env.PORT || '42000', 10);
  const port = await findFreePort(preferredPort);

  app.listen(port, () => {
    console.log(`ReviewShield server running on http://localhost:${port}`);
    console.log(`Health: http://localhost:${port}/api/health`);
  });
}

start().catch(console.error);
