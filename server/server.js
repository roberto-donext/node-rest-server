require('./config/config')


const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.use(require('./routes/usuario'));

//user strider
// password ZP7sHNLd6HSd5Cs

//mongodb+srv://strider:ZP7sHNLd6HSd5Cs@cluster0.yk4s6.mongodb.net/cafe


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {

    if (err) {
        console.log('error');
        throw err;
    }

    console.log('connected to ddbb');


});



app.listen(process.env.PORT, () => {

    console.log(`listen at ${process.env.PORT}`);
})