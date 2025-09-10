import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.join(process.cwd());
const distDir = path.join(rootDir, 'dist');

let surgeDomain = process.env.SURGE_DOMAIN;

// Fallback: read domain from CNAME file at repo root if not provided via env
if ((!surgeDomain || surgeDomain.trim().length === 0) && fs.existsSync(path.join(rootDir, 'CNAME'))){
  try {
    const cname = fs.readFileSync(path.join(rootDir, 'CNAME'), 'utf8').trim();
    if (cname) {
      surgeDomain = cname;
      console.log(`🔎 Found CNAME at repo root, using domain: ${surgeDomain}`);
    }
  } catch {}
}

// Ensure CNAME is present in dist (optional, but keeps domain visible)
if (surgeDomain && surgeDomain.trim().length > 0) {
  try {
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(path.join(distDir, 'CNAME'), surgeDomain.trim());
    console.log('📝 Wrote CNAME into dist/');
  } catch (e) {
    console.warn('⚠️ Could not write CNAME into dist:', e);
  }
}

const args = [distDir];

if (typeof surgeDomain === 'string' && surgeDomain.trim().length > 0) {
  args.push('--domain', surgeDomain.trim());
  console.log(`🔗 Using Surge domain: ${surgeDomain.trim()}`);
} else {
  console.log('🔗 No SURGE_DOMAIN provided. Using default or interactive domain selection.');
}

const child = spawn('surge', args, { stdio: 'inherit' });

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Surge deployment failed with exit code ${code}`);
    process.exit(code ?? 1);
  } else {
    console.log('✅ Surge deployment completed successfully');
  }
});


