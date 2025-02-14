# Shahajjo

# Crime Reporting and Community Verification Platform

A real-time crime reporting platform built with Next.js that enables communities to report and verify crimes while ensuring authenticity through AI-powered verification and community engagement.

## 🌟 Features

### Core Features
- **User Authentication**
  - Email & Phone verification
  - OTP-based verification
  - Role-based access control (Admin/Verified/Unverified users)

- **Crime Reporting**
  - Image/video upload with AI-generated descriptions
  - Location-based reporting (Division/District)
  - Community verification system
  - Watermarking for uploaded content
  - Anonymous reporting option

- **Community Interaction**
  - Upvote/Downvote system
  - Comments with mandatory proof
  - Real-time notifications
  - Verification badges for trusted reports

- **Advanced Features**
  - Crime heatmap visualization
  - AI-powered fake report detection
  - Emergency contact integration
  - Image compression and optimization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- FTP Server (for file storage)
- Google Maps API Key
- Hugging Face API Token
- SMS Gateway API credentials

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/hasin023/shahajjo.git
cd shahajjo
```

2. Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
DBNAME=your_db_name
JWT_SECRET_KEY=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
SMS_API_KEY=your_sms_api_key
SMS_SENDERID=your_sms_sender_id
FTP_IP=your_ftp_server_ip
FTP_USER=your_ftp_username
FTP_PASS=your_ftp_password
NEXT_PUBLIC_GOOGLE_MAP_API=your_google_maps_api_key
NEXT_PUBLIC_HF_ACCESS_TOKEN=your_huggingface_token
NODE_ENV=development
```

3. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the FTP service:
```bash
npm run ftp
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
📦 crime-reporting-platform
├── 📂 src/
│   ├── 📂 app/           # Next.js 13+ app directory
│   ├── 📂 components/    # Reusable UI components
│   ├── 📂 db/           # Database configuration
│   ├── 📂 hooks/        # Custom React hooks
│   ├── 📂 libs/         # Utility functions and types
│   ├── 📂 services/     # Business logic and API services
│   └── 📂 stores/       # State management
```

## 🔧 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **File Storage**: FTP Server
- **Authentication**: JWT + OTP
- **Maps**: Google Maps API
- **AI Integration**: Hugging Face API
- **Real-time Features**: WebSocket/Server-Sent Events

## 🛠️ Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run ftp`: Start FTP service
- `npm run build`: Build production bundle
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests (if configured)

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- Built for the Hackathon event on February 12, 2025
- Uses various open-source libraries and APIs
- Community-driven crime reporting initiative

## ⚠️ Important Notes

- Ensure all API keys and credentials are properly secured
- The FTP service must be running before starting the development server
- Configure proper security measures before deploying to production
- Regular backups of the database are recommended
