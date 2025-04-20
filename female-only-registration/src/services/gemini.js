import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create a new generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to detect if a person is female from an image
export async function detectFemale(imageBase64) {
  try {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.split(',')[1];
    
    // Initialize the model - Use gemini-1.5-flash instead of the deprecated gemini-pro-vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create image part from base64 data
    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ];

    // Improved prompt to detect if this is a real female person (not a photo of a photo)
    const prompt = `
      Analyze this image to determine:
      1. Is this a real person (not a photo of a photo)?
      2. Is this person female?
      3. Are there any signs this might be someone holding up a picture or showing an image on a screen?
      
      IMPORTANT: Only respond with "YES" if you are confident this is a real female person captured directly by the camera.
      Respond with "NO" if you detect it's a photo of a photo, an image shown on a screen, or not a female.
    `;

    // Generate content with the image
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().toUpperCase().trim();
    
    console.log("Gemini response:", text);
    
    // Return true if the response contains 'YES'
    return text.includes('YES');
  } catch (error) {
    console.error("Error detecting gender:", error);
    if (error.response) {
      console.error("API error details:", error.response);
    }
    return false;
  }
}

// Helper function to analyze differences between images for liveness detection
export async function performLivenessCheck(imageBase64Array) {
  try {
    if (imageBase64Array.length < 2) {
      return false;
    }
    
    // Take the first and last image for comparison
    const firstImage = imageBase64Array[0];
    const lastImage = imageBase64Array[imageBase64Array.length - 1];
    
    // Remove the data URL prefix
    const firstImageData = firstImage.split(',')[1];
    const lastImageData = lastImage.split(',')[1];
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const imageParts = [
      {
        inlineData: {
          data: firstImageData,
          mimeType: "image/jpeg",
        },
      },
      {
        inlineData: {
          data: lastImageData,
          mimeType: "image/jpeg",
        },
      }
    ];

    const prompt = `
      Compare these two images taken a few seconds apart.
      I need to determine if this is a real person (liveness detection) or someone holding up a static photo.
      
      Look for:
      1. Slight natural movements between frames
      2. Changes in facial expression or position
      3. Signs that this is a static photo being held up to the camera
      
      Only respond with "LIVE" if you can detect natural human movement between the frames.
      Otherwise respond with "STATIC".
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().toUpperCase().trim();
    
    console.log("Liveness check response:", text);
    
    return text.includes('LIVE');
  } catch (error) {
    console.error("Error performing liveness check:", error);
    return false;
  }
}