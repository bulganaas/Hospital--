const Patient = require("../models/Patient"); //models доторх Category-н Category оруулж ирнэ.
const path = require('path'); //path library байдаг. Path нь file-ийн нэрийг аваад 
const Room = require("../models/Room"); //models/category-г оруулж ирнэ
const MyError = require("../utils/myError"); //myError оруулж ирнэ
const asyncHandler = require("express-async-handler"); //express npm-ээс авсан try catch
const User = require("../models/User"); //user model -г оруулж ирнэ
//api/v1/patients
exports.getUserPatients = asyncHandler(async (req, res, next) => {
  //asyncHandler аргументаараа (async (req, res, next) функцийг хүлээж авч байна.
  //asyncHandler; - middleware/asyncHandler оруулж ирсэн  //asyncHandler middleware функц нь try  catch, next(err) алдааны мэдээг автоматаар дамжуулна
  //async болгоно, mongoose-ийн функц маань promise өгдөг байгаа.  //res.send(categories);
  req.query.createUser = req.userId; //createUser-ийн ID нь userId байна
  console.log(req.query);
  const patients = await Patient.find().populate({
    path: "room", //гэдэг тохиргоон дээр нь category path-тай
    select: "RoomNo Location", //name averagePrice хамт авна гэж зааж өгнө
  }); //api/v1/books - query-ээр дуудна //бүх ном авна
  // console.log(patients)//query ажиллуулаад books массив үүсгэж байна/ Дээрх 2 код аль нэг нь ажиллаад үр дүнд нь books буцаана
  res.status(200).json({
    success: true,
    count: patients.length, //номны тоог гарганаа
    data: patients, //нэгэнт категороо олчвол data-д хэвлэнэ
  });
});

//api/v1/patients
exports.getPatients = asyncHandler(async (req, res, next) => {  //asyncHandler аргументаараа (async (req, res, next) функцийг хүлээж авч байна.
  //asyncHandler; - middleware/asyncHandler оруулж ирсэн  //asyncHandler middleware функц нь try  catch, next(err) алдааны мэдээг автоматаар дамжуулна
  //async болгоно, mongoose-ийн функц маань promise өгдөг байгаа.  //res.send(categories);
  const patients = await Patient.find().populate({
       path: "room", //гэдэг тохиргоон дээр нь category path-тай
       select: "RoomNo Location", //name averagePrice хамт авна гэж зааж өгнө
   }); //api/v1/books - query-ээр дуудна //бүх ном авна
 // console.log(patients)//query ажиллуулаад books массив үүсгэж байна/ Дээрх 2 код аль нэг нь ажиллаад үр дүнд нь books буцаана
  res.status(200).json({
    success: true,
    count: patients.length, //номны тоог гарганаа
    data: patients, //нэгэнт категороо олчвол data-д хэвлэнэ
  });
});
// Заасан өрөөний өвчтөнгийн мэдээлэл авах
exports.getPatient = asyncHandler(async (req, res, next) => {
  //ганц номнуудыг авна
  const patient = await Patient.findById(req.params.id); //query хувьсагч зарлаж байна//ном моделоос find хийнэ//id-ар нь хайна
  //id-аа дамжуулах бол _id тохиргоо хийнэ. Мөн findById(req.params.id)

  if (!patient) {
    //хэрэв ном байхгүй байхын бол
    throw new MyError(req.params.id + " ID-тэй өвчтөн байхгүй байна.", 404); //resource алдаа 404 гэнэ
  } //throw гэхээр доод талын код ажиллахгүй байна. Дээшээ гараад явчихна. Дээшээ явсан кодыг getbook-ийн asyncHandler бариад авна

  res.status(200).json({
    success: true,
    data: patient, //тухайн номоо буцаана
  });
});



//api/v1/categories/:catId/books  //Бүх номын мэдээлэл авна

exports.getRoomPatients = asyncHandler(async (req, res, next) => {
  //asyncHandler аргументаараа (async (req, res, next) функцийг хүлээж авч байна.  //asyncHandler; - middleware/asyncHandler оруулж ирсэн
  //asyncHandler middleware функц нь try  catch, next(err) алдааны мэдээг автоматаар дамжуулна  //async болгоно, mongoose-ийн функц маань promise өгдөг байгаа.
  //res.send(categories);

  const patients = await Patient.find({ room: req.params.roomId });
 // console.log(patients); //query ажиллуулаад books массив үүсгэж байна/ Дээрх 2 код аль нэг нь ажиллаад үр дүнд нь books буцаана
  res.status(200).json({
    success: true,
    count: patients.length, //номны тоог гарганаа
    data: patients, //нэгэнт категороо олчвол data-д хэвлэнэ
  });
});


exports.createRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.create(req.body);

  res.status(200).json({
    success: true,
    data: room,
  });
});


exports.addPatient = asyncHandler(async (req, res, next) => {
  //алдаа гарвал async барьж аваад next-рүү дамжуулна
  const room = await Room.findById(req.body.room); //id-аар нь хайж олоод олдвол category өгнө//books-гэдэг талбарыг дүүргээд өгөөч
  //Postman- дээр оруулахад body.category id-аар хайж олно
  if (!room) {
    //category id байхгүй бол алдааг хэвлэнэ
    throw new MyError(req.body.room + "ID-тэй өрөө байхгүй.", 400); //throw new - JSийн custom error бичих, шинээр юу цацах гэж байгаа. MyError алдааны обьект үүсгэнэ. Message, statuscode үүсгэнэ.
  } //нэгэнт категороо олчвол data-д хэвлэнэ//Category олдохгүй бол ийм категоритай id байхгүй гэнэ. Категорийн ID 3 дамжуулахаар 400 bad request болно

  req.body.createUser = req.userId; //шууд шинэ user нь үүсгээд тэр талбар дээр userId-г бичнэ
  //Category id байх юм бол
  const patient = await Patient.create(req.body); //req-д body дамжуулна. Тэгээд ном үүснэ.

  res.status(200).json({
    success: true,
    data: patient, //тухайн номоо буцаана
  });
});


// Заасан номын мэдээлэл авах
exports.deletePatient = asyncHandler(async (req, res, next) => {
  //ганц номнуудыг авна
  const patient = await Patient.findById(req.params.id); //query хувьсагч зарлаж байна//ном моделоос find хийнэ//id-ар нь хайна
  //id-аа дамжуулах бол _id тохиргоо хийнэ. Мөн findById(req.params.id)

  if (!patient) {
    //хэрэв ном байхгүй байхын бол
    throw new MyError(req.params.id + " ID-тэй өвчтөн байхгүй байна.", 404); //resource алдаа 404 гэнэ
  } //throw гэхээр доод талын код ажиллахгүй байна. Дээшээ гараад явчихна. Дээшээ явсан кодыг getbook-ийн asyncHandler бариад авна

  if (
    patient.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    //req-Ийн Userid- тай тэнцүү байх юм бол засварлаж болно//admin ба зохиогч нь ялгаатай үед
    //алдааг шалгана
    throw new MyError("Та зөвхөн өөрийн өвчтөнийг л засварлах эрхтэй", 403);
  }
  
  const user = await User.findById(req.userId); // userId -аар хэрэглэгчийг хүлээж авна
  patient.remove();

  res.status(200).json({
    success: true,
    data: patient, //тухайн номоо буцаана
    whoDeleted: user.name, //хэрэглэгчийн нэрийг буцаана
  });
});

exports.updatePatient = asyncHandler(async (req, res, next) => {
  //алдааг шалгана
  const patient = await Patient.findById(req.params.id); //req.params.id  - ийм id-тай бичлэгрүү req.body гэдэг json-ийг өөрчилөөд өгөөрэй гэсэн хүсэлт явуулна

  if (!patient) {
    throw new MyError(req.params.id + "ID-тэй өвчтөн байхгүй ээ.", 400);
  }

  if (patient.createUser.toString() !== req.userId && req.userRole !== "admin") {
    //req-Ийн Userid- тай тэнцүү байх юм бол засварлаж болно//admin ба зохиогч нь ялгаатай үед
    //алдааг шалгана
    throw new MyError("Та зөвхөн өөрийн өвчтөнийг л засварлах эрхтэй", 403);
  }

   req.body.updateUser = req.userId; //шууд шинэ user нь үүсгээд тэр талбар дээр userId-г бичнэ

   for(let attr in req.body) {
     //req.bod дотор байгаа attr бүрийг давт гэсэн үг
     patient[attr] = req.body[attr]
   }

   patient.save();
  
   res.status(200).json({
    success: true,
    data: patient, //устгасан category харуулна
  });
});

// PUT: api/v1/books/:id/photo
exports.uploadPatientPhoto = asyncHandler(async (req, res, next) => {
  //req.body.updateUser = req.userId; //шууд шинэ user нь үүсгээд тэр талбар дээр userId-г бичнэ

  //алдааг шалгана
  const patient = await Patient.findById(req.params.id); //req.params.id  - ийм id-тай бичлэгрүү req.body гэдэг json-ийг өөрчилөөд өгөөрэй гэсэн хүсэлт явуулна

  if (!patient) {
    throw new MyError(req.params.id + "ID-тэй өвчтөн байхгүй ээ.", 400);
  }
  // image upload
  console.log(req)
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    throw new MyError("Та зураг upload хийнэ үү.", 400); //image гэж эхэлсэн бол эсвэл үгүй бол алдаа заана
  }
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна.", 400); //image гэж эхэлсэн бол эсвэл үгүй бол алдаа заана
  }
  
  file.name = `Photo_${req.params.id}${path.parse(file.name).ext}`; //хувьсагч зарлаад дотор нь 
  //ext нэрийг /.png/ авна
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    //FILE_UPLOAD_PATH folder-ийн ийм file.name болгож хуул гэж / зөөх явцад алдаа гардаг
    if(err){ //хэрэв алдаа гарвал 
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
         400
         );
    }
    patient.Photo = file.name;  //талбарт нь утга өгөөд save хадгална
    patient.save();

    res.status(200).json({
      success: true,
      data: file.name, //өөрчлөгдсөн байгаа тэр файлынхаа нэрийг дамжуулна
    });
  });
  //саяны оруулж ирсэн хувьсагчинд parse Гэдэг file нэрэн дотроо ямар нэг файлын нэрийг задлаж байгаад 
});