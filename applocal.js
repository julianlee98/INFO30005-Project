const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const router = require('./routes/routes');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/myCss', express.static(__dirname + '/views/Css/'));
app.use('/link_images', express.static(__dirname + '/views/Css/Images'));
app.use('/link_js', express.static(__dirname + '/views/Scripts'));

app.use(router);
 app.listen(3000, function(){
     console.log("Listening");
 });

