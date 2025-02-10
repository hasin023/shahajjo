// Server side
import { Client } from "basic-ftp";
import { Readable } from "node:stream";

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

export async function uploadFile(file: File, name: string) {
    const client = new Client();
    try {
        await client.access({
            host: ftpIp,
            user: ftpUser,
            password: ftpPassword,
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

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


export async function updateFile(file: File, fileUrl: string) {
    const client = new Client();
    try {
        await client.access({
            host: ftpIp,
            user: ftpUser,
            password: ftpPassword,
        });
        const name = extractFileName(fileUrl);
        // Delete existing file
        await client.remove(name);

        // Upload the new file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

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
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete file: ${error}`);
    } finally {
        client.close();
    }
}
