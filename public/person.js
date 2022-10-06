export default class person {
    gender = 'female';
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

export const a = 10;
const f = n => n * n;
export { f };

