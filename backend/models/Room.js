const mongoose = require("mongoose"); //mongoose оруулж ирнэ
const { transliterate, slugify } = require("transliteration");//node js байдлаар бичигдэнэ, slugify 

const RoomSchema = new mongoose.Schema(
  {
    // CategorySchema Schema үүсгэнэ, Schema функц дуудна,  Category нь нэртэй байна г.м
    RoomNo: {
      type: Number, //string төрөлтэй
      required: [true, "Өрөөний дугаарыг оруулна уу"], //Mongoose нь дараах код илгээнэ
      unique: true, //давхардаж болохгүй
      trim: true, //Mongoose нь хоосон тэмдэгтүүдийг автоматаар цэвэрлэнэ
      maxlength: [5, "Дээд тал 5 тэмдэгт байх ёстой."], //нэр нь мах 50 тэмдэгт байна
    },
    slug: String, //slug-руу уран зохиол хэлбэрлүү хадгалдаг
    Location: {
      type: String,
      required: [true, "Байршилыг заавал оруулах ёстой."], //заавал оруулах шаардлагатай
      maxlength: [
        20,
        "Категорийн тайлбарын урт дээд тал нь 20 тэмдэгт байх ёстой.", //дээд тал нь 500 тэмдэгт байх ёстой
      ],
    },
    photo: {
      type: String, //файлын нэр тул String байна
      default: "no-photo.jpg", //зураг илгээхгүй үед default-аар no-photo.jpg зураг байна.
    },
    
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
); //json, objectрүү virtual хөрвүүлэхэд true болно

RoomSchema.virtual('patients', { //virtual талбар маань books гэдэг нэртэй байдаг. 
  ref: 'Patient',//book modelтэй холбогдоно
  localField:'_id',//category id
  foreignField: 'room',//models-book -ийн category талбарлуу ханадана
  justOne: false, //ганц өгөгдөл авна, олон өгөгдөл байвал бүгдээрэнг нь авна
});

RoomSchema.pre("remove", async function (next) { //устгана//async function - next дараа нь дуудна
  console.log("removing ....");
  await this.model('Patient').deleteMany({room: this._id}); //үүнийг хүлээнэ//category-ын id-аар нь устгана //номны мэдээлэлийг deletemany гээд устгана
  next();
});

RoomSchema.pre("save", function (next) {
  //CategorySchema ажиллуулахын тулд save үйлдэл хийнэ. Хадгалах буюу шинээр категори үүсгэнэ
 // console.log("pre...."); //middleware харуулах тулд хэвлээд харуулна
  //name хөрвүүлэх
  //console.log(this.name); //save хийж байгаа обьектийн name гэсэн үг 
  this.slug = slugify(this.PatientLastName); //name-г латин болгоод дундуур зураас нэмнэ
 
  next();
});

module.exports = mongoose.model("Room", RoomSchema); // CategorySchema export хийнэ


