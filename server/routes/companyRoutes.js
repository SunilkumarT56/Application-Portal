import express from "express";
import {
  changeVisiblity,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
  changeJobApplicationsStatus,
  changeVisiblity,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/resiter",upload.single('image') , registerCompany);
router.post("login", loginCompany);
router.get("/company", getCompanyData);
router.post("/post-job", postJob);
router.get("/applicants", getCompanyJobApplicants);
router.get("/list-jobs", getCompanyPostedJobs);
router.post("/change-status", changeJobApplicationsStatus);
router.post("/change-visibility", changeVisiblity);

export default router;
