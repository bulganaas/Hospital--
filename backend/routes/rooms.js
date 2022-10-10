const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect"); //категорийг хамгаалахын тулд middleware-г оруулж ирнэ

const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,

} = require("../controller/rooms");
//"/api/v1/categories/:id/books
const {getRoomPatients} = require("../controller/patients"); //controller-ийн book getBooks функцийг require хийж оруулж ирнэ
router.route("/:roomId/patients").get(getRoomPatients); //get method-оор орж ирвэл getBooks-ээ холбоно///Бүх номыг категороор нь ялгана
//const patientsRouter = require("./patients");//номтой ажилладаг router байна  router-ын books-ээс booksRouter оруулж ирнэ
//router.use("/:roomId/patients", patientsRouter); //patientsRouter Ашиглан /:roomId/patients -г 

//"/api/v1/rooms"
router
  .route("/room")
  .get(getRooms)
  .post(protect, authorize("admin"), createRoom);

router
  .route("/:id")
  .get(getRoom)
  .put(protect, authorize("admin", "doctor"), updateRoom)
  .delete(protect, authorize("admin"), deleteRoom)
  
module.exports = router;
