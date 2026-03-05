import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "./database";

const initialState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, { payload }) => {
      state.enrollments = [
        ...state.enrollments,
        { _id: new Date().getTime().toString(), user: payload.userId, course: payload.courseId },
      ] as any;
    },
    unenroll: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === payload.userId && e.course === payload.courseId)
      );
    },
  },
});

export const { enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;