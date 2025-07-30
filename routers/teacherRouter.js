import express from "express";
import { handleTeacherSignup, handleTeacherLogin,  getLoggedInTeacher, handleLeaveRequest } from "../controllers/Teachercontroller.js";

const router= express.Router();

router.post("/signup",handleTeacherSignup);
router.post("/login",handleTeacherLogin);
router.get("/profile", getLoggedInTeacher);
router.post("/leave", handleLeaveRequest);

export default router;

