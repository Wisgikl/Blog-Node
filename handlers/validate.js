const validator = require("validator");

const validate_article =  (params)=>{
    let validar_title =
      !validator.isEmpty(params.title) &&
      validator.isLength(params.title, { min: 5, max: 55 });
    let validar_content = !validator.isEmpty(params.content);

    if (!validar_title || !validar_content) {
      throw new Error("No se ha validado la información !!");
    }
}

module.exports ={
    validate_article
}