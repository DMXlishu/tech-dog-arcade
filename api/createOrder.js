import { readOrders, addOrder } from '../lib/data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: '仅支持POST' });

  let body = {};
  try { body = JSON.parse(req.body || '{}'); } catch {
    return res.status(400).json({ ok: false, msg: 'JSON 解析失败' });
  }
  const { price, time } = body;

  // 今日未 done 条数
  const today = new Date().toDateString();
  const list  = readOrders().filter(o => !o.done && new Date(o.createdAt).toDateString() === today);
  const orderNum = (list.length + 1).toString().padStart(4, '0');

  const newOrder = { id: Date.now(), orderNum, price, time, status: 'queue', done: false };
  addOrder(newOrder);
  res.status(200).json({ ok: true, ...newOrder, ahead: list.length, waitTime: `${(list.length)*5}分钟` });
}
