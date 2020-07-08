const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre del producto es requerido'] },
    precioUni: { type: Number, required: [true, 'El precio unitario es requerido'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }



})


module.exports = mongoose.model('producto', productoSchema);