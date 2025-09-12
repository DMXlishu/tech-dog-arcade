const { writeOrders } = require('../lib/data');

const PASSWORD = '8888';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: '仅支持POST请求' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (body.password !== PASSWORD) {
      return res.status(401).json({ ok: false, msg: '密码错误' });
    }

    if (writeOrders([])) {
      res.status(200).json({ ok: true, msg: '数据已清空' });
    } else {
      res.status(500).json({ ok: false, msg: '清空数据失败' });
    }

  } catch (error) {
    console.error('Clear API错误:', error);
    res.status(500).json({ ok: false, msg: '服务器内部错误' });
  }
};
