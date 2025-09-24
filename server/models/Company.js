import { Schema, model } from "mongoose";

const companySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String, required: true },
  password: { type: String, required: true },
});

const Company = model("Company", companySchema);

export default Company;
