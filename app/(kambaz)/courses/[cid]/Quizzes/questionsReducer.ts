import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const questionsSlice = createSlice({
  name: "questions",
  initialState: { questions: [] as any[] },
  reducers: {
    setQuestions: (state, { payload }) => {
      state.questions = payload;
    },
    addQuestion: (state, { payload }) => {
      const { quizId, _id } = payload;
      state.questions.push({
        _id,
        quiz: quizId,
        title: "New Question",
        type: "multiple_choice",
        points: 1,
        question: "",
        choices: ["", ""],
        correctAnswer: 0,
      });
    },
    updateQuestion: (state, { payload }) => {
      const idx = state.questions.findIndex((q) => q._id === payload._id);
      if (idx !== -1) state.questions[idx] = payload;
    },
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.filter((q) => q._id !== questionId);
    },
  },
});

export const { setQuestions, addQuestion, updateQuestion, deleteQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;