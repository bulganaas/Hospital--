
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); //argument-ээрээ ямар нэгэн функц хүлээж авна. Функцийг fn гэж нэрлэе/юу гэж ч нэрлэж болно/. fn функц маань цаанаа 3 аргумент авдаг /res, req, next/
//энэ 3 аргумент getcategory, controller-ийн функцууд/asynchrone функцууд/ маань бүгд promise буцааж байгаа
 //promise - н resolve функцыг дуудаж ажиллуулна. Ажиллуулахдаа fn функцээ 3 аргументтэй нь дуудна. / Promise нь Resolve хийгээд/ Дуудагдах үед fn-ээс exception шидэгдэх юм бол өмнөөс нь catch нь next-рүү дамжуулна. Exception-ээ next-рүү дамжуулна. Promise дэлгэрээнгүй ойлгохыг хүсвэл JS хичээл үзээрэй 

module.exports = asyncHandler; //функцээ экспортолно

