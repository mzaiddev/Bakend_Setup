import mongoose from "mongoose";
const QuizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  questionImage: {
    type: String,
  },
  options: {
    type: [String],
    required: true,
    // validate: [arrayLimit, "{PATH} must have exactly 4 items"],
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    required: true,
  },
  explanationImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}

export const Quiz = mongoose.model("Quiz", QuizSchema);
