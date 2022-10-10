const express = require("express");
const {protect, authorize} = require('../middleware/protect');
const {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  //функц
} = require("../controller/users"); //controller-ээс номоо авна


const {
  getUserPatients,
  //функц
} = require("../controller/patients"); 

const { deleteMany } = require("../models/User");

const router = express.Router(); //getBooks Номныхоо router-г үүсгэхдээ mergeParams: true болгоно
//бүх параметруудыг merge хийхэд хүлээгээд авна//{mergeParams: true}
//console.log("user router on");

//"/api/v1/user" 
router.route("/register").post(register); //файлын дарааллын дагуу register эхлээд уншина дараа нь бусад route ажиллана
router.route("/login").post(login); //логин дээр post хийх үед route-рүү очно
router.route("/forgot-password").post(forgotPassword); //forgot-password гэвэл forgot-password дуудна. 
router.route("/reset-password").post(resetPassword);

router.use(protect); //protect бүгд дээр нь хийнэ 

//"/api/v1/user" //өмнө нь холбоно
router.route("/")
.get(authorize("admin"), getUsers)
.post(authorize("admin"), createUser); //энэ route нь "/api/v1/books дараах route юм

router
  .route("/:id")
  .get(authorize("admin", "doctor"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

router
.route("/:id/patients")
.get(authorize("admin", "doctor", "patient"), getUserPatients);


module.exports = router;
