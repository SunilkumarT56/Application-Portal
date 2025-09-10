import mongoose from "mongoose";

const connedtDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB is connected successfully");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
};
export default connedtDB;
