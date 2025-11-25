import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== Environment Variables Test ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? '✅ Set' : '❌ Not set');
console.log('ACCESS_TOKEN_EXPIRE_MINUTES:', process.env.ACCESS_TOKEN_EXPIRE_MINUTES ? '✅ Set' : '❌ Not set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_GENAI_API_KEY:', process.env.GOOGLE_GENAI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLOUD_LOCATION:', process.env.GOOGLE_CLOUD_LOCATION ? '✅ Set' : '❌ Not set');
console.log('PORT:', process.env.PORT ? '✅ Set' : '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV ? '✅ Set' : '❌ Not set');
console.log('===================================');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing! This will cause the server to fail.');
  process.exit(1);
}

console.log('✅ All required environment variables are set!');
