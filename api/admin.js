import { readOrders } from '../lib/data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: '仅支持POST' });

  const list = readOrders();
  const daily = list.filter(o => {
    try {
      return new Date(o.createdAt).toDateString() === new Date().toDateString();
    } catch { return false; }
  });

  const rows = daily.slice(-20).map((o, idx) => ({
    id: idx + 1,
    orderNum: o.orderNum,
    planType: o.time === 30 ? 1 : 2,
    price: o.price,
    dailyTotal: daily.reduce((s, i) => s + i.price, 0),
    total: list.reduce((s, i) => s + i.price, 0),
    date: o.createdAt
  }));

  res.status(200).json({
    ok: true,
    rows,
    total: list.reduce((s, i) => s + i.price, 0),
    dailyTotal: daily.reduce((s, i) => s + i.price, 0)
  });
}
