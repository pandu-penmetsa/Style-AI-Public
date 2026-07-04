import axios from "axios";

const api = axios.create({
  baseURL:"http://192.168.1.11:8000/api", // "http://127.0.0.1:8000/api", //
  timeout: 120000, // 2 minutes
  headers: {
    "Content-Type": "application/json",
  },
});

const imageUrlToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("Failed to load reference image.");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Generate style
 *
 * @param {string} userImageBase64
 * @param {string} referenceImageUrl
 * @returns {Promise<Object>}
 */
export const changeStyle = async (
  userImageBase64,
  referenceImageUrl,
  endpoint,
  styleType
) => {
  try {
    const referenceImageBase64 = await imageUrlToBase64(referenceImageUrl);

    const response = await api.post(endpoint, {
      user_image_url: userImageBase64,
      reference_image_url: referenceImageBase64,
      style_type: styleType
    });

    return response.data;
  } catch (error) {
    console.error("Style API Error:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.message ||
        "Failed to generate style."
      );
    }

    if (error.request) {
      throw new Error(
        "Unable to reach server. Please check your backend."
      );
    }

    throw new Error(error.message);
  }
};

export default api;
