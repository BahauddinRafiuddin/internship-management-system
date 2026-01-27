import mongoose from "mongoose";

const internshipProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: [
      "Web Development",
      "Backend Development",
      "Frontend Development",
      "AI / ML",
      "Data Science",
      "Mobile App Development"
    ],
    required: true
  },
  description: {
    type: String
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  interns: [
    {
      intern: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  durationInWeeks: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "completed", "upcoming"],
    default: "upcoming"
  },
  rules: {
    type: String
  }

}, { timestamps: true })

export default mongoose.model("InternshipProgram", internshipProgramSchema)