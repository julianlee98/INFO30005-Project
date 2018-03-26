const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const router = require('./routes/routes');

app.use(router);

app.listen(PORT, function(){
    console.log("Express listening on port ${PORT}");
});

// app.listen(3000, function(){
//     console.log("Listening");
// });

