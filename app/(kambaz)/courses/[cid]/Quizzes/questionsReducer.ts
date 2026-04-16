import { createSlice } from "@reduxjs/toolkit";

const questionsSlice = createSlice({
  name: "questions",
  initialState: { questions: [] as any[] },
  reducers: {
    setQuestions: (state, { payload }) => {
      state.questions = payload;
    },
    addQuestion: (state, { payload }) => {
      state.questions.push(payload);
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
