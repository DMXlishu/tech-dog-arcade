const { readOrders, writeOrders } = require('../lib/data');

const PASSWORD = 'qwer123';

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: '仅支持POST请求' });
  }

  try {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ ok: false, msg: '无效的JSON数据' });
    }
    
    if (body.password !== PASSWORD) {
      return res.status(401).json({ ok: false, msg: '密码错误' });
    }

    const orders = readOrders();
    
    if (orders.length === 0) {
      return res.status(200).json({ ok: true, msg: '没有数据可清除' });
    }

    // 只保留最新订单，重置编号为1
    const latestOrder = orders[orders.length - 1];
    const resetOrder = {
      ...latestOrder,
      orderNum: 1,
      id: Date.now()
    };

    if (writeOrders([resetOrder])) {
      res.status(200).json({ ok: true, msg: '数据已重置，只保留最新订单' });
    } else {
      res.status(500).json({ ok: false, msg: '清除数据失败' });
    }

  } catch (error) {
    console.error('Clear API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
