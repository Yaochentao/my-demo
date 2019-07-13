class MVVM {
	constructor(options) {
		this.$methods = options.methods
		this.$el = options.el;
		this.$data = options.data;
		this._proxyData(this.$data)
		if(this.$el) {
			new Observer(this.$data);
			new Compile(this.$el, this)
		}

	}
	// 数据代理 实现 vm.xxx -> vm.$data.xxx
	_proxyData(data) {
		Object.keys(data).forEach((key) => {
			Object.defineProperty(this, key, {
				get() {
					return data[key]
				},
				set(newVal) {
					data[key] = newVal // data为传引用的值， data修改 this.$data也会修改
				}
			})
		})
	}

}