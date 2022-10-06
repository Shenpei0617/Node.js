import person, { a, f } from './Person.mjs';
//import from 輸入 person.mjs檔
//import一定寫在檔案最前面
//export default輸出在import的名稱直接打檔案名稱，不用加{}
//若更改person名稱為Myperson，會取代person.mjs檔裡面的person
//輸出export 內容用{,}

const p2 = new person('Flora', 26);
//重新定義person

console.log(p2.toString());
//person { name: 'Davide', age: 25 }
console.log({ a });
//輸出person檔裡面的a
//{ a: 10 }
console.log(f(7));
//49