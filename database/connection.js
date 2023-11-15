//requiero de mongoose que nos va a permitir conectarnos a la bd

const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Mi_blog");

    //Parametros dentro de objeto
    //SOLO EN CASO DE AVISO
    //useNewUrlParser:true
    //useUnifiedTopology:true
    //useCreateIndex:true

    console.log("Conectador correctamente a la base de datos Mi_blog!!");
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  connection,
};
