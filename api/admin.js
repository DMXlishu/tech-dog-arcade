import { readOrders } from '../lib/data.js';
import { readTimer } from '../lib/timer.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: '仅支持POST' });

  const list = readOrders();
  const timer = readTimer();
  const daily = list.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());

  const rows = daily.slice(-20).map((o) => ({
    id: o.id,
    orderNum: o.orderNum,
    planType: o.time === 30 ? 1 : 2,
    price: o.price,
    status: o.status || (o.done ? 'end' : 'queue'), // 兼容旧数据
    remaining: (timer.running && timer.orderId === o.id && !o.done) ? timer.remaining : 0,
    date: o.createdAt
  }));

  res.status(200).json({
    ok: true,
    rows,
    total: list.reduce((s, i) => s + i.price, 0),
    dailyTotal: daily.reduce((s, i) => s + i.price, 0)
  });
}
