import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/collaborate`;

export const generateCode = async (prompt) => {
    try {
        const payload = { prompt }; 
        const response = await axios.post(`${API_URL}/generate-code`, payload, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong";

        if (error.response?.status === 429) {
            throw { error: "Request limit reached. Try again after 5 hours." };
        }

        console.error("Error generating code:", errorMessage);
        throw { error: errorMessage };
    }
};
