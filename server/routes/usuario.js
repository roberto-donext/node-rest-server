const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');


app.get('/usuario', verificaToken, (req, res) => {


    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    let condition = { 'estado': true }

    Usuario.find(condition, 'nombre email role estado google img').limit(limite).skip(desde).exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.count(condition, (err, conteo) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({ ok: true, usuarios, cuantos: conteo });


        })



    })



})


app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })



    })

})

app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {


    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.send({ ok: true, usuario: usuarioDB })

    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {


    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { 'estado': false }, { new: true }, (err, document) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({ ok: true, document })


    })


})


module.exports = app;