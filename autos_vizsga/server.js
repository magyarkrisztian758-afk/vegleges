import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      name: 'CarCore Ügyfél'
    }
  });
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe centekben számol
      currency: 'huf',
      metadata: { order_source: 'carcore' },
    });

    return res.json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
      amount: amount,
    });
  } catch (error) {
    console.error('❌ Stripe error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

app.get('/api/admin/users', (req, res) => {
  res.json(users);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/products/:id/update-stock', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Termék nem található' });
  }
  products[productIndex].stock -= quantity;
  if (products[productIndex].stock < 0) {
    products[productIndex].stock = 0; // Nem engedjük negatív készletet
  }
  // Frissítjük a JSON fájlt
  fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), JSON.stringify(products, null, 2));
  res.json({ status: 'success', stock: products[productIndex].stock });
});

app.listen(PORT, () => {
  console.log(`CarCore backend fut a http://localhost:${PORT}`);
});

// Exportáljuk az app-ot a tesztek számára
export default app;
