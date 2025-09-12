const { readOrders } = require('../lib/data');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, msg: '仅支持GET请求' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ ok: false, msg: '缺少订单ID' });
    }

    const orders = readOrders();
    const order = orders.find(o => o.id === parseInt(id));
    
    if (!order) {
      return res.json({ ok: false, msg: '订单不存在' });
    }

    const queueOrders = orders.filter(o => o.status === 'queue');
    const ahead = queueOrders.filter(o => o.id < order.id).length;
    const waitTime = Math.ceil(ahead * 10);

    res.status(200).json({
      ok: true,
      orderNum: order.orderNum,
      ahead,
      waitTime: `${waitTime}分钟`,
      status: order.status
    });

  } catch (error) {
    console.error('QueueInfo API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
