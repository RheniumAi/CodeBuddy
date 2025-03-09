import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const signUpUser = async (userData)=>{
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("Error signing up user:", error.response.data);
        throw error.response?.data || { error: "Something went wrong" };
    }
}

export const loginUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        withCredentials: true,  
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error.response?.data);
      throw error.response?.data || { error: "Something went wrong" };
    }
};

export const logoutUser = async () => {
  try {
      const response = await axios.post(`${API_URL}/logout`, {}, {
          withCredentials: true, // Ensure cookies are included in the request
      });
      return response.data;
  } catch (error) {
      console.error("Error logging out user:", error.response?.data);
      throw error.response?.data || { error: "Something went wrong" };
  }
};
