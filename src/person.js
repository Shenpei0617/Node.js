class person {
    constructor(name = 'non', age = 0) {

        this.name = name;

        this.age = age;
    }
    toJson() {
        const { name, age } = this;

        return { name, age, gender: 'male' };
    }

    toString() {
        return JSON.stringify(this);

    }
}
const p1 = new person('Davide', 25);

console.log(p1);

console.log(p1 + '');


const a = 10;


const f = n => n * n;


module.exports={person,a,f}
//module.exports要輸出的檔案打包
//exports一定要加S
//副檔名.mjs一定為ES6版本，但.js不一定判定為ES6

