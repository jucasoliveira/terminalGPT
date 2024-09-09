// compile.js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'out');

fs.mkdirSync(outDir);

fs.readdirSync(srcDir).forEach(file => {
  const filePath = path.join(srcDir, file);
  const outFile = path.join(outDir, file);

  fs.copyFileSync(filePath, outFile);
});