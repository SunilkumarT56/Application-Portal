import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  salary: { type: Number, required: true },
  date: { type: Number, required: true },
  visible: { type: Boolean, default: true },
  companyId: {
    type: Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const Job = model("Job", jobSchema);

export default Job;
