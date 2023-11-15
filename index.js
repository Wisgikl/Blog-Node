const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Inicializar app
console.log("App de node andando");

//Conectar a la base de datos
connection();

//Crear servidor Node
const app = express();
const PORT = 3900;
//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());// recibir datos con content-type app/json(raw)
app.use(express.urlencoded({extended:true})) // Recibo datos por form-urlencoded

// RUTAS
const routes_articles = require("./routes/Article")

//Cargo de rutas
app.use("/api",routes_articles)


//Rutas prubas hardcodeadas
app.get("/probando", (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");

  return res.status(200).json([{
    curso:"Master en React",
    autor:"Victor robles web",
    url:"victorroblesweb.es/master-react"
  },
  {
    curso:"Master en React",
    autor:"Victor robles web",
    url:"victorroblesweb.es/master-react"
  },]);
});
app.get("/", (req, res) => {
    
  
    return res.status(200).send(
        "<h1>Empezando a crear una api resto con node</h1>"
    );
  });
//Crear el servidor y escuchar peticiones http
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});
