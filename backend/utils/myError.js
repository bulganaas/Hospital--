class MyError extends Error {
  //MyError гэсэн JS-ийн класс зарлая, уламжлалт Error гэсэн JS-ийн классаас удамшина. Error class-с бүгдийг нь удамшуулна
   constructor(message, statusCode) {
     //байгуулагч функцруу алдааны мессежийг дамжуулна//frontend, client талруугаа илгээх HTTP мессежний алдааны дугаарыг дамжуулдаг
     super(message); //эх классын байгуулагч функцийг дуудна
     this.statusCode = statusCode; //http-ийн statusCode //атрибуттай байх нь
   }
}

module.exports = MyError; //export хийе