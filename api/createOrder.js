const { readOrders, writeOrders, generateOrderNum } = require('../lib/data');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST请求
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

    const { price, time } = body;

    // 验证参数
    if (price === undefined || time === undefined) {
      return res.status(400).json({ ok: false, msg: '缺少参数' });
    }

    const orders = readOrders();
    const orderNum = generateOrderNum();
    const now = new Date();
    
    const newOrder = {
      id: Date.now(),
      orderNum: orderNum,
      price: parseInt(price),
      time: parseInt(time),
      planType: parseInt(price) === 10 ? 1 : 2,
      date: now.toLocaleString('zh-CN'),
      status: 'queue',
      createdAt: now.toISOString()
    };

    orders.push(newOrder);
    
    if (writeOrders(orders)) {
      // 计算排队信息
      const queueOrders = orders.filter(order => order.status === 'queue');
      const ahead = queueOrders.filter(order => order.id < newOrder.id).length;
      const waitTime = Math.ceil(ahead * 10);

      res.status(200).json({
        ok: true,
        id: newOrder.id,
        orderNum: newOrder.orderNum,
        ahead: ahead,
        waitTime: `${waitTime}分钟`,
        msg: '订单创建成功'
      });
    } else {
      res.status(500).json({ ok: false, msg: '订单创建失败' });
    }

  } catch (error) {
    console.error('CreateOrder API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
