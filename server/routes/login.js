const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);




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
            }, process.env.SEED, { expiresIn: Number(process.env.CADUCIDAD_TOKEN) }) //60 x 60 es 60 segundos por 60 minutos si queremos que expire en 30 dias seria 60 * 60 * 24 * 30 que serían 30 dias por son 60 segundos x 60 minnutos x 24 horas x 30 dias

        console.log(`token ${token}`);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    })

})


//CONFIURACIONES DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }

    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}




app.post('/google', async(req, res) => {


    let token = req.body.idtoken;


    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({ ok: false, err: e })
    })



    Usuario.findOne({ 'email': googleUser.email }, (err, usuarioDb) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                let token = jwt.sign({ usuario: usuarioDb }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ ok: true, usuario: usuarioDb, token })

            }


        } else {
            //si el usuario no existe aun en la bbdd
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true
            usuario.password = ':)'
            usuario.save((err, usuarioDb) => {


                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }


                let token = jwt.sign({ usuario: usuarioDb }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ ok: true, usuario: usuarioDb, token })


            })


        }




    })

    // res.json({ usuario: googleUser })


})

module.exports = app;