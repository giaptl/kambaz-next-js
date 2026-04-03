import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/Modules/reducer";
import accountReducer from "./account/reducer";
import assignmentsReducer from "./courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./enrollmentsReducer";
import quizzesReducer from "./courses/[cid]/Quizzes/reducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
    quizzesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;