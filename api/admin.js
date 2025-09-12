const { readOrders } = require('../lib/data');

const PASSWORD = 'qwer123'; // 管理密码

module.exports = async (req, res) => {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: '仅支持POST请求' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // 验证密码
    if (body.password !== PASSWORD) {
      return res.status(401).json({ ok: false, msg: '密码错误' });
    }

    const orders = readOrders();
    let totalRevenue = 0;
    let dailyTotal = 0;
    const today = new Date().toLocaleDateString('zh-CN');
    
    // 计算收益
    const rows = orders.map((order, index) => {
      totalRevenue += order.price;
      
      // 计算今日收益
      const orderDate = new Date(order.createdAt || order.date).toLocaleDateString('zh-CN');
      if (orderDate === today) {
        dailyTotal += order.price;
      }
      
      return {
        id: index + 1,
        orderNum: order.orderNum,
        planType: order.planType || (order.price === 10 ? 1 : 2),
        price: order.price,
        dailyTotal: dailyTotal,
        total: totalRevenue,
        date: order.date
      };
    });

    res.status(200).json({ 
      ok: true, 
      rows: rows.reverse(), // 最新的订单在前
      total: totalRevenue,
      dailyTotal: dailyTotal
    });

  } catch (error) {
    console.error('Admin API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
