import express from "express";
import { createQuiz, getQuizzes } from "../controllers/Quiz.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([
      {
        name: "questionImage",
        maxCount: 1,
      },
      {
        name: "explanationImage",
        maxCount: 1,
      },
    ]),
    createQuiz
  )
  .get(getQuizzes);

export default router;
