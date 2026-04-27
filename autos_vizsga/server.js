import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'CarCore backend fut.' });
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

app.listen(PORT, () => {
  console.log(`CarCore backend running at http://localhost:${PORT}`);
});

// Exportáljuk az app-ot a tesztek számára
export default app;
