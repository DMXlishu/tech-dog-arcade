import { readTimer, writeTimer } from '../lib/timer.js';
import { readOrders, writeOrders } from '../lib/data.js';

export default async function handler(req, res) {
  const timer = readTimer();
  if (!timer.running) {
    // 把队首搬进计时器
    const list = readOrders().filter(o => !o.done && o.status === 'queue');
    if (list.length) {
      const next = list[0];
      next.status = 'playing';
      writeOrders(list);
      writeTimer({ running: true, orderId: next.id, remaining: next.time * 60, paused: false });
    }
  } else if (!timer.paused && timer.remaining > 0) {
    timer.remaining -= 60;
    if (timer.remaining <= 0) {
      // 本单结束
      const orders = readOrders();
      const done = orders.find(o => o.id === timer.orderId);
      if (done) { done.status = 'end'; done.done = true; }
      writeOrders(orders);
      writeTimer({ running: false, orderId: null, remaining: 0, paused: false });
    } else {
      writeTimer(timer);
    }
  }
  res.status(200).json({ ok: true });
}
