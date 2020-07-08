const express = require('express');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
let app = express();
const _ = require('underscore');
let Categoria = require('../models/categoria');

//obtiene todas categorias
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)


    Categoria.find({}, '-__v')
        .populate('usuario', "nombre email")
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({ ok: true, categorias })


        })


})


//obtiene  categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(401).json({ ok: false, err: { message: 'No existe la categoría' } })
        }

        res.json({ ok: true, categoria })
    })


})



//crear nueva  categoria 
app.post('/categoria', verificaToken, (req, res) => {
    //regresamos la nueva categoria

    let body = req.body;
    let user = req.usuario._id;

    let newCategory = new Categoria({
        descripcion: body.descripcion,
        usuario: user
    })

    newCategory.save((err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            categoria: newCategory
        })
    })

})



//actualiza nueva  categoria 
app.put('/categoria/:id', verificaToken, (req, res) => {
    //regresamos la nueva categoria



    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe la categoria' }
            })
        }

        res.json({
            ok: true,
            categoria
        })



    })


})


//actualiza nueva  categoria 
app.delete('/categoria/:id', [verificaToken, verificaAdminRol ], (req, res) => {
    //regresamos la nueva categoria
    //solo administrador puede borrar categoria
    //

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe la categoria' }
            })
        }

        res.json({ ok: true, categoria })

    })


})



module.exports = app;