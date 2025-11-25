# Clarity Retina Care

A comprehensive retina care application with authentication, doctor search, AI-powered chat, and Google Maps integration.

## Features

- 🔐 **Authentication System**: JWT-based login/signup with role-based access (User, Doctor, Admin)
- 🗺️ **Google Maps Integration**: Find nearby doctors with location-based search
- 🤖 **AI-Powered Chat**: Google GenAI integration for retina care assistance
- 📸 **Image Upload**: Cloudinary integration for profile and medical images
- 👨‍⚕️ **Doctor Management**: Complete doctor profiles with reviews and ratings
- 📱 **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Google GenAI for AI features
- Cloudinary for image uploads

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Platform account (for GenAI and Maps)
- Cloudinary account

## Environment Variables

### Frontend (.env)
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env)
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET_KEY=your_32_character_jwt_secret
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google GenAI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
GOOGLE_CLOUD_PROJECT=your_google_cloud_project
GOOGLE_CLOUD_LOCATION=global

# Server
PORT=5000
NODE_ENV=development
```

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd clarity-retina-care-main
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Set up environment variables
Create `.env` files in both root and backend directories with the variables listed above.

### 5. Start the development servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/medical-history` - Update medical history
- `PUT /api/users/eye-data` - Update eye data

### Doctors
- `GET /api/doctors/nearby` - Find nearby doctors
- `GET /api/doctors` - Get all doctors with filters
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor profile
- `POST /api/doctors/:id/reviews` - Add doctor review

### Chat/AI
- `POST /api/chat/ask` - Ask AI a question
- `POST /api/chat/symptoms` - Analyze symptoms
- `POST /api/chat/education` - Get educational content

### Upload
- `POST /api/upload/image` - Upload general image
- `POST /api/upload/profile-image` - Upload profile image

## Database Schema

### User Model
- Basic info (name, email, password)
- Role (user, doctor, admin)
- Medical history
- Eye data
- Preferences

### Doctor Model
- User reference
- Specialization
- Location (with geospatial indexing)
- Experience and education
- Reviews and ratings
- Availability

## Google Maps Integration

The application uses Google Maps API for:
- Finding nearby doctors based on user location
- Displaying doctor locations on a map
- Calculating distances between users and doctors

To enable Google Maps:
1. Create a Google Cloud Project
2. Enable Maps JavaScript API
3. Create an API key
4. Add the key to your environment variables

## AI Features

Powered by Google GenAI (Gemini):
- Retina care Q&A
- Symptom analysis
- Educational content generation
- Medical guidance (with appropriate disclaimers)

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- Helmet.js security headers

## Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the backend folder
3. Update frontend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@clarityretinacare.com or create an issue in the repository.
