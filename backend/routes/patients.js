const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const {
  getPatients,
  getPatient,
  addPatient,
  deletePatient,
  updatePatient,
  uploadPatientPhoto,
} = require("../controller/patients"); //controller-ээс номоо авна

const router = express.Router(); //getBooks Номныхоо router-г үүсгэхдээ mergeParams: true болгоно
//бүх параметруудыг merge хийхэд хүлээгээд авна//{mergeParams: true}

//console.log("category router on");
//"/api/v1/books" //өмнө нь холбоно
router.route("/patient").get(getPatients).post(protect, authorize("admin", "doctor"), addPatient);  //энэ route нь "/api/v1/books дараах route юм
//getbooks, createBook функц дуудна - post нэмнэ гэсэн үг
router
  .route("/:id")
  .get(getPatient)
  .delete(protect, authorize("admin", "doctor"), deletePatient)
  .put(protect, authorize("admin", "doctor"), updatePatient); //id-аар дуудаж номоо олно

  router.route("/:id/upload-photo").put(uploadPatientPhoto); //uploadPatientPhoto-put хийнэ

  module.exports = router;
