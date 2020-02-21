// const log = () => console.log.apply(console, arguments); // apply传入的是对象和数组
// const log = rowLog.bind(undefined, "allx: ");

// function log() {
//   console.log.apply(console, arguments); // apply传入的是对象和数组
// }



const log = (...arguments) => console.log.apply(console, arguments); // apply传入的是对象和数组
// const allxLog = log.bind(undefined, `[ALLX(${Date.now()})]: `);
const allxLog = log.bind(undefined, `[ALLX(${(new Date()).toLocaleString()})]: `);
allxLog("hello");
allxLog(__dirname);
allxLog(__filename);

log(1, 2);
log(1, 2, 3);

// log("123".prototype.toString());
log(Object.prototype.toString.call("123"));
log(Object.prototype.toString.call(123));
log(Object.prototype.toString.call(() => {}));

const isType = type => obj => Object.prototype.toString.call(obj) == '[object ' + type + ']';
const isString = isType("String"); //专一功能检测函数，检测字符串
const isNumber = isType("Number"); //专一功能检测函数，检测数字
const isFunction = isType("Function"); //专一功能检测函数，检测函数
log(isString("123"));
log(isString(123));
log(isFunction(() => {}));

// function list() {
//   return Array.prototype.slice.call(arguments);
// }

const slice = Function.prototype.call.bind(Array.prototype.slice);
const list = (...arguments) => slice(arguments);

let list1 = list(1, 2, 3); // [1, 2, 3]

// 预定义参数37
const leadingThirtysevenList = list.bind(undefined, 37);

let list2 = leadingThirtysevenList(); // [37]
log(list2);
let list3 = leadingThirtysevenList(1, 2, 3); // [37, 1, 2, 3]
log(list3);