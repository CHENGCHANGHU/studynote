console.log("static data");

export default {
  header: "JS面向对象的八式八招",
  chapters: [{
    id: 1,
    title: "第一式：工厂模式",
    content: `
    抽象创建具体对象的过程，使用函数封装细节，调用函数返回对象。但是无法解决对象识别的问题。

    function createPerson1(name, age) {
      var obj = new Object();
      obj.name = name;
      obj.age = age;
      obj.sayHello=function(){
        console.log(\`name: \${this.name}\`);
      }
      return obj;
    }
    
    var p11 = createPerson1("allx", 12);
    `
  }, {
    id: 2,
    title: "第二式：构造函数模式",
    content: `
    步骤
      1）创建一个新对象
      2）将构造函数的作用域（执行环境对象）赋值给新对象（this也就指向这个对象）
      3）执行构造函数中的代码，为新对象添加属性
      4）返回新对象

    把构造函数当做普通函数使用？this会绑定到全局变量上，因为函数中的this在运行时确定，
    哪个执行环境对象调用该函数，this就指向谁

    函数也是对象，所以与属性无二，因此构造函数的实例对象的函数属性都是新创建的，
    不同实例上的同名函数时不相等的（不是指向同一内存地址）

    function Person2(name, age) {
      this.name = name;
      this.age = age;
      this.sayHello = function () {
        console.log(\`name: \${this.name}\`);
      }
    }
    
    let p21 = new Person2("allx", 12);
    `
  }, {
    id: 3,
    title: "第三式：原型模式",
    content: `
    每个构造函数都有prototype属性，指针，指向一个对象，是调用构造函数创建的对象实例的原型对象，
    可以让所有对象实例共享它的属性和方法

    无论何时，都会为新创建的函数对象指定一个prototype属性，该属性指向函数对象的原型对象，
    原型对象的constructor属性指向该函数对象，使用该函数创建的对象实例的__proto__属性也指向函数对象的原型对象

    虽然可以通过对象实例访问原型中的值，但不能修改该值，给对象实例设置与原型属性同名的属性，
    会在对象实例上新创建属性，屏蔽掉原型上的属性，除非使用delete操作符，才能继续访问原型上的属性

    function Person3() {}
    Person3.prototype.name = "allx";
    Person3.prototype.age = 12;
    Person3.prototype.sayHello = function () {
      console.log(\`name: \${this.name}\`);
    };

    let p31 = new Person3();

    原型是动态的，每次查找属性都是一次原型链上的搜索，任何原型的修改都会立即反应

    原型对象的重写：将构造函数的原型对象指针指向一个新对象，此时需要重写constructor属性

    function Person32() {}
    Person32.prototype = {
      name: "allx",
      age: 18,
      sayHello: function () {
        console.log(\`name: \${this.name}\`);
      }
    }
    Object.defineProperty(Person32.prototype, "constructor", {
      enumerable: false,
      value: Person32
    });

    let p32 = new Person32();

    实例中的指针仅指向原型，不指向构造函数，重写原型对象会切断现有原型与之前任何已存在的对象实例的联系
    `
  }, {
    id: 4,
    title: "第四式：混成模式",
    content: `
    组合构造函数和原型模式，构造函数定义实例属性和方法，原型模式定义静态共享方法和属性

    function Person4(name, age) {
      this.name = name;
      this.age = age;
    }
    Person4.prototype.sayHello = function () {
      console.log(\`name: \${this.name}\`);
    }
    
    let p41 = new Person4("allx", 21);
    `
  }, {
    id: 5,
    title: "第五式：动态原型模式",
    content: `
    封装实例属性/方法和静态方法/属性，第一次创建对象时初始化原型对象，这时不能重写原型对象，避免切断联系

    function Person5(name, age) {
      this.name = name;
      this.age = age;
      if (typeof this.sayHello != "function") {
        Person5.prototype.sayHello = function () {
          console.log(\`name: \${this.name}\`);
        }
      }
    }
    
    let p51 = new Person5("allx", 21);
    `
  }, {
    id: 6,
    title: "第六式：寄生构造函数模式",
    content: `
    封装创建对象的代码，再返回该对象，与工厂模式类似，只是是使用new

    返回的对象与构造函数或者与构造函数的原型属性之间没有关系，构造函数返回的对象与在构造函数外创建的对象没有什么不同

    function Person6(name, age) {
      var obj = new Object();
      obj.name = name;
      obj.age = age;
      obj.sayHello = function () {
        console.log(\`name: \${this.name}\`);
      }
      return obj;
    }
    
    let p61 = new Person6("allx", 23);
    `
  }, {
    id: 7,
    title: "第七式：稳妥构造函数模式",
    content: `
    稳妥对象：没有公共属性，方法也不需要引用this
    与寄生构造函数类似，但不引用this，不使用new
    返回的对象与构造函数或者与构造函数的原型属性之间没有关系

    function Person7(name, age) {
      var obj = new Object();
      obj.name = name;
      obj.age = age;
      obj.sayHello = function () {
        console.log(\`name: \${name}\`);
      }
      return obj;
    }
    
    let p71 = new Person7("allx", 23);
    `
  }, {
    id: 8,
    title: "第八式：class类模式",
    content: `
    接近传统语言的写法，让对象原型的写法更加清晰、更像面向对象编程的语法，类必须使用new调用，否则会报错

    class中的constructor方法就是构造方法，this代表实例对象，方法之间不需要逗号分割，
    使用时也是使用new命令（与构造函数相同）

    类的数据类型就是函数，类本身就指向构造函数

    class Person8 {
      constructor(name, age) {
        this.name = name;
        this.age = age;
        this.hobbies = ["jump", "rap"];
      }
    
      sayHello() {
        console.log(\`name: \${this.name}\`);
      }
    }
    
    p41 = new Person8("allx", 12);
    `
  }]
}