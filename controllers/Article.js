const fs = require("fs")
const path = require("path")
const {validate_article } = require("../handlers/validate")
const Article = require("../models/Article");


const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};

const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");

  return res.status(200).json([
    {
      curso: "Master en React",
      autor: "Victor robles web",
      url: "victorroblesweb.es/master-react",
    },
    {
      curso: "Master en React",
      autor: "Victor robles web",
      url: "victorroblesweb.es/master-react",
    },
  ]);
};

const create = (req, res) => {
  //Recoger los params por post a guardar
  let params = req.body;

  //Validar datos
  try{ 
    validate_article(params)
  }catch (error) {
  return res.status(400).json({
    status: "error",
    mensaje: "Faltan datos por enviar",
  });
}

  //Crear el objeto a guardar
  const article = new Article(params);

  //Asignar valores a objeto basado en el modelo(manual o auto)

  //Guardar el articulo en al bd
  article.save().then((articleSaved) => {
    if (!articleSaved) {
      return res.status(400).json({
        status: "error",
        mensaje: "Error al crear un nuevo artículo",
      });
    }
    //Devolver el resultado
    return res.status(200).json({
      status: "Succes",
      article: articleSaved,
      mensaje: "Articulo creado con exito!!",
    });
  });
};

const obtainArticle = async (req, res) => {
  try {
    let query = Article.find({}).sort({ date: -1 });

    if (req.params.ultimate) {
      query = query.limit(3);
    }


    const articles = await query.exec(); // Ejecuta la consulta y obtiene los resultados

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos",
      });
    }

    return res.status(200).json({
      status: "success",
     
      counter:articles.length,
      articles,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener los artículos",
    });
  }
};


const uno = (req,res) =>{
  //Recoger un id por la url
  const id = req.params.id
  //Buscar al articulo
  Article.findById(id)
    .then(article =>{
    //Si no existe devolver error
    if (!article || article.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado el articulo",
      });
    }
    //Devolver resultado
    return res.status(200).json({
      status:"Succes",
      article
    })
  })

}


const deletes = (req,res)=>{

  const article_id = req.params.id

  Article.findOneAndDelete({_id: article_id})
    .then(article_deleted =>{

      if(!article_deleted || article_deleted === 0){
        return res.status(500).json({
          status: "error",
          mensaje: "Error al borrar",
        });
      }



      return res.status(200).json({
        status:"Succes",
        mensaje:"Metodo de borrar",
        article:article_deleted
      })
    })
  
}





const edit = (req,res)=>{
  //Recoger id 
  const id = req.params.id

  //Recoger datos del body
  let params = req.body
  //Validar datos
  try{ 
    validate_article(params)
  }catch (error) {
  return res.status(400).json({
    status: "error",
    mensaje: "Faltan datos por enviar",
  });
}
  //Buscar y acutalizar articulo
    Article.findOneAndUpdate({_id: id},params, {new:true})
                                                // ^ Devuelve el objeto tal cual queda despues de actualizar
                                      // ^ Datos a actualizar
      .then(article_updated =>{

        if(!article_updated || article_updated === 0){
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar",
        });
      }

        //Devolver respuesta
        return res.status(200).json({
          status:'success',
          mensaje :'Artículo Actualizado!!!',
          article:article_updated
        })
      })

}

const subir=(req,res)=>{

  //Configurar multer

  //Recoger el fichero de imagen subido
  if(!req.file && !req.files){
    return res.status(404).json({
      status:"error",
      mensaje:"No has enviado el archivo"
    })
  }
  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extension del archivo
  let archivo_split = archivo.split("\.");
  let extension = archivo_split[1]
  //Comprobar extension correcta
  if(extension != "png" && extension !="jpg" &&
     extension !="jpeg" && extension !="gif"){
      //Borrar archivo y dar respuesta
      fs.unlink(req.file.path,(error)=>{
        return res.status(400).json({
          status:"error",
          mensaje:"Archivo invalido"
        })
      })
     }else{

      
     //Recoger id
     const id = req.params.id

     //Buscar y acutalizar articulo
       Article.findOneAndUpdate({_id: id},{img:req.file.filename}, {new:true})
                                                   // ^ Devuelve el objeto tal cual queda despues de actualizar
                                         // ^ Datos a actualizar
         .then(article_updated =>{
   
           if(!article_updated){
            return res.status(500).json({
             status: "error",
             mensaje: "Error al actualizar",
           });
         }
   
           //Devolver respuesta
           return res.status(200).json({
             status:'success',
             article:article_updated,
             fichero:req.file
           })
         })

     }
}

const imagen = (req,res)=>{
  let fichero = req.params.fichero
  let ruta_fisica = "./imagenes/articulos/"+fichero;

  fs.stat(ruta_fisica, (error,existe)=>{//   Va a comprobar si tengo acceso a ese fichero
    if(existe){
      return res.sendFile(path.resolve(ruta_fisica))//Consigue el archivo fisico
    }else{
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        fichero,
        ruta_fisica
      });
    }
  })}

  const buscador = async (req, res) => {
    try {
      // Sacar el string de búsqueda
      let busqueda = req.params.busqueda;
      
      // Utilizar Promesas en lugar de exec()
      const articulosEncontrados = await Article.find({
        "$or": [
          { "title": { "$regex": busqueda, "$options": "i" } },
          { "content": { "$regex": busqueda, "$options": "i" } },
        ]
      }).sort({ date: -1 });
  
      if (!articulosEncontrados || articulosEncontrados.length <= 0) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado los artículos"
        });
      }
  
      return res.status(200).json({
        status: 'success',
        article: articulosEncontrados
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error en el servidor"
      });
    }
  }

module.exports = {
  prueba,
  curso,
  create,
  obtainArticle,
  uno,
  deletes,
  edit,
  subir,
  imagen,
  buscador
};
