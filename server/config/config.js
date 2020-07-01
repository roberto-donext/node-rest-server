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
    urlDb = 'mongodb+srv://strider:ZP7sHNLd6HSd5Cs@cluster0.yk4s6.mongodb.net/cafe'
}


process.env.URLDB = urlDb