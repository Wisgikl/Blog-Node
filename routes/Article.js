const { Router } = require("express");
const router = Router();
const multer = require("multer")
const ArticleController = require("../controllers/Article.js")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./imagenes/articulos/')
    },

    filename: function(req,file,cb){
        cb(null,"articulo" + Date.now()+ file.originalname)
    }
})

const subidas = multer({storage:storage})

//Rutas de pruebas

router.get("/ruta-de-prueba", ArticleController.prueba);
router.get("/curso", ArticleController.curso);

//Ruta util
router.post("/create",ArticleController.create)
router.get("/articles/:ultimate?",ArticleController.obtainArticle)
                    // ^ Es un parametro no obligatorio
router.get("/article/:id",ArticleController.uno)
                   // ^  Es un parametro obligatorio
router.delete("/article/:id",ArticleController.deletes)
router.put("/article/:id",ArticleController.edit)
router.post("/subir-imagen/:id",[subidas.single("file0")],ArticleController.subir)
router.get("/imagen/:fichero",ArticleController.imagen)
router.get("/buscar/:busqueda",ArticleController.buscador)
module.exports = router;
