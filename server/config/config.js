// ==================
// puerto
// ==================

process.env.PORT = process.env.PORT || 3000;


// ==================
// entorno
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


console.log(process.env.NODE_ENV);
// ==================
// BBDD
// ==================

let urlDb;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe'
} else {
    urlDb = process.env.MONGO_URI;
}



// ==================
// Vencimiento token
// =================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;

// ==================
// Seed
// ==================
process.env.SEED = process.env.SEED || 'esteEsElSeedDesarrollo';



process.env.URLDB = urlDb