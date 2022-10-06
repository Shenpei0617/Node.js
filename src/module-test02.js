const {person,a,f} = require('./person')
//require引入的檔案，副檔名.js或.json可省略.mjs不可省略
//跟import不一樣，require不一定要寫在最前面
const p2 = new person('Flora', 26);

console.log(p2.toString());

console.log({ a });

console.log(f(7));

//.js  匯入的方式用 const require ，路徑位置不用加副檔名.js .json但.mjs要加副檔名