const fs = require("fs");//file system ажиллана
const mongoose = require('mongoose'); //mongoose library хэрэгтэй 
const colors = require('colors');  //colors хэрэглэнэ
const dotenv = require('dotenv'); //database-руу холбогдоно. config-тэй ажиллах dotenv file оруулж ирнэ
const Room = require("./models/Room");//Model-ээ оруулж ирнэ
const Patient = require("./models/Patient"); 
const User = require("./models/User"); 

dotenv.config({path: "./config/config.env"});//config функц дуудаж өгнө

 mongoose.connect(process.env.MONGODB_URI, {//database-тэй холбогдох 
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   useUnifiedTopology: true,
 });

 const rooms = JSON.parse( // data folder доторх JSON өгөгдлийг load хийэж
   fs.readFileSync(__dirname + "/data/rooms.json", "utf-8")// энэ файлын ямар зам дээр оршин байх вэ гэдэг дээр data/categories.js уншина. Мөн яиар тэмдэгтүүд байгаа вэ гэж оруулна. Энэ бол string гарч ирнэ. 
  // string хувиргах хэрэгтэй. Үүний тулд JSON-ийн parse гэдэг функцийг ашиглана. Category маань массив  болно. Массив дотор 3 json обьект явж байгаа. 
 );
 
 const patients = JSON.parse(
   // data folder доторх JSON өгөгдлийг load хийэж
   fs.readFileSync(__dirname + "/data/patient.json", "utf-8") // энэ файлын ямар зам дээр оршин байх вэ гэдэг дээр data/categories.js уншина. Мөн яиар тэмдэгтүүд байгаа вэ гэж оруулна. Энэ бол string гарч ирнэ.
   // string хувиргах хэрэгтэй. Үүний тулд JSON-ийн parse гэдэг функцийг ашиглана. Category маань массив  болно. Массив дотор 3 json обьект явж байгаа.
 );

  const users = JSON.parse(
    // data folder доторх JSON өгөгдлийг load хийэж
    fs.readFileSync(__dirname + "/data/user.json", "utf-8") // энэ файлын ямар зам дээр оршин байх вэ гэдэг дээр data/categories.js уншина. Мөн яиар тэмдэгтүүд байгаа вэ гэж оруулна. Энэ бол string гарч ирнэ.
    // string хувиргах хэрэгтэй. Үүний тулд JSON-ийн parse гэдэг функцийг ашиглана. Category маань массив  болно. Массив дотор 3 json обьект явж байгаа.
  );
//Үүссэн бүх категоруудаа MONGO DB дээрээ шидэж өгнө. 
 const importData = async () => {
   //import data хийдэг функц бичье//promise буцаадаг тул async болгоно
   try {
     //import хийхэд алдаа гарч магадгүй
     //async функц болгоод await хүлээе
     await Room.create(rooms); //Category Model дээрээ create гэдэг функц бичнэ. Уншсан бүх категорийг create Хийнэ
     await Patient.create(patients);
     await User.create(users);
     console.log('Өгөгдлийг импортлолоо...'.green.inverse); //өгөгдлийг импортлолоо гэдэг importлох үед console дээр гарна. Inverse нь нүдэнд ил тод харагдана
   } catch (err) {
     console.log(err); //алдаагаа хэвлэнэ
   }
 };
//Устгах async функц байна //Датагаа устгаж цэвэрлэх 
 const deleteData = async () => {
    try {
      await Room.deleteMany(); //Категори моделийг ашиглаад бүх катигорийг устгана
      await Patient.deleteMany();
      await User.deleteMany();
      console.log("Өгөгдлийг бүгдийг устгалаа...".red.inverse);//Мөн устгасаныхаа дараа console дээр хэвлэнэ. 
    } catch (err) {
      //json file бичихээр алдаа гарна
      console.log(err); //алдаа гарвал хэвлэнэ.red.inverse
    }
 };
 if (process.argv[2] == '-i') { //i- байх юм бол import хийчэе //ажиллаж байгаа script болгон дээр node js-ийн автоматаар үүсдэг аргумент гэдэг тусгай хувьсагч байдаг. Энэ ARG-v Хувьсагч нь script-д дамжуулсан бүх параметрүүдийг массив хэлбэрээр авдаг. 
    importData();  //энэ үед импорт датагаа дуудна
  
 } else if (process.argv[2] == "-d") {
   //харин үгүй бол d байх юм бол deleteMany дуудна
   deleteData(); //deletedata async функц дуудна
 }//process аргумент байдаг 
