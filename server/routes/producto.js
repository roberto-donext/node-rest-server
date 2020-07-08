const express = require('express');
const app = express();


const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion')

let Producto = require('../models/producto')



///
/// Obtener todos los productos
///

app.get('/productos', verificaToken, (req, res) => {
    //traer todos los productos populando y paginado

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite ||  5
    limite = Number(limite)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {


            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existen productos' }
                })
            }

            res.json({ ok: true, productos })


        })





})


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe el producto' }
                })
            }

            res.json({ ok: true, productos })
        })

})



///
/// Obtener producto por id
///

app.get('/productos/:id', verificaToken, (req, res) => {
    //populando

    let id = req.params.id;

    Producto.findOne({ _id: id, disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe el producto' }
                })
            }

            res.json({ ok: true, producto })
        })


})


///
/// Crear un producto
///

app.post('/productos', verificaToken, (req, res) => {
    //saber que usuario es
    //grabar una categoria del listado de categorias

    let body = req.body;

    let newProducto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })


    newProducto.save((err, productoDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({ ok: true, producto: productoDb })

    })

})


///
/// Actualizar un producto
///

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let newBody = _.pick(body, ['nombre', 'precioUni', 'descripcion', 'categoria'])

    Producto.findOneAndUpdate({ _id: id, disponible: true }, newBody, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe el producto' }
            })
        }

        res.json({ ok: true, producto })

    })



})


///
///  Borrar un producto
///

app.delete('/productos/:id', verificaToken, (req, res) => {
    //borrar su estado en su propiedad disponible

    let id = req.params.id;

    Producto.findOneAndUpdate({ _id: id, disponible: true }, { disponible: false }, { new: true, runValidators: true }).exec((err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe el producto' }
            })
        }

        res.json({ ok: true, producto })

    })

})



module.exports = app;