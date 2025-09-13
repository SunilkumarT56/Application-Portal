import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;

  if (!name || !email || !password || !!imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({ success: false, message: "Company already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company.id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
    });

  } catch (error) {}
};

export const loginCompany = async (req, res) => {};

export const getCompanyData = async (req, res) => {};

export const postJob = (req, res) => {};

export const getCompanyJobApplicants = async (req, res) => {};

export const getCompanyPostedJobs = async (req, res) => {};
export const changeJobApplicationsStatus = async (req, res) => {};

export const changeVisiblity = async (req, res) => {};
