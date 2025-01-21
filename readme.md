# **Palcode Ai Task **


---

## **Features**

### **Frontend**
1. **Login Page**: 
   - Login using an OTP sent to your email.
2. **Import YouTube Playlists**:
   - Fetch and display private YouTube playlists seamlessly.
3. **Drag-and-Drop Layout**:
   - Rearrange playlists using drag-and-drop functionality for better organization.
4. **Save and Load Layout**:
   - Save the current layout and retrieve it later from the database.
5.**Interactive Loading State**:
   -Engaging animations for loading processes.
6. **Error Handling**:
   - User-friendly error messages for API failures and validation errors.

### **Backend**
1. **OTP Authentication**:
   - Secure OTP-based email login.
2. **Playlist and Layout Management**:
   - APIs to fetch, save, and load playlists and layouts.
3. **Secure Endpoints**:
   - JWT-based authentication for API endpoints.
4. **Error Handling**:
   - Comprehensive error handling and logging.

---

## **Technologies Used**

### **Frontend**
- **React**: For building the UI.
- **React Router**: For routing and navigation.
- **React DnD**: For drag-and-drop interactions.
- **Tailwind CSS**: For modern and responsive styling.
- **React Toastify**: For real-time notifications and error alerts.

### **Backend**
- **Node.js**: Backend framework.
- **Express.js**: Web server for APIs.
- **MongoDB**: Database for storing user and layout data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For secure token-based authentication.
- **Nodemailer**: For sending OTP emails securely.
- **Google APIs**: For YouTube integration and OAuth authentication.


---

## **Setup Instructions**

### **Environment Variables**
Create a `.env` file in the root directory with the following values:
```env
MONGO_URI=your_mongo_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REACT_APP_BASE_URL=http://localhost:5173

```

## **API Endpoints**

### **Authentication**
- **`POST /auth/send-otp`**: Send OTP to the user's email.
- **`POST /auth/verify-otp`**: Verify OTP and return JWT.

### **YouTube Integration**
- **`GET /youtube/auth-url`**: Fetch YouTube authentication URL.
- **`POST /youtube/auth-callback`**: Handle OAuth callback and retrieve tokens.
- **`GET /youtube/playlists`**: Fetch user playlists.

### **Layout Management**
- **`POST /layout/save`**: Save the current layout.
- **`GET /layout/load`**: Retrieve saved layout.
