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



// ==================
// Client Google Id
// ==================

process.env.CLIENT_ID = process.env.CLIENT_ID || '551649410054-og0b8cqe4l00d90aqaa77h3acpf5dq4p.apps.googleusercontent.com'