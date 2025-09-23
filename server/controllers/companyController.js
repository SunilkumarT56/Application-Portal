import Company from "../models/Company.js";
import Job from "../models/Job.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import JobApplication from "../models/jobApplication.js";

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({ success: false, message: "Company already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //cloud based application¸
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
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({
      success: false,
      message: "missing details",
    });
  }
};

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id),
      });
    } else {
      res.json({
        success: false,
        message: "invalid email and password",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Provide a valid credentials",
    });
  }
};

export const getCompanyData = async (req, res) => {
  try {
    const companydetails = req.company;
    console.log(companydetails);
    res.json({
      success: true,
      companydetails,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;

  const companyId = req.company._id;
  console.log(companyId, {
    title,
    description,
    location,
    salary,
    companyId,
  });

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      companyId,
      level,
      category,
      date: Date.now(),
    });
    res.json({
      success: true,
      newJob,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const getCompanyJobApplicants = async (req, res) => {
  const companyId = req.company._id;
  try {
    const applications = await JobApplication.find({
      companyId,
    })
      .populate("userId", "name resume image")
      .populate("jobId", "title location category level salary")
      .exec();

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    // Adding no of applicants info in data
    TODO: res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};
export const changeJobApplicationsStatus = async (req, res) => {
  const { id, status } = req.body;
  try { 
    const application = await JobApplication.findById({ _id :id},{status});
    console.log(id);
    application.status = status;
    await application.save();
    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

export const changeVisiblity = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;
    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
};
