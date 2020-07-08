const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = Schema({
    descripcion: { type: String, unique: true, required:  [true, 'La descripción es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }

})


module.exports = mongoose.model('categoria', categoriaSchema);