import bridge from './bridge'
// 安卓
export function isAndroid() {
    return /android/.test(navigator.userAgent.toLowerCase())
}

// IOS
export function isIOS() {
    return /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

/**
 * buryPoint 桥接
 * @param eventName 事件名
 */
export function buryPoint(eventName, callback) {
    if (isAndroid()) {
        window.android.addPoint(eventName)
    } else {
        bridge.callhandler('addPoint', eventName, callback)
    }
}

/**
 * 判断echart坐标轴数据都为0的情况
 * author:liying
 * @param 坐标轴数据 
 */
export function isNullY(data) {
    let arr = [], isNUllY;
    for (let i of data) {
        if (i == 0) {
            arr.push(i);
        }
    }
    if (arr.length == data.length) {
        isNUllY = true;
    } else {
        isNUllY = false;
    }
    return isNUllY;
}

/**
 * isArray：判断数据是不是数组类型的数据
 * author:liying
 */
export function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * isPlainObject：判断数据是不是Object类型的数据
 * author:liying
 */
export function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * isFunction：检查 value 是不是函数
 * author:liying
 */
export function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

/**
 * isLength：检查 value 是否为有效的类数组长度
 * author:liying
 */
export function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}

/**
 * isArrayLike：检查 value 是否是类数组
 * 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。这里字符串也将被当作类数组。
 * author:liying
 */
export function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * isEmpty：检查 value 是否为空
 * author:liying
 */
export function isEmpty(value) {
    // 如果是null，直接返回true
    if (value == null) {
        return true;
    }
    // 如果是类数组，判断数据长度
    if (isArrayLike(value)) {
        return !value.length;
        // 如果是Object对象，判断是否具有属性
    } else if (isPlainObject(value)) {
        for (let key in value) {
            if (hasOwnProperty.call(value, key)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * extend：将属性混合到目标对象中
 * author:liying
 */
export function extend(to, _from) {
    for (let key in _from) {
        to[key] = _from[key];
    }
    return to
}

//格式化金额
function outputdollars(number) {
    if (number.length <= 3)
        return (number == '' ? '0' : number);
    else {
        var mod = number.length % 3;
        var output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (let i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}

function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}

//格式化钱数，三位加一逗号
export function toThousands(number) {
    number = number + "";
    number = number.replace(/\,/g, "");
    if (isNaN(number) || number == "" || number == 0) return 0;
    number = Math.round(number * 100) / 100;
    if (number < 0)
        return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
    else
        return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
}