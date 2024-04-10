// pages/api/your-api-route.js
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { priceId } = req.body; // 从请求体中获取 priceId

      // 创建 Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId, // 使用从请求中获取的 priceId
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success', // 支付成功后的跳转 URL
        cancel_url: 'http://localhost:3000/cancel', // 取消支付的跳转 URL
      });

      // 返回 session URL
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // 非 POST 请求时返回 405 Method Not Allowed
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
