import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

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

app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems, orderId } = req.body;

  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'huf',
      product_data: {
        name: item.name,
        metadata: {
          product_id: item.id,
        },
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: orderId,
      success_url: 'http://localhost:5174/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5174/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/checkout-session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    res.json(session);
  } catch (error) {
    console.error('Stripe session retrieve error:', error);
    res.status(500).json({ error: error.message });
  }
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
