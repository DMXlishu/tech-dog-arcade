import { readOrders, writeOrders } from '../lib/data.js';

export default async function handler(req, res) {
  const list = readOrders().map(o => ({ ...o, done: true })); // 全部结束
  list.push({ id: 0, orderNum: '0000', done: true });        // 占位
  writeOrders(list);
  res.status(200).json({ ok: true, msg: 'daily reset ok' });
}
