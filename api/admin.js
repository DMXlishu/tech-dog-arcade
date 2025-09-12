const { readOrders } = require('../lib/data');

const PASSWORD = '8888';

module.exports = async (req, res) => {
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST请求
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
    
    const rows = orders.map((order, index) => {
      totalRevenue += order.price;
      return {
        id: index + 1,
        date: order.date,
        orderNum: order.orderNum,
        plan: `${order.price}元/${order.time}分钟`,
        price: order.price,
        total: totalRevenue
      };
    });

    res.status(200).json({ 
      ok: true, 
      rows: rows.reverse(), // 最新的订单在前
      total: totalRevenue 
    });

  } catch (error) {
    console.error('Admin API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
