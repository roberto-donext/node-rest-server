////////////////////
/// VERIFICAR TOKEN
////////////////////

const jwt = require('jsonwebtoken');



let verificaToken = (req, res, next) => {


    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;

        next()

    })

}

let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next()
        return
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        })
    }

}


module.exports = {
    verificaToken,
    verificaAdminRol
}