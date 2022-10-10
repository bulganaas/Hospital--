const mongoose = require ('mongoose');
const bcrypt = require("bcrypt"); //bcrypt оруулна
const crypto = require("crypto"); //санамсаргүй тоо оруулах//node js-ээс оруулна
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  //Schema үүсгэнэ
  name: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг оруулна уу"],
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн имэйл хаягийг оруулж өгнө үү"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Имэйл хаяг буруу байна.",
    ], //email хаяг нь зөв байх юм бол  //javascript email-validation шалгана
  },
  role: {
    type: String,
    required: [true, "Хэрэглэгчийн эрхийг оруулна уу"],
    enum: ["patient", "doctor", "admin"],
    default: "patient", //сонгогдоогүй бол patient байна
  },
  password: {
    type: String,
    minlength: 4, //Хамгийн багадаа 4 тэмдэгт байна
    required: [true, "Нууц үгээ оруулна уу"],
    select: false, //хэрэглэгчийн нууц үгийг client талруу явуулахгүй
  },
  resetPasswordToken: String, //нууц үгээ солиход resetPasswordToken үүснэ
  resetPasswordExpire: Date, //тодорхой хугацаанд хүчинтэй байдаг
  createdAt: {
    type: Date,
    default: Date.now, //хэзээ хадгалсан
  },
});

//bcrypt
UserSchema.pre('save', async function(next){
  //Нууц үг өөрчлөгдөөгүй бол дараачийн middleware-рүү шилжинэ.
  if(!this.isModified('password')) next()//ямар нэгийн моделийн талбар нь өөрчлөгдөж үү. 
  //хэрвээ ямар нэгэн password талбарт өөрчлөгдөөгүй байх юм бол шууд дараагийн middleware-луу шилжинэ
 //Нууц үг өөрчлөгдсөн 
  console.time("salt");
 const salt = await bcrypt.genSalt(10);
 console.timeEnd("salt");

 console.time("hash");
 this.password = await bcrypt.hash(this.password, salt);
 console.timeEnd("hash");
}); //password үүсэх бүрт өөр өөр bc  rypt үүснэ

UserSchema.methods.getJsonWebToken = function() {
  const token = jwt.sign(
    { id: this._id, role: this.role },  //role-г токеноос авах боломжтой болно
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN, //хугацаа нь дуусна
  }); //хэрэглэгчийн id-г id дотор хадгална
  return token;
};//getJsonWebToken гэдэг функц// JWT_SECRET болгоно

//return
UserSchema.methods.checkPassword = async function(enteredPassword) {
  //хэрэглэгч нууц үгээ дамжуулахад шалгана
  return await bcrypt.compare(enteredPassword, this.password); //буцаана
}
UserSchema.methods.generatePasswordChangeToken = function () {
  //нууц үгийг сольдог токенийг үүсгэнэ.
  //хэрэглэгч нууц үгээ дамжуулахад шалгана
  const resetToken = crypto.randomBytes(20).toString("hex"); //16-ийн string 100-тийн тооллын систем// crypto дээр randomBytes гэдэг функцийг дуудаж 20 ш байтыг дуудаж өгнө.
  //buffer үүсгэж өгнө //binary өгөгдөл гэсэн үг. /pdf, зураг/
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); //Нууц үг сэргээх токенийг хэшлэн хадгалах

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;//1000 millsecond, 60 second, 10 minute-д харуулна. 
  console.log(resetToken);

  return resetToken; //буцаана
};

module.exports = mongoose.model("User", UserSchema);  //User гэдэг модель үүсгээд UserSchema үүсгэнэ