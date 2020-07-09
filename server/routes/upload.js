const express = require('express');
const fileupload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs');
const path = require('path');





app.use(fileupload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Los tipos validos son ' + tiposValidos.join(',') } })
    }


    if (!req.files)
        return res.status(400)
            .json({ ok: false, err: { message: 'No se ha subido ningún archivo' } })

    let archivo = req.files.archivo; //archivo es el nombre del input donde se envia la imagen


    //extensiones permitidas

    let extensionesValidas = ["jpg", "png", "gif", "jpeg"];

    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las extensiones validas son ' + extensionesValidas.join(',') } })
    }


    let nombreUnicoArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreUnicoArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });

        if (tipo === tiposValidos[0]) {

            imagenProducto(id, res, nombreUnicoArchivo)

        } else {
            imagenUsuario(id, res, nombreUnicoArchivo)
        }




    });

})


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDb) => {

        if (err) {
            console.log('error encontrando al usuario');
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({ ok: false, err })
        }

        if (!usuarioDb) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe' } })
        }


        //hay que borrar la imagen de un usuario si ya existiera con anterioridad
        borraArchivo(usuarioDb.img, 'usuarios')

        usuarioDb.img = nombreArchivo;

        usuarioDb.save((err, usuarioGuardado) => {
            res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivo })
        })


    })
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDb) => {

        if (err) {
            console.log('error encontrando el producto');
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({ ok: false, err })
        }

        if (!productoDb) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({ ok: false, err: { message: 'El producto no existe' } })
        }


        //hay que borrar la imagen de un usuario si ya existiera con anterioridad
        borraArchivo(productoDb.img, 'productos')

        productoDb.img = nombreArchivo;

        productoDb.save((err, productoGuardado) => {
            res.json({ ok: true, producto: productoGuardado, img: nombreArchivo })
        })

    })

}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app;