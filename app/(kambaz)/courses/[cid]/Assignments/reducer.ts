import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [] as Record<string, unknown>[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload }) => {
      state.assignments = payload;
    },
  },
});

export const { setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
