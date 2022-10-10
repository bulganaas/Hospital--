const User = require("../models/User"); //models доторх User model оруулж ирнэ.
const MyError = require("../utils/myError"); //myError оруулж ирнэ
const asyncHandler = require("express-async-handler"); //express npm-ээс авсан
const sendEmail = require("../utils/email"); //sendEmail-г email-ээс оруулж ирнэ. 
const crypto = require('crypto'); //crypto оруулж ирнэ

//register 
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body); //User model-ээс create функцээр хадгална/req.body-д хадгална
  
  const token = user.getJsonWebToken(); //getJsonWebToken дамжуулаад jwt хувьсагч болно. 

  res.status(200).json({
    //Category дотор json-г үүсгэх promise ажиллаж дуусаад database- category - д орно.
    success: true,
    token, //хувьсагчийг харуулна
    user: user,
  });
});

 //логин хийнэ 
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body //req.body дотор байгаа
  //Оролтыгоо шалгана
  if(!email || !password) {
    //email, эсвэл password байхгүй бол
    res.status(400).json({
      success:false,
      result: "Email/password oruulj ogno uu"
    })
  }
      //Хэрвээ байвал тухайн хэрэглэгчийг хайна
const user = await User.findOne({email}).select('+password'); //password орж ирнэ
   
  if (!user) {
    res.status(401).json({
      success: false,
      result: "hereglegch oldsongui",
    });
  //мэдээг дамжуулна
  }

  //нууцүгээ шалгана
  const ok = await user.checkPassword(password); //frontend-Ээс ирсэн нууц үг таарч байвал boolean буцаана
 //promise буцаах тул await Хийнэ

  if (!ok) {
    //байхгүй бол
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
   
  }
 
  res.status(200).json({
    //USER дотор json-г үүсгэх promise ажиллаж дуусаад database- user - д орно.
    success: true,
    token: user.getJsonWebToken(), //хувьсагчийг харуулна //getJsonWebToken дамжуулаад jwt хувьсагч болно.
    user: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  //asyncHandler аргументаараа (async (req, res, next) функцийг хүлээж авч байна.
  //asyncHandler; - middleware/asyncHandler оруулж ирсэн
  //asyncHandler middleware функц нь try  catch, next(err) алдааны мэдээг автоматаар дамжуулна
  //async болгоно, mongoose-ийн функц маань promise өгдөг байгаа.
  const page = parseInt(req.query.page) || 1; //If page-г default-аар дамжуулаад байвал 1 гэсэн page үзнэ //req.query page авлаа//Parseint тооруу хөрвүүлэх JS функц
  const limit = parseInt(req.query.limit) || 10; //req.query лимит авлаа//хэрвээ Limit утга байвал Limit дамжуулна. Байхгүй бол 100 defaultaaр болно
  const sort = req.query.sort; //req.query sortлоно
  const select = req.query.select; //query дотор json обьектийг авна //авах ёстой 4 юмаа аваад дараа нь устгаж байна

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]); //dynamic-аар тул массиваар[el] бичнэ //massive дээр foreach хийгээд el болгоны хувьд delete
  //query обьект дотор устана
  //Pagination

  const total = await User.countDocuments(); //Нийт category дотор хэдэн юм байгааг тоолно
  const pageCount = Math.ceil(total / limit); //бутархай тоо тул бүхэлчлэх тааз өгнө
  const start = (page - 1) * limit + 1; //эхлэл
  let end = start + limit - 1; //сүүл
  if (end > total) end = total; // хэрэв end нь total-аас их байх юм бол end нь total тэнцүү байна.

  const pagination = { total, pageCount, start, end, limit, User };

  if (page < pageCount) pagination.nextPage = page + 1; //дараачийн болон өмнөх обьектийг агуулдаг // page-ний тоо нь page-ээс их байх юм бол pagination обьект дээрээ дотор нь Next дараагийн хуудас Нэмж өгнө. Хуудсыг нэгээр нэмэгдүүлнэ
  if (page > 1) pagination.prevPage = page - 1; //хэрвээ page нь 1-ээс эрс их байх юм бол prevPage нь Page - 1 байна

  console.log(req.query, sort, select); //req- обьектийн query дотор ороод ирдэг//express маань орж ирдэг
  //ямар нэг алдаа гарвал шалгана.

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(start - 1) //алгасана
    .limit(limit); //sort, select, query хийсэн //req.query-дагуу query уншина//Бүх категорио mongoose-ийн категорийн find гэдэг функцийг ашиглаад дууддаг, олж авна: Тэр функц маань хүлээх ёстой, Category моделийн find гэдэг функцыг дуудахнээ.

  //res.send(categories);
  res.status(200).json({
    success: true,
    data: users, //нэгэнт категороо олчвол data-д хэвлэнэ
    pagination, //pagination-г гаргана
  });
});


exports.getUser = asyncHandler(async (req, res, next) => {
  //async болгоод // asynchandler дуудаад category id байхгүй бол MyError цацаад мессеж илгээнэ

  //алдааг шалгана
  const user = await User.findById(req.params.id); //id-аар нь хайж олоод олдвол category өгнө//books-гэдэг талбарыг дүүргээд өгөөч

  if (!user) {
    //Хэрвээ category байхгүй тохиолдолд дуусгана. Үүний тулд return хийнэ
    throw new MyError(req.params.id + "ID-тэй хэрэглэгч байхгүй.", 400); //throw new - JSийн custom error бичих, шинээр юу цацах гэж байгаа. MyError алдааны обьект үүсгэнэ. Message, statuscode үүсгэнэ.
  } //нэгэнт категороо олчвол data-д хэвлэнэ

  //category дуудах болгонд rest api цаанаас нь дуудна
  //category.name += "-"; //category-ийн нэр оруулсан
  // category.save(function (err) {//category function-г дуудна//callback function save хийгээд байх нь
  //   if(err) console.log('error : ', err); //хэрэв алдаа гарвал алдааг мэдээлнэ
  //  console.log('saved...'); //алдаа гарахгүй бол энэ мэдээлэл гарна
  //});

  res.status(200).json({
    success: true,
    data: user, //Олдсон category харуулна
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  console.log("data:", req.body); //postmanaas json data req авна

  //хэрвээ алдаа үүсэх бол //async, await хэрэглэж байгаа үед заавал try/catch хйиж өгөх ёстой байдаг
  const user = await User.create(req.body); //Category дотор json-г үүсгэнэ, promsfunction // амжилттай ажиллах юм бол үүссэн мэдээг буцаана
  //Алдаа гарахгүй бол доорх код ажиллана
  res.status(200).json({
    //Category дотор json-г үүсгэх promise ажиллаж дуусаад database- category - д орно.
    success: true,
    data: user, //Үүссэн category датаг буцаана
  });

});

exports.updateUser = asyncHandler(async (req, res, next) => {
  //алдааг шалгана
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //шинээр үүссэнийг харуулна, авна гэсэн тохиргоо хийж өгнө
    runValidators: true, //model дээр шалгаад байсан тэр шалгалтыг шалгаарай гэж зааж өгч байна //ж: 50 тэмдэгтээс ихгүй гэх мэт
  }); //req.params.id  - ийм id-тай бичлэгрүү req.body гэдэг json-ийг өөрчилөөд өгөөрэй гэсэн хүсэлт явуулна
  if (!user) {
    throw new MyError(req.params.id + "ID-тэй хэрэглэгч байхгүй ээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: user, // өрөө харуулна
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  //async function

  //алдааг шалгана
  const user = await User.findById(req.params.id); //ID -аар нь олоод//findByIdAndDelete - функц нь id-аар нь хайж олоод category устгана
  if (!user) {
    throw new MyError(req.params.id + "ID-тэй хэрэглэгч байхгүй ээ.", 400);
  }
  user.remove(); //дараа нь устгах

  res.status(200).json({
    success: true,
    data: user, //устгасан хэрэглэгч харуулна
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //async болгоод // asynchandler дуудаад category id байхгүй бол MyError цацаад мессеж илгээнэ
  //алдааг шалгана
  if (!req.body.email) {
    //хэрэв email байхгүй бол
    throw new MyError("Та нууц үг сэргээх имэйл хаягаа дамжуулна уу.", 400); //exception буцна.
  }

  const user = await User.findOne({ email: req.body.email }); //id-аар нь хайхгүй, зүгээр нэг хэрэглэгчийн email нь email-тай тэнцүү байх ёстойг хайж олно.
  //user дотор req.body.email байгаа
  if (!user) {
    //Хэрвээ category байхгүй тохиолдолд дараах мессежийг илгээнэ.
    throw new MyError(req.body.email + "имэйлтэй хэрэглэгч олдсонгүй!", 400); //throw new - JSийн custom error бичих, шинээр юу цацах гэж байгаа. MyError алдааны обьект үүсгэнэ. Message, statuscode үүсгэнэ.
  } //нэгэнт имэйл-хэрэглэгчээ олчвол data-д хэвлэнэ

  const resetToken = user.generatePasswordChangeToken(); //хэрэглэгчийн generatePasswordChangeToken функцийг үүсгээд resetPasswordToken дотор оруулна.
  //await user.save({validateBeforeSave:  false}); //хадгалахдаа нэр, эмайл нь ийм тийм байх ёстойг болиулна.
  await user.save(); //баазад хадгалаад буцаад явуулна.

  //Имэйл илгээнэ
  const link = `https://munkhdom.mn/changepassword/${resetToken}`;
  const message = `Сайн байна уу<br><br>Та нууц үгээ солих хүсэлт илгээлээ.<br>Нууц үгээ доорхи линк дээр
  дарж солино уу:<br><br><a target="_blanks" href="${link}">${link}</a><br><br>Өдрийг сайхан өнгөрүүлээрэй!`;

  const info = await sendEmail({
    //info хүлээж авна
    //Хэрвээ имайл амжилттай явбал resetToken буцаана.
    email: user.email, //хэрэглэгчийн эмайл илгээнэ
    subject: "Нууц үг өөрчлөх хүсэлт",
    message,
  });

  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken, //Үүссэн токенийг буцаана.
  });
});


exports.resetPassword = asyncHandler(async (req, res, next) => {
  //async болгоод // asynchandler дуудаад category id байхгүй бол MyError цацаад мессеж илгээнэ
  //алдааг шалгана
  if (!req.body.resetToken || !req.body.password) {
    //resetToken эсвэл солих password байх ёстой байх
    throw new MyError("Та токен болон нууц үгээ дамжуулна уу.", 400); //exception буцна.
  }

  const encrypted = crypto
    .createHash("sha256")
    .update(req.body.resetToken) //токеноо өөрчилнө
    .digest("hex"); //hex 16тай, resetToken нь зөв байвал Hash үүсгэнэ

  const user = await User.findOne({
    resetPasswordToken: encrypted,
    resetPasswordExpire: { $gt: Date.now() }, //одоо байгаа цагаас их байх ёстой
  }); //id-аар нь хайхгүй, зүгээр нэг хэрэглэгчийн email нь email-тай тэнцүү байх ёстойг хайж олно.
  //user дотор req.body.email байгаа
  if (!user) {
    //Хэрвээ хэрэглэгч байхгүй тохиолдолд дараах мессежийг илгээнэ.
    throw new MyError("Токен хүчингүй байна!", 400); //throw new - JSийн custom error бичих, шинээр юу цацах гэж байгаа. MyError алдааны обьект үүсгэнэ. Message, statuscode үүсгэнэ.
  } //нэгэнт имэйл-хэрэглэгчээ олчвол data-д хэвлэнэ

  user.password = req.body.password; //password нь дамжуулсан password-тай адилхан болох ба солигдоно.
  user.resetPasswordToken = undefined; //token хүчингүй болно 
  user.resetPasswordExpire = undefined; //resetPasswordExpire нь бас хүчингүй болно.
  await user.save(); //хэрэглэгчээ хадгалаад хүлээгээд дууссаны дараа шинэ токен дамжуулна
 
const token = user.getJsonWebToken(); //getJsonWebToken дамжуулаад jwt хувьсагч болно.

res.status(200).json({
  //User дотор json-г үүсгэх promise ажиллаж дуусаад database- user - д орно.
  success: true,
  token, //хувьсагчийг харуулна
  user: user,
});

});