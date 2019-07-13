// 发布/订阅模式

let event = {
	list: {},
	on(key, fn) {
		// 将回调函数存在数组中
		if(!this.list[key]) {
			this.list[key] = []
		}
		this.list[key].push(fn)
		// console.log(this.list[key])
	},
	emit() {
		let key = [].shift.call(arguments)    //arguments是一个类数组对象，虽然他也有下标，但并非真正的数组，所以他不能和数组一样进行排序添加之类的操作,需借用array.prototype对象上的方法
		let fns = this.list[key]
		if(!fns || fns.length === 0) {
			// 如果key对应的回调函数不存在 则返回
			return false
		}
		fns.forEach(fn => {
			// console.log(arguments)
			fn.apply(this, arguments)
		})
	},
	remove(key, fn) {
		let fns = this.list[key]
		if(!fns) {
			return false
		}
		if(!fn) {
			// 不传fn时清空key对应的回调
			fns && (fns.length = 0) //如果fns不为空，则清空fns
		}
		else {
			fns.forEach((cb, index) => {
				if(cb === fn) {
					fns.splice(index, 1)
				}
			})
		}
	}
}
function test1() {
	console.log(...arguments)
}
function test2() {
	console.log('test2')
}
event.on('test', test1)
event.on('test', test2)
event.emit('test','test参数1','test参数2')
console.log(event.list)
event.remove('test',test1)
console.log(event.list)
