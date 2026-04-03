import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [] as { _id?: string; user?: string; course?: string }[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload }) => {
      state.enrollments = payload;
    },
  },
});

export const { setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
