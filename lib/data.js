const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(process.cwd(), 'orders.json');

// 初始化订单文件
function initOrdersFile() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

function readOrders() {
  initOrdersFile();
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取订单文件错误:', error);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('写入订单文件错误:', error);
    return false;
  }
}

function generateOrderNum() {
  const orders = readOrders();
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const todayOrders = orders.filter(order => order.date.startsWith(today));
  return todayOrders.length + 1;
}

module.exports = {
  readOrders,
  writeOrders,
  generateOrderNum,
  ORDERS_FILE
};
