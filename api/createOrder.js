import { addOrder, readOrders } from '../lib/data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: '仅支持POST' });

  let body = {};
  try { body = JSON.parse(req.body || '{}'); } catch {
    return res.status(400).json({ ok: false, msg: 'JSON 解析失败' });
  }

  const { price, time } = body;

  // 真排队：算前面还有几人
  const orders = readOrders().filter(o => !o.done);        // 未过号
  const ahead = orders.length;
  const orderNum  = (ahead + 1).toString().padStart(4, '0');

  const newOrder = {
    id: Date.now(),
    orderNum,
    price,
    time,
    ahead,
    waitTime: `${(ahead + 1) * 5}分钟`,   // 粗略估
    done: false
  };

  addOrder(newOrder);

  res.status(200).json({ ok: true, ...newOrder, msg: '订单创建成功' });
}
