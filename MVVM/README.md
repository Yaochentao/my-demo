### Object.defineProperty缺陷

- 无法监听数组变化

Vue.js2.x是基于Object.defineProperty对对象实现“响应式化”，而对于数组，Vue.js提供的方法是重写push、pop、shift、unshift、splice、sort、reverse这七个[数组方法](http://v1-cn.vuejs.org/guide/list.html#)。修改数组原型方法的代码可以参考[observer/array.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js)以及[observer/index.js](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L45)。

参考[Vue官网](https://cn.vuejs.org/v2/guide/list.html#数组更新检测)。

如果需要用数组下标修改数组并实现响应式数据变化，Vue.js提供了[$set()及$remove()方法](http://v1-cn.vuejs.org/guide/list.html#)。

vue.$set方法事实上是调用了之前重写了的slice()方法

- 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历

### Proxy

- 可以监听数组变化,
- 可以监听对象，不需要深度遍历
- 兼容性不好

