import { writeOrders } from '../lib/data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  writeOrders([]);
  res.status(200).json({ ok: true, msg: '数据已清空' });
}
