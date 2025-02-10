const FtpSrv = require('ftp-srv');
const fs = require('fs');

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:21", // Change port if needed
    anonymous: true // Allow anonymous access
});
const ftpRootDir = './server-ftp/root';

if(!fs.existsSync(ftpRootDir)) fs.mkdirSync(ftpRootDir);

const ftpUser = process.env.FTP_USER;
const ftpPassword = process.env.FTP_PASS;

ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {
    // authentication logic here
    if (username === ftpUser && password === ftpPassword) {
        
        resolve({ root: ftpRootDir }); // Set FTP root directory
    } else {
        reject(new Error("Invalid username or password"));
    }
});

ftpServer.listen()
    .then(() => console.log("FTP Server is running on ftp://localhost:21"))
    .catch(err => console.error("Error starting FTP server:", err));
