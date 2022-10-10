const errorHandler = (err, req, res, next) => { //middleware функц бичье 4 аргументтэй, next параметр хүлээж авдаг. 
    console.log(err.stack.cyan.underline); // алдаагаа хэвлээд, stack обьектийг улаанаар хэвлэнэ
    
    const error = {...err}; //err-ийг copyдоё //copy-дсэн мэдээлэлдээ error message нэмнэ
    
    error.message = err.message;

    if (error.name === "CastError") { //err-г error болгоно
      //error-ийн нэр нь CastError байх юм бол error мессеж өөрчилнө
      error.message = "Энэ ID буруу бүтэцтэй ID байна!";
      error.statusCode = 400; //client талын буруу код тул bad request
    }

    //jwt malformed
if (error.message === "jwt malformed") {
  //хэрэв алдаа нь JsonWebTokenError нь invalid token байвал алдааг орчуулж дараах мэдээг гаргана
  error.message = "Та логин хийж байж энэ үйлдлийг хийх боломжтой.";
  error.statusCode = 401; //client талын буруу код тул bad request
}

  
    if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
      //хэрэв алдаа нь JsonWebTokenError нь invalid token байвал алдааг орчуулж дараах мэдээг гаргана
      error.message = "Буруу токен дамжуулсан байна.";
      error.statusCode = 400; //client талын буруу код тул bad request
    }

    
    if (error.code === 11000) {
      //error-ийн нэр нь CastError байх юм бол error мессеж өөрчилнө
      error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
      error.statusCode = 400; //client талын буруу код тул bad request
    }
      res.status(err.statusCode || 500).json({
        // err байх юм бол error statuscode дамжуулна, харин байхгүй бол  statuscode 500 дамжуулна
        success: false, //json мэдээлэл дотроо  
        error, // гарсан error msg буцаадаг // алдааг тэр чигт нь явуулна//error: error, оронд error бичиж болно
      }); //response-Рүүгаа алдааны мэдээлэл илгээнэ//500 internal code, json мэдээлэл буцаана
};
module.exports = errorHandler; //функц экспортолно