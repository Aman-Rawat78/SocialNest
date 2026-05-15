# SocialNest

SocialNest is a full-stack social media application that enables users to connect, share posts, chat in real-time, and manage their profiles. It features a modern, responsive UI and real-time notifications, making it a robust platform for social interaction.

## Features

- **User Authentication:** Register, login, logout, and JWT-based session management.
- **User Profiles:** View, edit, and update user profiles, including profile pictures and bio.
- **Posts:** Create, view, like, unlike, and delete posts with image upload and optimization.
- **Comments:** Add and view comments on posts.
- **Real-Time Chat:** Real-time messaging and notifications using Socket.io.
- **Follow System:** Follow/unfollow users and view suggested users.
- **Bookmarks:** Bookmark posts for later viewing.
- **Search:** Search for users.
- **Real-Time Notifications:** Receive notifications for likes/unlikes on posts.
- **Responsive UI:** Modern React frontend with Redux state management.

## Technologies Used

- **Frontend:** React, Redux Toolkit, Vite, CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **File Uploads:** Multer, Cloudinary, Sharp
- **Real-Time:** Socket.io

## Installation Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Backend Setup
1. Navigate to the backend folder:
	```bash
	cd backend
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Create a `.env` file with your environment variables (MongoDB URI, JWT secret, Cloudinary credentials, etc).
4. Start the backend server:
	```bash
	npm start
	```

### Frontend Setup
1. Navigate to the frontend folder:
	```bash
	cd frontend
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Start the frontend development server:
	```bash
	npm run dev
	```

## Usage

1. Register a new user or log in with existing credentials.
2. Create, like, comment, and bookmark posts.
3. Chat with other users in real-time.
4. Edit your profile and follow/unfollow users.
5. Receive real-time notifications for likes and unlikes.

## Folder Structure

- `backend/` - Express API, models, controllers, routes, socket, and utilities
- `frontend/` - React app, components, hooks, redux, and assets

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the project maintainer.
