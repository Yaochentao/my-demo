// 观察者模式

function Subject() {
	this.observers = [];
}
Subject.prototype = {
	add: function (observer) { // 添加
		this.observers.push(observer);
	},
	remove: function (observer) { // 删除
		var observers = this.observers;
		// for (var i = 0; i < observers.length; i++) {
		// 	if (observers[i] === observer) {
		// 		observers.splice(i, 1);
		// 	}
		// }
		observers.forEach((obs, index) => {
			if(obs === observer) {
				observers.splice(index, 1)
			}
		})
	},
	notify: function () { // 通知
		var observers = this.observers;
		// for (var i = 0; i < observers.length; i++) {
		// 	observers[i].doSomething();
		// }
		observers.forEach(obs => {
			obs.doSomething(obs)
		})
		// fns.forEach((cb, index) => {
		// 	if(cb === fn) {
		// 		fns.splice(index, 1)
		// 	}
		// })
	}
}

function Observer(name) {
	this.name = name
}
Observer.prototype = {
	doSomething: function (obs) { // 更新
		console.log(obs.name+'收到通知');
	}
}
var sub = new Subject();
var obs1 = new Observer('obs1');
var obs2 = new Observer('obs2');
sub.add(obs1);
sub.add(obs2);
sub.notify(); 
console.log(sub.observers)
sub.remove(obs1)
console.log(sub.observers)