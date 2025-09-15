import { readOrders, writeOrders } from '../lib/data.js';
import { readTimer, writeTimer } from '../lib/timer.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  let body = {};
  try { body = JSON.parse(req.body || '{}'); } catch {
    return res.status(400).json({ ok: false, msg: 'JSON 解析失败' });
  }
  const { id, action } = body; // id 本单，action: skip|end|pause|resume

  const orders = readOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, msg: '订单不存在' });

  const timer = readTimer();

  switch (action) {
    case 'skip': {
      // 与下一条未 done 互换
      const nextIdx = orders.findIndex((o, i) => i > idx && !o.done);
      if (nextIdx === -1) return res.status(400).json({ ok: false, msg: '无下一单' });
      [orders[idx], orders[nextIdx]] = [orders[nextIdx], orders[idx]];
      // 如果本单正在计时，立即停止并启动新队首
      if (timer.running && timer.orderId === id) {
        const next = orders[idx]; // 交换后的新队首
        next.status = 'playing';
        writeTimer({ running: true, orderId: next.id, remaining: next.time * 60, paused: false });
      }
      break;
    }
    case 'end': {
      orders[idx].status = 'end';
      orders[idx].done = true;
      if (timer.running && timer.orderId === id) {
        writeTimer({ running: false, orderId: null, remaining: 0, paused: false });
      }
      break;
    }
    case 'pause': {
      if (timer.running && timer.orderId === id) {
        timer.paused = true;
        writeTimer(timer);
      }
      break;
    }
    case 'resume': {
      if (timer.running && timer.orderId === id) {
        timer.paused = false;
        writeTimer(timer);
      }
      break;
    }
    default:
      return res.status(400).json({ ok: false, msg: '未知操作' });
  }

  writeOrders(orders);
  res.status(200).json({ ok: true });
}
