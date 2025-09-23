import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";



export const getUserData = async (req, res) => {
    const userId = req.auth.userId;
    try{
        const user = await User.findById(userId);

        if(!user){
            return res.json({
                success: false,
                message: "user not found"
            })
        }
        res.json({
            success: true,
            user
        })

    }catch (error) {
        res.json({
            success: false,
            message: "something went wrong"
        })


}
}

export const applyForJob = async (req, res) => {
    const {jobId} = req.body;

    const userId = req.auth.userId;

    try{
        const isAlreadyApplied = await JobApplication.find({
            userId,
            jobId
        })

        if(isAlreadyApplied.length > 0){
            return res.json({
                success: false,
                message: "already applied"
            })



        }
        const jobData = await Job.findById(jobId);
        if(!jobData){
            return res.json({
                success: false,
                message: "job not found"
            })
        }
        await JobApplication.create({
            userId,
            companyId: jobData.companyId,
            jobId,
            date: Date.now()
        });
        res.json({
            success: true,
            message: "applied successfully"
        })

        




}catch (error){
    res.json({
        success: false,
        message: "something went wrong"
    })

}
}

export const getUserJobApplications = async (req, res) => {
    try{
        const userId = req.auth.userId;
        const applications = await JobApplication.find({
            userId
        }).populate('companyId','name email  image').populate('jobId' , 'title description location salary level category').exec()

        if(!applications){
            return res.json({
                success: false,
                message: "no applications found"
            })
        }
        return res.json({
            success: true,
            applications
        })

    }catch(error){
        res.json({
            success: false,
            message: "something went wrong"
        })
    }
}

export const updateUserResume = async (req, res) => {

    try{
        const userId = req.auth.userId;
        const resumeFile = req.file;
        const user = await User.findById(userId);

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            user.resume = resumeUpload.secure_url;
          

        }
        await user.save();

        return res.json({
            success: true,
            message: "resume uploaded successfully"
        })




    }catch(error){
        res.json({
            success: false,
            message: "something went wrong"
        })

    }

}
