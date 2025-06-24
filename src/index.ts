import dotenv from 'dotenv';
import { initListener } from './listener';

dotenv.config();

(async () => {
  console.log('Starting MempoolSandwicher...');
  await initListener();
})();
