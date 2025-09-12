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
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt || order.date).toISOString().split('T')[0].replace(/-/g, '');
    return orderDate === today;
  });
  return todayOrders.length + 1;
}

// 每天0点自动重置的检查函数
function checkDailyReset() {
  const now = new Date();
  const lastReset = global.lastResetDate || '';
  const today = now.toLocaleDateString('zh-CN');
  
  if (lastReset !== today && now.getHours() === 0) {
    console.log('执行每日自动重置...');
    // 这里可以添加重置逻辑
    global.lastResetDate = today;
  }
}

// 启动定时检查
setInterval(checkDailyReset, 60000); // 每分钟检查一次

module.exports = {
  readOrders,
  writeOrders,
  generateOrderNum,
  ORDERS_FILE
};
