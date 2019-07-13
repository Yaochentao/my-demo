class Observer {
	constructor(data) {
		return(this.observe(data))
	}
	observe(data) {
		if (!data || typeof data !== 'object') {
			return data
		}
		let dep = new Dep()
		return new Proxy(data, {
			get: function (target, key, receiver) {
				console.log('监听到获取数据',target,key)
				Dep.target && dep.addSub(Dep.target);
				return Reflect.get(target, key, receiver)
			},
			set: function (target, key, value, receiver) {
				console.log(`监听到-${key}-数据修改-${value}`)
				const result = Reflect.set(target, key, value, receiver)
				dep.notify()
				console.log(result)
				return result
				
			}
		})
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