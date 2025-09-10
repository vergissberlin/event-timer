import { spawn } from 'node:child_process';

const surgeDomain = process.env.SURGE_DOMAIN;
const args = ['./dist'];

if (typeof surgeDomain === 'string' && surgeDomain.trim().length > 0) {
  args.push('--domain', surgeDomain.trim());
  console.log(`🔗 Using Surge domain: ${surgeDomain.trim()}`);
} else {
  console.log('🔗 No SURGE_DOMAIN provided. Using default or CNAME if present.');
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


