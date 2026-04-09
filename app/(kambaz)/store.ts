import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/Modules/reducer";
import accountReducer from "./account/reducer";
import assignmentsReducer from "./courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./enrollmentsReducer";
import quizzesReducer from "./courses/[cid]/Quizzes/reducer";
import questionsReducer from "./courses/[cid]/Quizzes/questionsReducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
    quizzesReducer,
    questionsReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;