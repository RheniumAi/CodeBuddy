import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signUpUser = async (userData)=>{
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("Error signing up user:", error.response.data);
        throw new Error(error.response.data.message);
    }
}

export const loginUser = async (userData)=>{
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error.response.data);
        throw new Error(error.response.data.message);
    }
}