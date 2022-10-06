export default class person {
    //export default輸出整個文件
    //一個檔案只能有一個export
    constructor(name = 'non', age = 0) {
    //   constructor建構函式
        this.name = name;
        // this=person
        this.age = age;
    }
    toJson() {
        const { name, age } = this;
        // 解構設定，this設給name, age
        return { name, age, gender: 'male' };
    }

    toString() {
        return JSON.stringify(this);
    // toString()g覆蓋原本的toString()
}
}
const p1 = new person('Davide', 25);

console.log(p1);
// person { name: 'Davide', age: 25 }
console.log(p1 + '');
//{"name":"Davide","age":25}
//轉成字串

export const a = 10;
//輸出const，一般常用方式

const f = n => n * n;
export { f };
//函式輸出用{}，兩行寫法
