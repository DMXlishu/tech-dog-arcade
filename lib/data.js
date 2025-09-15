import fs from 'fs';
import path from 'path';
const ORDERS_FILE = path.join(process.cwd(), 'orders.json');

export function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function writeOrders(list) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2));
}

export function addOrder(order) {
  const list = readOrders();
  list.push({ ...order, createdAt: new Date().toISOString() });
  writeOrders(list);
}
