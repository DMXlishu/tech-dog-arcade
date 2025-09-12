export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 返回模拟排队信息
  res.status(200).json({
    ok: true,
    orderNum: Math.floor(Math.random() * 100) + 1,
    ahead: Math.max(0, Math.floor(Math.random() * 10) - 1),
    waitTime: '10分钟',
    status: 'queue'
  });
}
