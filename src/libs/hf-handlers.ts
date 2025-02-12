import hf from "./hf-config";

export const generateImageCaption = async (imageFile: File) => {
    try {
        if (!imageFile) return;

        const imageBlob = await convertImageToBlob(imageFile);

        const output = await hf.imageToText({
            data: imageBlob,
            model: 'Salesforce/blip-image-captioning-base'
        });

        return output;
    } catch (error) {
        console.error(error);
    }
};

const convertImageToBlob = async (imageFile: File) => {
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer
            const type = imageFile?.type || "image/png"
            const blob = new Blob([arrayBuffer], { type })
            resolve(blob)
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(imageFile)
    })

    return imageBlob
}

export const analyzeFakeReport = async (text: string) => {
    try {
        if (!text.trim()) return;

        // Defining candidate labels
        const candidateLabels = ["fake", "real"];  // Labels for classification

        // Make the request with the required parameter
        const output = await hf.textClassification({
            data: text,
            model: "j-hartmann/emotion-english-distilroberta-base", // Replace with your model
            candidate_labels: candidateLabels,
        });

        return output;
    } catch (error) {
        console.error("Error in analyzeFakeReport:", error);
    }
};



export const detectFakeImage = async (imageUrl: string) => {
    try {
        if (!imageUrl) return;

        // Fetch the image from the URL
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();  // Convert image URL to Blob

        // Pass the Blob to the model for detection
        const output = await hf.imageClassification({
            data: imageBlob,
            model: "microsoft/dit-base-finetuned-rvlcdip" // Change this to a better deepfake detection model if available
        });

        return output;
    } catch (error) {
        console.error("AI Image Fake Detection Error:", error);
    }
};


