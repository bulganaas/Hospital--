const jwt = require("jsonwebtoken");
const asyncHandler = require('./asyncHandle'); //asynchandler оруулж ирнэ
const MyError = require('../utils/myError');
const User = require('../models/User');
//register
exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    //protect функц нь бүх header дотроос authorization байгааг шалгана
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү. Authorization header-ээр токеноо дамжуулна уу.",
      401
    );
  }
  const token = req.headers.authorization.split(" ")[1]; //token-г авахын тулд хоосон зайгаар split хийгээд 2 дахь гишүүнийг сонгоод token- хувьсагчид оруулна
  if (!token) {
    //token байхгүй эсэхийг шалгана
    throw new MyError("Токен байхгүй байна.", 400); //байхгүй бол error алдаа заана
  }

  const tokenObj = jwt.verify(token, process.env.JWT_SECRET); //jwt дотор verify функц байгаа token-г шалгана
  //token-г задлаад object ороод ирнэ
  console.log(tokenObj);
  //req.user = await User.findById(tokenObj.id); //ямар хэрэглэгч бэ гэдгийг id-аар нь шалгана

  req.userId = tokenObj.id; //хэрэгтй газар нь хэн логин хийснийг хадгална
  //login хийх үед userId, userRole хадгална
  req.userRole = tokenObj.role; //token--ийн role-р шалгах боломжтой болно
  next(); //үүнийг хийж дуусаад дараачийн middleware ажиллана
});
  
  exports.authorize = (...roles) => { //массиваар сонгоно
    return (req, res, next) => {
      if(!roles.includes(req.userRole)) {
        //role дотор байгаа эсэхийг Includes гэдгээр шалгаж болно
        throw new MyError(
          "Таны эрх [" +
            req.userRole +
            "] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй!.",
          403
        ); //хэрэв байхгүй бол
      } 
           next();//хэрвээ байх юм бол middleware-луу шилжинэ
     
      };
  };