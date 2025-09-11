const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '../orders.json');
const PASSWORD = '8888';

function readj(f) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { return [] }
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: '仅支持POST' });

  if (req.body.password !== PASSWORD) return res.status(401).json({ ok: false, msg: '密码错误' });

  const rows = readj(ORDERS_FILE).map((r, idx) => ({
    id: idx + 1,
    date: r.date,
    orderNum: r.orderNum,
    plan: r.plan,
    price: r.price,
    total: 0
  }));
  let total = 0;
  rows.forEach(r => { total += r.price; r.total = total; });

  res.json({ rows, total });
};