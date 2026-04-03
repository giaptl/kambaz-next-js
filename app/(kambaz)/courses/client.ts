import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`,
  );
  return data;
};

export const findMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`,
  );
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses/${courseId}/enrollment`,
  );
  return data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/current/courses/${courseId}/enrollment`,
  );
  return data;
};

export const createCourse = async (course: Record<string, unknown>) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course,
  );
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (
  course: { _id: string } & Record<string, unknown>,
) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: Record<string, unknown>,
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module,
  );
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
  return data;
};

export const updateModule = async (module: Record<string, unknown>) => {
  const _id = module._id as string;
  const { editing: _ed, ...rest } = module as Record<string, unknown> & {
    editing?: boolean;
  };
  const { data } = await axios.put(`${MODULES_API}/${_id}`, rest);
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: Record<string, unknown>,
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment,
  );
  return data;
};

export const updateAssignment = async (
  assignment: Record<string, unknown> & { _id: string },
) => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment,
  );
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/users`,
  );
  return data;
};

export const createUserForCourse = async (
  courseId: string,
  user: Record<string, unknown>,
) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/users`,
    user,
  );
  return data;
};
