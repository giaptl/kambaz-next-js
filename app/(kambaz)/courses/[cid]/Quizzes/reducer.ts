import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [] as any[],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload }) => {
      state.quizzes = payload;
    },
    addQuiz: (state, action: PayloadAction<any>) => {
      state.quizzes = [...state.quizzes, action.payload] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    togglePublish: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, published: !q.published } : q
      ) as any;
    },
  },
});

export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz, togglePublish } = quizzesSlice.actions;
export default quizzesSlice.reducer;
