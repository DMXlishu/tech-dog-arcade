export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: '仅支持POST请求' });
  }

  // 返回模拟管理数据
  res.status(200).json({
    ok: true,
    rows: [
      {
        id: 1,
        orderNum: '0001',
        planType: 1,
        price: 10,
        dailyTotal: 10,
        total: 10,
        date: new Date().toLocaleString('zh-CN')
      }
    ],
    total: 10,
    dailyTotal: 10
  });
}
