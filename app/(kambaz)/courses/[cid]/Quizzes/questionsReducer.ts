import { createSlice } from "@reduxjs/toolkit";

// redux for managing quiz questions
const questionsSlice = createSlice({
  name: "questions",
  // start with an empty list
  initialState: { questions: [] as any[] },
  reducers: {
    // replace the whole list, usually after fetching from the backend
    setQuestions: (state, { payload }) => {
      state.questions = payload;
    },
    // add a new question onto the end
    addQuestion: (state, { payload }) => {
      state.questions.push(payload);
    },
    // find the question by id and swap it out
    updateQuestion: (state, { payload }) => {
      const idx = state.questions.findIndex((q) => q._id === payload._id);
      if (idx !== -1) state.questions[idx] = payload;
    },
    // remove a question by its id
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.filter((q) => q._id !== questionId);
    },
  },
});

export const { setQuestions, addQuestion, updateQuestion, deleteQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;