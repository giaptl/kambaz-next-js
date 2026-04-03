import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState: { modules: any[] } = {
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, { payload }) => {
      state.modules = payload;
    },
    addModule: (state, { payload: module }) => {
      const newModule = {
        _id: uuidv4(),
        lessons: [],
        name: module.name,
        course: module.course,
      };
      state.modules = [...state.modules, newModule];
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter(
        (m: { _id?: string }) => m._id !== moduleId,
      );
    },
    updateModule: (state, { payload: module }) => {
      const m = module as { _id: string };
      state.modules = state.modules.map((x: { _id: string }) =>
        x._id === m._id ? module : x,
      );
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: { _id: string }) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      );
    },
  },
});

export const { addModule, deleteModule, updateModule, editModule, setModules } =
  modulesSlice.actions;
export default modulesSlice.reducer;
