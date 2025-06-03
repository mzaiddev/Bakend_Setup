import { Quiz } from "../models/Quiz.modal.js";
import { uploadOnCloudinary } from "../utils/Cloudnary.js";
import fs from "fs";

export const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation } = req.body;

    // Parse options if it's a string (from form-data)
    const optionsArray =
      typeof options === "string" ? JSON.parse(options) : options;

    // Upload files to Cloudinary if they exist
    let questionImageUrl = null;
    let explanationImageUrl = null;

    if (req.files?.questionImage) {
      const questionImagePath = req.files.questionImage[0].path;
      const cloudinaryResponse = await uploadOnCloudinary(questionImagePath);
      questionImageUrl = cloudinaryResponse?.url || null;
    }

    if (req.files?.explanationImage) {
      const explanationImagePath = req.files.explanationImage[0].path;
      const cloudinaryResponse = await uploadOnCloudinary(explanationImagePath);
      explanationImageUrl = cloudinaryResponse?.url || null;
    }

    const quiz = new Quiz({
      question,
      options: optionsArray,
      correctAnswer: parseInt(correctAnswer),
      explanation,
      questionImage: questionImageUrl,
      explanationImage: explanationImageUrl,
    });

    const savedQuiz = await quiz.save();

    res.status(201).json({
      success: true,
      data: savedQuiz,
    });
  } catch (err) {
    console.error(err);

    // Clean up uploaded files if there was an error
    if (req.files) {
      if (req.files.questionImage) {
        fs.unlink(req.files.questionImage[0].path, () => {});
      }
      if (req.files.explanationImage) {
        fs.unlink(req.files.explanationImage[0].path, () => {});
      }
    }

    res.status(500).json({
      success: false,
      error: err.message || "Server Error",
    });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
