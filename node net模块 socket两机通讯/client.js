var net = require('net');
var localAddress = '127.0.0.1'
var localPort = 80
var port = 8080;
var host = '127.0.0.1';
var client= new net.Socket();
//创建socket客户端
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
client.setEncoding('utf8');
//连接到服务端
let options = {
  port: port,
  host: host,
  localAddress: localAddress,
  localPort: localPort
}
client.connect(options, function(){
  console.log('connect:' + client.remoteAddress + ':' + client.remotePort);
  console.log('连接成功')
  client.write('hello');
  //向端口写入数据到达服务端
});
client.on('data',function(data){
  console.log('接收到消息:'+ data);
  //得到服务端返回来的数据
});
client.on('error',function(error){
//错误出现之后关闭连接
  console.log('error:'+error);
  client.destroy();
});
client.on('close',function(){
//正常关闭连接
  console.log('Connection closed');
});

rl.on('line', (input) => {
  console.log(`发送: ${input}`);
  client.write(`${input}\r\n`);
});