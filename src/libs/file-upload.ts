// Server side
import { Client } from "basic-ftp";
import { Readable } from "node:stream";
import { addWatermark } from "./watermark";

const ftpIp = process.env.FTP_IP;
const ftpUser = process.env.FTP_USER;
const ftpPassword = process.env.FTP_PASS;

function extractFileName(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname.split('/').pop() || ''; // Extract the last part of the path
    } catch {
        throw new Error("Failed to get image name/invalid URL");
    }
}

function isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }
  
  // Modified uploadFile function with conditional watermarking
  export async function uploadFile(file: File, name: string) {
      const client = new Client();
      try {
          await client.access({
              host: ftpIp,
              user: ftpUser,
              password: ftpPassword,
          });
  
          console.log('Starting file processing...');
  
          // Convert File to Buffer
          const arrayBuffer = await file.arrayBuffer();
          let buffer = Buffer.from(arrayBuffer);
          
          console.log('File converted to buffer');
  
          // Only apply watermark if it's an image file
          if (isImageFile(file)) {
              console.log('Image file detected, adding watermark...');
              try {
                  buffer = await addWatermark(buffer);
                  console.log('Watermark added successfully');
              } catch (watermarkError) {
                  console.error('Watermark error:', watermarkError);
                  // Continue with original buffer if watermarking fails
                  console.log('Continuing with original file due to watermark error');
              }
          } else {
              console.log('Non-image file detected, skipping watermark');
          }
  
          // Create readable stream
          const readableStream = new Readable();
          readableStream.push(buffer);
          readableStream.push(null);
  
          console.log('Uploading file...');
          const result = await client.uploadFrom(readableStream, name);
          console.log('Upload complete');
          
          return result;
      } catch (error) {
          console.error('Detailed upload error:', error);
          throw error;
      } finally {
          client.close();
      }
  }

// Modified updateFile function
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
        const buffer = Buffer.from(arrayBuffer);

        // Add watermark
        const watermarkedBuffer = await addWatermark(buffer);

        // Create readable stream from watermarked buffer
        const readableStream = new Readable();
        readableStream.push(watermarkedBuffer);
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
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete file: ${error}`);
    } finally {
        client.close();
    }
}
