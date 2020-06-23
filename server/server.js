require('./config/config')


const express = require('express');
const app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.get('/usuario', (req, res) => {
    console.log('escuchando');
    res.send({ success: true, data: 'get' })
})


app.post('/usuario/:id', (req, res) => {


    let body = req.body;

    if (body.nombre === undefined) {

        return res.status(400).send({ success: false, mensaje: 'nombre es necesario' })
    }

    res.send({ body })
})

app.put('/usuario', (req, res) => {
    console.log('escuchando');
    res.send({ success: true, data: 'put' })
})

app.delete('/usuario', (req, res) => {
    console.log('escuchando');
    res.send({ success: true, data: 'delete' })
})




app.listen(process.env.PORT, () => {

    console.log(`listen at ${process.env.PORT}`);
})