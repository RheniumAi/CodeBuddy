import axios from "axios";

const API_URL = "http://localhost:5000/api/collaborate";

export const generateCode = async (prompt) => {
    try {
        const payload = { prompt }; 
        const response = await axios.post(`${API_URL}/generate-code` ,payload, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error generating code:", error.response?.data);
        throw error.response?.data || { error: "Something went wrong" };
    }
};
