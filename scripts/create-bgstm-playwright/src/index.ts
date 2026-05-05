#!/usr/bin/env node
/**
 * create-bgstm-playwright — scaffolder CLI
 * Usage: npm create bgstm-playwright@latest my-tests -- --domain=crm
 *
 * TODO: implement interactive scaffolder using prompts/clack
 */

const args = process.argv.slice(2);
const projectName = args[0] ?? 'my-bgstm-tests';

console.log(`Scaffolding new bgstm-playwright project: ${projectName}`);
console.log('This scaffolder is coming soon! In the meantime, see:');
console.log('  https://github.com/bg-playground/bgstm-playwright-frameworks#quick-start');
