import fs from 'fs';
import path from 'path';
const TIMER_FILE = path.join(process.cwd(), 'timer.json');

export function readTimer() {
  try {
    if (!fs.existsSync(TIMER_FILE)) return { running: false, orderId: null, remaining: 0, paused: false };
    return JSON.parse(fs.readFileSync(TIMER_FILE, 'utf-8'));
  } catch { return { running: false, orderId: null, remaining: 0, paused: false }; }
}

export function writeTimer(obj) {
  fs.writeFileSync(TIMER_FILE, JSON.stringify(obj, null, 2));
}
