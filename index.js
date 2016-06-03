var http = 		require('http');
var express =   require('express');
var path = 		require('path');

var app = express();

app.listen(8888, ()=> console.log("Сервак запущен"));
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req,res)=> {
	res.sendFile('helloworld.html', {root: __dirname})
})