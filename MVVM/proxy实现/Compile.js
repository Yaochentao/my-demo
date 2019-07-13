class Compile {
	constructor(el, vm) {
		this.el = this.isElementNode(el) ? el : document.querySelector(el)
		this.vm = vm
		// console.log(this.el, this)
		
		if(this.el) {
			let fragment = this.node2fragment(this.el)
			this.compile(fragment)
			console.log(fragment)
			this.el.appendChild(fragment);
		}
	}
	// 判断是否为元素节点
	isElementNode(node) {
        return node.nodeType === 1
	}
	// 节点转化为fragment 
	node2fragment(el) {
		let fragment = document.createDocumentFragment()
		let firstChild
		while (firstChild = el.firstChild) {
			fragment.appendChild(firstChild) // 若 appendChild() 的参数是页面存在的一个元素，则执行后原来的元素会被移除
		}
		return fragment
	}
	compile(fragment) {
		let childNodes = fragment.childNodes
		Array.from(childNodes).forEach(node => {
			// console.log(node)
			if(this.isElementNode(node)) {
				// 递归编译子节点
                this.compile(node);
				this.compileElement(node)
			} else {
				// 如果是文本节点
				this.compileText(node)
			}
		})
	}
	// 编译元素节点， 主要是其中的指令
	compileElement(node) {
		let attrs = node.attributes
		Array.from(attrs).forEach(attr => {
			let attrName = attr.name
			// console.log(attrName)
			if(this.istypeective(attrName)) {
				console.log()
				let exp = attr.value // 指令对应的表达式
				let type = attrName.slice(2) // 指令类型
				// 如果是 v-on:xxx 的事件指令
				if(this.isEventtypeective(type)) {
					compileUtil['eventHandler'](node, this.vm, exp, type)
				}
				else {
					compileUtil[type] && compileUtil[type](node, this.vm, exp);
				}
			}
		})
	}
	// 编译文本节点
    compileText(node) {
        // 获取文本节点的内容
        let exp = node.textContent;
        // 创建匹配 {{}} 的正则表达式
        let reg = /\{\{(.*)\}\}/; //存在问题  只能匹配一次 {{}}外部文本被忽略

        // 如果存在 {{}} 则使用 text 指令的方法
        if (reg.test(exp)) {
			console.log('pass')
            compileUtil["text"](node, this.vm, RegExp.$1.trim());
        }
    }
	// 判断是否是元素节点
	isElementNode(node) {
		return node.nodeType === 1
	}
	// 判断属性是否是指令
	istypeective(name) {
		return name.indexOf('v-') === 0
	}
	// 判断是否是事件指令 类似onClick
	isEventtypeective(type) {
        return type.indexOf('on') === 0
    }
}

// 指令处理集合
var compileUtil = {
    text: function(node, vm, exp) {
		console.log(node.textContent)
        this.bind(node, vm, exp, 'text');
    },

    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function(node, vm, exp, type) {
		console.log(vm,exp)
        var updaterFn = updater[type + 'Updater'];
		// console.log(this._getVMVal())
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
        new Watcher(vm, exp, function(value) {
            updaterFn && updaterFn(node, value);
        });
	},

    // 事件处理
    eventHandler: function(node, vm, exp, type) {
        var eventType = type.split(':')[1],
            fn = vm.$methods && vm.$methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
		}
		// console.log(eventType, fn)
    },

    _getVMVal: function(vm, exp) {
        var val = vm;
		exp = exp.split('.');
		console.log(vm)
		console.log(vm.$data.message)
        exp.forEach(function(k) {
            val = val[k];
		});
		console.log(val)
        return val;
    },

    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};


var updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function(node, value) {
		console.log(node, value)
        node.value = typeof value == 'undefined' ? '' : value;
    }
};