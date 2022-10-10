const Room = require("../models/Room"); //models доторх Category-н Category оруулж ирнэ. 
const MyError = require("../utils/myError"); //myError оруулж ирнэ
const asyncHandler = require("express-async-handler"); //express npm-ээс авсан

exports.getRooms = asyncHandler(async (req, res, next) => {
  //asyncHandler аргументаараа (async (req, res, next) функцийг хүлээж авч байна.
  //asyncHandler; - middleware/asyncHandler оруулж ирсэн
  //asyncHandler middleware функц нь try  catch, next(err) алдааны мэдээг автоматаар дамжуулна
  //async болгоно, mongoose-ийн функц маань promise өгдөг байгаа.
  const page = parseInt(req.query.page) || 1; //If page-г default-аар дамжуулаад байвал 1 гэсэн page үзнэ //req.query page авлаа//Parseint тооруу хөрвүүлэх JS функц
  const limit = parseInt(req.query.limit) || 100; //req.query лимит авлаа//хэрвээ Limit утга байвал Limit дамжуулна. Байхгүй бол 100 defaultaaр болно
  const sort = req.query.sort; //req.query sortлоно
  const select = req.query.select; //query дотор json обьектийг авна //авах ёстой 4 юмаа аваад дараа нь устгаж байна

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]); //dynamic-аар тул массиваар[el] бичнэ //massive дээр foreach хийгээд el болгоны хувьд delete
  //query обьект дотор устана
  //Pagination

  const total = await Room.countDocuments(); //Нийт category дотор хэдэн юм байгааг тоолно
  const pageCount = Math.ceil(total / limit); //бутархай тоо тул бүхэлчлэх тааз өгнө
  const start = (page - 1) * limit + 1; //эхлэл
  let end = start + limit - 1; //сүүл
  if (end > total) end = total; // хэрэв end нь total-аас их байх юм бол end нь total тэнцүү байна.

  const pagination = { total, pageCount, start, end, limit };

  if (page < pageCount) pagination.nextPage = page + 1; //дараачийн болон өмнөх обьектийг агуулдаг // page-ний тоо нь page-ээс их байх юм бол pagination обьект дээрээ дотор нь Next дараагийн хуудас Нэмж өгнө. Хуудсыг нэгээр нэмэгдүүлнэ
  if (page > 1) pagination.prevPage = page - 1; //хэрвээ page нь 1-ээс эрс их байх юм бол prevPage нь Page - 1 байна

  console.log(req.query, sort, select); //req- обьектийн query дотор ороод ирдэг//express маань орж ирдэг
  //ямар нэг алдаа гарвал шалгана.

  const rooms = await Room.find(req.query, select)
    .sort(sort)
    .skip(start - 1) //алгасана
    .limit(limit); //sort, select, query хийсэн //req.query-дагуу query уншина//Бүх категорио mongoose-ийн категорийн find гэдэг функцийг ашиглаад дууддаг, олж авна: Тэр функц маань хүлээх ёстой, Category моделийн find гэдэг функцыг дуудахнээ.

  //res.send(categories);
  res.status(200).json({
    success: true,
    data: rooms, //нэгэнт категороо олчвол data-д хэвлэнэ
    pagination, //pagination-г гаргана
  });
});

exports.getRoom = asyncHandler(async (req, res, next) => {
  //async болгоод // asynchandler дуудаад category id байхгүй бол MyError цацаад мессеж илгээнэ

  //алдааг шалгана
  const room = await Room.findById(req.params.id).populate('patients'); //id-аар нь хайж олоод олдвол category өгнө//books-гэдэг талбарыг дүүргээд өгөөч
  
  if (!room) {
    //Хэрвээ category байхгүй тохиолдолд дуусгана. Үүний тулд return хийнэ
    throw new MyError(req.params.id + "ID-тэй өрөө байхгүй.", 400); //throw new - JSийн custom error бичих, шинээр юу цацах гэж байгаа. MyError алдааны обьект үүсгэнэ. Message, statuscode үүсгэнэ.
  } //нэгэнт категороо олчвол data-д хэвлэнэ

  //category дуудах болгонд rest api цаанаас нь дуудна
  //category.name += "-"; //category-ийн нэр оруулсан
 // category.save(function (err) {//category function-г дуудна//callback function save хийгээд байх нь
 //   if(err) console.log('error : ', err); //хэрэв алдаа гарвал алдааг мэдээлнэ
  //  console.log('saved...'); //алдаа гарахгүй бол энэ мэдээлэл гарна 
  //}); 

  res.status(200).json({
    success: true,
    data: room, //Олдсон category харуулна
  });
});

exports.createRoom = asyncHandler(async(req, res, next) => {
  console.log("data:", req.body); //postmanaas json data req авна

  //хэрвээ алдаа үүсэх бол //async, await хэрэглэж байгаа үед заавал try/catch хйиж өгөх ёстой байдаг 
 const room = await Room.create(req.body); //Category дотор json-г үүсгэнэ, promsfunction // амжилттай ажиллах юм бол үүссэн мэдээг буцаана
   //Алдаа гарахгүй бол доорх код ажиллана 
 res.status(200).json({
  //Category дотор json-г үүсгэх promise ажиллаж дуусаад database- category - д орно.
   success: true,
   data: room, //Үүссэн category датаг буцаана
 });
 

 //try {
  //const newCategory = new Category({
   //   name: req.body.name,
   //  description: req.body.description,
  //});
 //  const savedCategory = await newCategory.save();
 // if (savedCategory) {
  //   res.status(200).json({
    //   success: true,
    //   data: "Шинээр категори үүсгэх",
   //  });
  //  }
 // } catch (error) {
    //console.log(error);
 //}
});

exports.updateRoom = asyncHandler(async (req, res, next) => {
  //алдааг шалгана
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //шинээр үүссэнийг харуулна, авна гэсэн тохиргоо хийж өгнө
    runValidators: true, //model дээр шалгаад байсан тэр шалгалтыг шалгаарай гэж зааж өгч байна //ж: 50 тэмдэгтээс ихгүй гэх мэт
  }); //req.params.id  - ийм id-тай бичлэгрүү req.body гэдэг json-ийг өөрчилөөд өгөөрэй гэсэн хүсэлт явуулна
  if (!room) {
    throw new MyError(req.params.id + "ID-тэй өрөө байхгүй ээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: room, // өрөө харуулна
  });
});


exports.deleteRoom = asyncHandler(async (req, res, next) => { //async function
   
     //алдааг шалгана
     const room = await Room.findById(req.params.id); //ID -аар нь олоод//findByIdAndDelete - функц нь id-аар нь хайж олоод category устгана
         if (!room){
           throw new MyError(
             req.params.id + "ID-тэй өрөө байхгүй ээ.",
             400
           );
      
    } 
    room.remove(); //дараа нь устгах

        res.status(200).json({
        success: true,
        data: room, //устгасан category харуулна
      });
  
});
