class Observer {
	constructor (data) {
		this.observe(data)
	}
	// 添加监听
	 observe (data) {
		 if(typeof data !== 'object' || !data) {
			 return     // 递归出口  数据不存在或者数据不为对象时返回
		 }

		 Object.keys(data).forEach(key => {
			 this.defineReactive(data, key, data[key])
			 this.observe(data[key])
		 })
	 }
	 defineReactive (object, key, value) {
        let _this = this;
        // 每个变化的数据都会对应一个Dep dep中的subs为订阅者（watcher）
        let dep = new Dep();

        // 获取某个值被监听到
        Object.defineProperty(object, key, {
            enumerable: true,
            configurable: true,
			get () { // 当取值时调用的方法
				console.log(`getter获取了${key}`)
				Dep.target && dep.addSub(Dep.target);
				return value;
            },
			set (newValue) { // 设置值得时候调用的方法
				console.log(`${value} setter${key}更新了${newValue}`)
                if(newValue !== value) {
					console.log('通知更新')
                    _this.observe(newValue); // 重新赋值如果是对象进行深度劫持
					value = newValue;
					console.log(dep.subs)
                    dep.notify(); // 通知所有人数据更新了
                }
            }
		});
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }
    // 添加订阅
    addSub(watcher) {
        this.subs.push(watcher);
    }
    // 通知
    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
}
