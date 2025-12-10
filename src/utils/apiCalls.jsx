import axios from "axios";

// 🔹 Base API URL (change to your backend)
const BASE_URL = "https://example.com/api";

// 🔹 Main reusable API call
export const apiCall = async (method, endpoint, data = {}, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Success:", endpoint, response.data);
    return response.data;

  } catch (error) {
    console.log("API Error:", endpoint, error?.response?.data || error.message);
    return null;
  }
};


// ----------------------------------------------------
// 🔹 AUTH API
// ----------------------------------------------------
export const loginUser = (email, password) => {
  return apiCall("POST", "/auth/login", { email, password });
};

export const signupUser = (name, email, password) => {
  return apiCall("POST", "/auth/signup", { name, email, password });
};

// ----------------------------------------------------
// 🔹 USER API
// ----------------------------------------------------
export const getUserProfile = (userId) => {
  return apiCall("GET", `/user/profile/${userId}`);
};

export const updateUserProfile = (userId, data) => {
  return apiCall("PUT", `/user/update/${userId}`, data);
};

// ----------------------------------------------------
// 🔹 TASKS API (Discipline App Feature)
// ----------------------------------------------------
export const addTask = (title, description) => {
  return apiCall("POST", "/task/add", {
    title,
    description,
  });
};

export const getAllTasks = () => {
  return apiCall("GET", "/task/all");
};

export const updateTask = (taskId, data) => {
  return apiCall("PUT", `/task/update/${taskId}`, data);
};

export const deleteTask = (taskId) => {
  return apiCall("DELETE", `/task/delete/${taskId}`);
};

// ----------------------------------------------------
// 🔹 LOGS / TRACKER (habits, discipline, daily tracking)
// ----------------------------------------------------
export const addDailyLog = (type, value) => {
  return apiCall("POST", "/logs/add", { type, value });
};

export const getDailyLogs = (date) => {
  return apiCall("GET", "/logs/date", {}, { date });
};
