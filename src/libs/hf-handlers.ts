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
