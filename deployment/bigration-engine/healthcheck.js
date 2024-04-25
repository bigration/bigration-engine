const { execSync } = require('child_process');

try {
  execSync('pidof node');
} catch (error) {
  console.error('Node.js process not found. Exiting...');
  process.exit(1);
}
