import {Schema , model, Types}from "mongoose";

const jobApplicationSchema = new Schema({
    userId : {
        type: String,
        ref: "User",
        required: true
    },
    companyId : {
        type:Types.ObjectId,
        ref: "Company",
        required: true
    },
    jobId:{
        type: Types.ObjectId,
        ref: "Job",
        required: true
    
    },
    status:{
        type: String,
        default: "pending"
    
    },
    date:{
        type: Number,
        required: true
    
    }



})

const JobApplication = model("JobApplication" , jobApplicationSchema);

export default JobApplication;