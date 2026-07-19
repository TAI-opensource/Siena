import fs from 'fs';
import path from 'path';

let cached: any[] = [];

export function getData(): any[] {
  if (cached.length > 0) return cached;
  const file = path.join(process.cwd(), 'data', 'caixa', 'imoveis_compact.json');
  cached = JSON.parse(fs.readFileSync(file, 'utf8'));
  return cached;
}

export function getStats() {
  const file = path.join(process.cwd(), 'data', 'caixa', 'compact_stats.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
