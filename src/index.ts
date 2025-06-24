import dotenv from 'dotenv';
dotenv.config();

import { initListener } from './listener';

async function main() {
  await initListener();
}

main().catch(console.error);
