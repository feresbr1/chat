const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


console.log('Building package...');
execSync('npm run build', { stdio: 'inherit' });


const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}


console.log('Copying README.md to dist...');
fs.copyFileSync(
  path.join(__dirname, '..', 'README.md'),
  path.join(distDir, 'README.md')
);


console.log('Preparing package.json for distribution...');
const packageJson = require('../package.json');


delete packageJson.scripts;
delete packageJson.devDependencies;


packageJson.main = 'index.js';
packageJson.module = 'index.esm.js';
packageJson.types = 'index.d.ts';


fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log('Package prepared for publishing!');
console.log('To publish, run: cd dist && npm publish');
