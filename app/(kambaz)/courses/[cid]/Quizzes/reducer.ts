import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  quizzes: [
    { _id: "Q1", title: "Q1 - HTML", course: "RS101", points: 29, numQuestions: 11,
      status: "Closed", dueDate: "Sep 21 at 1pm", availableFromDate: null },
    { _id: "Q2", title: "Q2 - CSS", course: "RS101", points: 32, numQuestions: 7,
      status: "Closed", dueDate: "Oct 5 at 1pm", availableFromDate: null },
    { _id: "Q3", title: "EXAM 1 FA 23", course: "RS101", points: 113, numQuestions: 20,
      status: "Closed", dueDate: "Oct 26 at 5:30pm", availableFromDate: null },
    { _id: "Q4", title: "Q3 - JS, ES6", course: "RS101", points: 38, numQuestions: 13,
      status: "Available", dueDate: "Multiple Dates", availableFromDate: "Multiple Dates" },
    { _id: "Q5", title: "Q5 - MONGO", course: "RS101", points: 38, numQuestions: 10,
      status: "Not available", dueDate: "Nov 30 at 1pm", availableFromDate: "Nov 30 at 11:40am" },
  ] as any[],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz = { ...quiz, _id: uuidv4() };
      state.quizzes = [...state.quizzes, newQuiz] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
  },
});

export const { addQuiz, deleteQuiz, updateQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;