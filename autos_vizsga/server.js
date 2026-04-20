import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadJson = (fileName) => {
  const filePath = path.join(__dirname, 'data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const products = loadJson('products.json');
const users = loadJson('users.json');
const orders = loadJson('orders.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'CarCore backend fut.' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email és jelszó szükséges.' });
  }

  return res.json({
    status: 'success',
    user: {
      email,
      role: 'user',
      name: 'Teszt Felhasználó'
    }
  });
});

app.post('/api/create-payment-intent', (req, res) => {
  const { amount } = req.body;
  return res.json({
    status: 'success',
    clientSecret: 'test_client_secret_123',
    amount: amount || 0
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json(users);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`CarCore backend fut a http://localhost:${PORT}`);
});
