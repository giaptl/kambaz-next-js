import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type Course = {
  _id: string;
  name: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  description?: string;
  department?: string;
  credits?: number;
  author?: string;
};

const initialState: { courses: Course[] } = {
  courses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addNewCourse: (state, { payload: course }) => {
      const newCourse = { ...course, _id: uuidv4() } as Course;
      state.courses = [...state.courses, newCourse];
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter((c) => c._id !== courseId);
    },
    updateCourse: (state, { payload: course }) => {
      const updated = course as Course;
      state.courses = state.courses.map((c) =>
        c._id === updated._id ? updated : c,
      );
    },
    setCourses: (state, { payload: courses }) => {
      state.courses = courses;
    },
  },
});

export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;
export default coursesSlice.reducer;
