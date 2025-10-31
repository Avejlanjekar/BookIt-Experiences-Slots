1. Clone the Repository
2. Backend Setup
Navigate to backend directory:cd backend
3. Install dependencies: npm install
4. Environment Configuration:Create a .env file in the backend directory:
MONGODB_URI=mongodb://localhost:27017/bookit
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_TIME=7d
PORT=5000

5. Start the backend server: node server.js

Frontend Setup
1. Open a new terminal and navigate to frontend: cd frontend
2. Install dependencies: npm install
3. Start the frontend development server: npm run dev
Frontend should be running on: http://localhost:3000
