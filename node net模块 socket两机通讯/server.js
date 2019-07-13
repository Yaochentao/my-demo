const readline = require('readline');

var net = require('net');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//模块引入
var listenPort = 8080;//监听端口

var server = net.createServer(function(socket){
  // 创建socket服务端
  console.log('connect:' + socket.remoteAddress + ':' + socket.remotePort);
  console.log('连接成功')
  socket.setEncoding('utf8');
  socket.write('hello');
  //接收到数据
  socket.on('data',function(data){
    console.log('接受到消息:' + data);
  });

  rl.on('line', (input) => {
    console.log(`发送: ${input}`);
    socket.write(`${input}\r\n`);
  });
 // socket.pipe(socket);
  //数据错误事件
  socket.on('error',function(exception){
    console.log('socket error:' + exception);
    socket.end();
  });
  //客户端关闭事件
  socket.on('close',function(data){
    console.log('client closed!');
     // socket.remoteAddress + ' ' + socket.remotePort);
  });
}).listen(listenPort);


//服务器监听事件
server.on('listening',function(){
  console.log("server listening:" + server.address().port);
});
//服务器错误事件
server.on("error",function(exception){
  console.log("server error:" + exception);
});
