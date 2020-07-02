const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');


const app = express();


app.post('/login', (req, res) => {


    let body = req.body;

    Usuario.findOne({ 'email': body.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'usuario y contraseña incorrectos' }
            })
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: 'usuario y contraseña incorrectos' }
            })
        }


        let token = jwt.sign({
                usuario: usuarioDB
            }, 'esteEsElSeedDesarrollo', { expiresIn: process.env.CADUCIDAD_TOKEN }) //60 x 60 es 60 segundos por 60 minutos si queremos que expire en 30 dias seria 60 * 60 * 24 * 30 que serían 30 dias por son 60 segundos x 60 minnutos x 24 horas x 30 dias

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    })

})


module.exports = app;