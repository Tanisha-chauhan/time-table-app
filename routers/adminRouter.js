import express from "express";
import { handleAdminSignup, handleAdminLogin, addLectures, getAllTeachers, getLecturesByTeacher, getPendingAdjustments, resolveAdjustment
   } from 
"../controllers/Admincontroller.js";


const router= express.Router();

router.post("/signup",handleAdminSignup);
router.post("/login",handleAdminLogin);
router.post("/add-lectures", addLectures);
router.get("/teachers", getAllTeachers);
router.get("/lectures/:id", getLecturesByTeacher);
router.get("/adjustments", getPendingAdjustments);
router.patch("/adjustments/:id/resolve", resolveAdjustment);




export default router;
