export default async function handler(req, res) {
  // CORS设置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: '仅支持POST请求' });
  }

  try {
    const { price, time } = req.body;
    
    // 返回模拟数据
    res.status(200).json({
      ok: true,
      id: Date.now(),
      orderNum: Math.floor(Math.random() * 100) + 1,
      ahead: Math.floor(Math.random() * 10),
      waitTime: '15分钟',
      msg: '订单创建成功（模拟模式）'
    });

  } catch (error) {
    res.status(500).json({ ok: false, msg: '服务器错误' });
  }
}
