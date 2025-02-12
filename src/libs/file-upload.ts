import { Client } from "basic-ftp";
import { Readable } from "node:stream";
import { addWatermark } from "./watermark";
import sharp from "sharp";

const ftpIp = process.env.FTP_IP;
const ftpUser = process.env.FTP_USER;
const ftpPassword = process.env.FTP_PASS;

// Maximum width/height for images (adjust as needed)
const MAX_DIMENSION = 2000;
// JPEG quality (1-100)
const COMPRESSION_QUALITY = 80;
// Maximum file size in bytes (e.g., 10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function extractFileName(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.split("/").pop() || "";
  } catch {
    throw new Error("Failed to get image name/invalid URL");
  }
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Skip compression if file is already small
    if (buffer.length < MAX_FILE_SIZE / 2) {
      return buffer;
    }

    let pipeline = image;

    // Resize if image is too large while maintaining aspect ratio
    if (metadata.width && metadata.height) {
      if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }
    }

    // Convert to different formats based on input
    switch (metadata.format) {
      case "jpeg":
      case "jpg":
        return await pipeline.jpeg({ quality: COMPRESSION_QUALITY }).toBuffer();
      case "png":
        return await pipeline.png({ compressionLevel: 8 }).toBuffer();
      case "webp":
        return await pipeline.webp({ quality: COMPRESSION_QUALITY }).toBuffer();
      default:
        // For unsupported formats, convert to JPEG
        return await pipeline.jpeg({ quality: COMPRESSION_QUALITY }).toBuffer();
    }
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Failed to compress image");
  }
}

export async function uploadFile(file: File, name: string) {
  const client = new Client();
  try {
    await client.access({
      host: ftpIp,
      user: ftpUser,
      password: ftpPassword,
    });

    console.log("Starting file processing...");

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    if (isImageFile(file)) {
      console.log("Image file detected, processing...");

      // First compress the image
      try {
        buffer = await compressImage(buffer);
        console.log("Image compressed successfully");
      } catch (compressionError) {
        console.error("Compression error:", compressionError);
        // Continue with original buffer if compression fails
        console.log("Continuing with original file due to compression error");
      }

      // Then add watermark
      try {
        buffer = await addWatermark(buffer);
        console.log("Watermark added successfully");
      } catch (watermarkError) {
        console.error("Watermark error:", watermarkError);
        console.log("Continuing with compressed file due to watermark error");
      }
    } else {
      console.log("Non-image file detected, skipping image processing");
    }

    // Create readable stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    console.log("Uploading file...");
    const result = await client.uploadFrom(readableStream, name);
    console.log("Upload complete");

    return result;
  } catch (error) {
    console.error("Detailed upload error:", error);
    throw error;
  } finally {
    client.close();
  }
}

export async function updateFile(file: File, fileUrl: string) {
  const client = new Client();
  try {
    await client.access({
      host: ftpIp,
      user: ftpUser,
      password: ftpPassword,
    });
    const name = extractFileName(fileUrl);
    await client.remove(name);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);

    if (isImageFile(file)) {
      // Compress image first
      buffer = await compressImage(buffer);
      // Then add watermark
      buffer = await addWatermark(buffer);
    }

    // Create readable stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const ftpResponse = await client.uploadFrom(readableStream, name);
    return ftpResponse;
  } catch (error) {
    throw new Error(error as any);
  } finally {
    client.close();
  }
}

export async function deleteFile(fileUrl: string) {
  const client = new Client();
  try {
    await client.access({
      host: ftpIp,
      user: ftpUser,
      password: ftpPassword,
    });
    const name = extractFileName(fileUrl);
    await client.remove(name);
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  } finally {
    client.close();
  }
}
