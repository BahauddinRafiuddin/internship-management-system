import { isValidObjectId } from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";
import InternshipProgram from "../models/InternshipProgram.js";


// Get Intern Task
export const getMyTask = async (req, res) => {
  try {
    const internId = req.user.id;

    if (req.user.role !== "intern") {
      return res.status(403).json({
        success: false,
        message: "Only interns can access tasks"
      });
    }

    const intern = await User.findById(internId);

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found"
      });
    }

    if (!intern.isActive) {
      return res.status(403).json({
        success: false,
        message: "Intern is not activated yet"
      });
    }

    // 🔐 find programs where intern is enrolled
    const programs = await InternshipProgram.find({
      "interns.intern": internId
    }).select("_id");

    const programIds = programs.map(p => p._id);

    const tasks = await Task.find({
      assignedIntern: internId,
      program: { $in: programIds }
    })
      .populate("program", "title domain")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    if (!tasks.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks assigned yet"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks"
    });
  }
};

export const getMyProgram = async (req, res) => {
  try {
    const internId = req.user?.id
    if (req.user.role !== "intern") {
      return res.status(403).json({
        success: false,
        message: "Only interns can access Their program"
      });
    }

    const intern = await User.findById(internId);

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found"
      });
    }

    if (!intern.isActive) {
      return res.status(403).json({
        success: false,
        message: "Intern is not activated yet"
      });
    }

    const program = await InternshipProgram.find({ "interns.intern": internId }).populate("mentor", "name email")
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "You Are Not Enrolled In Any Program"
      });
    }

    return res.status(200).json({ success: true, message: "Program Found Successfully", program })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while Fetching Intern Program"
    });
  }
}

// Submit Task
export const submitTask = async (req, res) => {
  try {
    const internId = req.user.id;
    const { taskId } = req.params;
    const { submissionText, submissionLink, submissionFile } = req.body;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id"
      });
    }

    if (!submissionText && !submissionLink && !submissionFile) {
      return res.status(400).json({
        success: false,
        message: "At least one submission field is required"
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 🔐 ownership check
    if (task.assignedIntern.toString() !== internId) {
      return res.status(403).json({
        success: false,
        message: "Task not assigned to this intern"
      });
    }

    // 🔐 program enrollment check
    const program = await InternshipProgram.findOne({
      _id: task.program,
      "interns.intern": internId
    });

    if (!program) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this program"
      });
    }

    if (program.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Program already completed"
      });
    }

    if (task.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Task already submitted"
      });
    }

    // Late submission
    if (new Date() > task.deadline) {
      task.isLate = true;
    }

    task.submissionText = submissionText;
    task.submissionLink = submissionLink;
    task.submissionFile = submissionFile;
    task.submittedAt = new Date();
    task.attempts += 1;
    task.status = "submitted";
    task.reviewStatus = "pending";
    task.score = undefined;          // ✅ REQUIRED
    task.feedback = undefined;       // ✅ REQUIRED
    task.reviewedAt = null;          // ✅ REQUIRED

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task submitted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while submitting task"
    });
  }
};
