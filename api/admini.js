// api/admin.js  （Vercel Serverless Function）
import { readFileSync } from 'fs';
import { join } from 'path';

const ORDERS_FILE = join(process.cwd(),'orders.json');  // 历史订单
const PASSWORD = '8888';                               // ← 改这里

function readj(f){
  try{ return JSON.parse(readFileSync(f,'utf8'))}catch(e){ return [] }
}

export default function handler(req, res) {
  // 允许前端跨域
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. 简单密码校验（POST 体里 {password:"8888"}）
  if(req.method==='POST'){
    const { password } = req.body;
    if(password !== PASSWORD){
      return res.status(401).json({ok:false,msg:'密码错误'});
    }
  }else{
    return res.status(405).json({ok:false,msg:'仅支持POST'});
  }

  // 2. 返回订单 & 总收益
  const rows = readj(ORDERS_FILE).map((r,idx)=>({
    id: idx+1,
    date: r.date,
    orderNum: r.orderNum,
    plan: r.plan,
    price: r.price,
    total: 0
  }));
  let total = 0;
  rows.forEach(r=>{ total+=r.price; r.total=total; });

  res.status(200).json({rows, total});
}