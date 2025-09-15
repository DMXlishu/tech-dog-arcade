import { readOrders } from '../lib/data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = Number(req.query.id || 0);
  const orders = readOrders();
  const me  = orders.find(o => o.id === id);
  if (!me) return res.status(404).json({ ok: false, msg: '订单不存在' });

  const ahead = orders.filter(o => !o.done && o.id < id).length;
  res.status(200).json({
    ok: true,
    orderNum: me.orderNum,
    ahead,
    waitTime: `${(ahead + 1) * 5}分钟`,
    status: ahead === 0 ? 'playing' : 'queue'
  });
}
