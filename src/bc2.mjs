//bcryptjs套件，密碼加密
import bcrypt from 'bcryptjs';
const h = await bcrypt.hash('1234', 10);
console.log(h);
//>node src\bc.js產生1234的亂數(記得最後面要加()立即執行)
const hashStr = '$2a$10$tioO9RXEpU2mjZRwnECJ7euBm.zlA1pFbGq2m8XEe7PA7Ty1SUlue'
console.log(await bcrypt.compare('123456', hashStr));