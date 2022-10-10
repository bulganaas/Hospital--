const mongoose = require("mongoose"); //mongoose оруулж ирнэ
const { transliterate, slugify } = require("transliteration");//node js байдлаар бичигдэнэ, slugify 

const PatientSchema = new mongoose.Schema(
  {
    // CategorySchema Schema үүсгэнэ, Schema функц дуудна,  Category нь нэртэй байна г.м
    PatientID: {
      type: String,
      required: [true, "Өвчтөний регистрийн дугаарыг оруулна уу"],
      unique: true,
      maxlength: [15, "Дээд тал 15 тэмдэгт байх ёстой."],
    },

    PatientName: {
      type: String, //string төрөлтэй
      required: [true, "Өвчтөний нэрийг оруулна уу"], //Mongoose нь дараах код илгээнэ
      trim: true, //Mongoose нь хоосон тэмдэгтүүдийг автоматаар цэвэрлэнэ
      maxlength: [50, "Дээд тал 50 тэмдэгт байх ёстой."], //нэр нь мах 50 тэмдэгт байна
    },
    PatientLastName: {
      type: String, //string төрөлтэй
      required: [true, "Өвчтөний нэрийг оруулна уу"], //Mongoose нь дараах код илгээнэ
      trim: true, //Mongoose нь хоосон тэмдэгтүүдийг автоматаар цэвэрлэнэ
      maxlength: [50, "Дээд тал 50 тэмдэгт байх ёстой."], //нэр нь мах 50 тэмдэгт байна
    },
    Photo: {
      type: String, //файлын нэр тул String байна
      default: "no-photo.jpg", //зураг илгээхгүй үед default-аар no-photo.jpg зураг байна.
    },
    Problem: {
      type: String, //string төрөлтэй
      trim: true, //Mongoose нь хоосон тэмдэгтүүдийг автоматаар цэвэрлэнэ
      maxlength: [50, "Дээд тал 50 тэмдэгт байх ёстой."], // мах 50 тэмдэгт байна
    },
    PhoneNo: {
      type: Number, //string төрөлтэй
      required: [true, "Утасны дугаарыг оруулна уу"], //Mongoose нь дараах код илгээнэ
      trim: true, //Mongoose нь хоосон тэмдэгтүүдийг автоматаар цэвэрлэнэ
      maxlength: [
        50,
        "Зохиогчийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой.",
      ], //нэр нь мах 50 тэмдэгт байна
    },
    Address: {
      //номнуудын дундаж үнэлгээ хийх
      type: String, //тоо байна
      maxlength: [
        250,
        "Өвчтөний хаягийн урт дээд тал нь 250 тэмдэгт байх ёстой.",
      ], //нэр нь мах 50 тэмдэгт байна
    },
    Age: {
      type: Number,
      required: [true, "Насыг оруулна уу"], //Mongoose нь дараах код илгээнэ
    },
    Gender: {
      type: String,
      required: [true, "Насыг оруулна уу"], //Mongoose нь дараах код илгээнэ
    },
    Bill: {
      type: String,
    },
    //RoomNo: Number,

    room: {
      type: mongoose.Schema.Types.ObjectId, //room-ийн ID-аар холбогдож байна
      ref: "Room", //category-ийн collection-тэй холбогдож байна
      required: true, //заавал шаардлагатай
    },

    createUser: {
      type: mongoose.Schema.ObjectId, //room-ийн ID-аар холбогдож байна
      ref: "User", //category-ийн collection-тэй холбогдож байна
    },
    updateUser: {
      type: mongoose.Schema.ObjectId, //room-ийн ID-аар холбогдож байна
      ref: "User", //category-ийн collection-тэй холбогдож байна
    },

    createdAt: {
      //үүсгэгдсэн огноог бүртгэнэ.
      type: Date, // төрөл нь Date байна
      default: Date.now, //юу ч дамжуулаагүй үед default-аар одоогийн серверийн он сар өдөр оруулна
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } } //Virtual талбарыг {toJson}:{virtuals: true} рүү гэж тохируулна
);

PatientSchema.virtual('Ovog').get(function(){ //call back function- дотор нь юу байхыг зааж өгнө
   //this.author //massive байдлаар нэрийг зайтай, цэгээр хуваана.
   let tokens = this.PatientLastName.split(" "); //tokens дотор исаак ньютен 2 үг байна. Хооронд нь зай гаргаж өгнө
   if (tokens.length === 1) tokens = this.PatientLastName.split(".");//нэр нь 2 хуваагдсан эсэхийг tokens-ын уртаар нь шалгана. цэгээр хуваагаад token- д орж ирнэ 
   if (tokens.length === 2) return tokens[1]; //tokens-Ийн 1-р элементийг буцаана
   
   return tokens[0]; //үгүй бол анхныхаар буцаана
  });//bookschema дотор zohioghch virtual үүсгэж байна. 
module.exports = mongoose.model("Patient", PatientSchema); // CategorySchema export хийнэ
