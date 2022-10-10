const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const connectDB = require("./config/db");
const cors = require("cors");
//const cookieParser = require("cookie-parser")
//const helmet = require("helmet")
var bodyParser = require("body-parser"); //body-parser req.body-той холбогдоно 
const colors = require('colors'); //colors дуудаж оруулна
const errorHandler = require("./middleware/error");//аппруугаа оруулж ирнэ
var morgan = require("morgan");  
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload"); //photo оруулж ирэх fileupload оруулж ирнэ
const roomsRoutes = require("./routes/rooms");// Router-ээс оруулж ирэх
const patientsRoutes = require("./routes/patients");// Router-ээс оруулж ирэх
//express app үүсэж байна. Хамгийн дээр нь тавина
const usersRoutes = require("./routes/users"); //хэрэглэгчийн route оруулж ирнэ

// Аппын тохиргоог process.env рүү ачаалах


dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.static("public"));

connectDB();

// create a write stream (in append mode)
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
/*
var whitelist = ["http://localhost:8000"]; //зөвхөн http://localhost:8000 порт дээр нээж өгнө.
var corsOptions = {
  origin: function (origin, callback) {
      console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      //bolnoo
      callback(null, true);
    } else {
          callback(new Error("Хориглож байна")); //бусад портод хориглоно
    }
  },
};
*/
// Body parser //middleware

app.use(bodyParser.urlencoded({extended: true,}));
app.use(bodyParser.json());
//app.use(cookieParser());
//app.use(helmet())
app.use(express.json()); //req обьектээр орж ирсэн мессеж болгоны body хэсгийг шалгаад, хэрвээ json өгөгдөл байх юм бол req.body гээд хувьсагч дотор хийж өгнө гэсэн үг. Категори өөрчлөгдсөн мэдээллийг авч байгаа
app.use(cors()); //cors Middleware байна//corsOptions
app.use(fileupload());//fileupload гээд зарлана
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/rooms", roomsRoutes);//Учир нь next middleware нь дараагийн error middleware уншина
app.use("/api/v1/patients", patientsRoutes); ///api/v1/books гэсэн эхлэлтэй бүх апи дуудалттай өгөгдлүүдийг booksRoutes-т холбоно
app.use("/api/v1/users", usersRoutes); /////api/v1/users гэсэн эхлэлтэй бүх апи дуудалттай өгөгдлүүдийг usersRoutes-т холбоно
app.use(errorHandler); //error middleware errorHandler import хийснээ холбож өгнө. хамгийн доор бичнэ. 

const server = app.listen(  //алдааг барьж авах тулд server үүсгэнэ
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  //unhandledRejection - event handler//Err, promise - argument ажиллуулна
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);//улаан болгох
  server.close(() => {
    //cерверээ зогсооно
    process.exit(1); //process нь хийгдээд дуусна. 
  });
});
