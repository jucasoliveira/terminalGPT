// extension.js
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated!');
}

export function deactivate() {
  console.log('Extension deactivated!');
}// compile.js
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