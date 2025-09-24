import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.json({
      success: false,
      message: "not authorized , login again",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id).select("-password");


    req.company = company;
    next();
  } catch (error) {
    res.json({
      sucess: false,
      message: "something went wrong",
    });
  }
};
