# TaskConnect API ⚙️

The robust backend service powering the **TaskConnect Progressive Web App (PWA)**. This RESTful API is built with **Node.js, Express.js, and MongoDB**, featuring secure authentication and optimized for serverless deployment on **Vercel**.

## 🚀 Features

- **RESTful Architecture:** Clean and predictable endpoints for users, projects, and task management.
- **Secure Authentication:** Password encryption using `bcryptjs` and authentication via JSON Web Tokens (JWT).
- **Serverless Optimized:** Efficient MongoDB connection pooling for stateless environments like Vercel.
- **Strict Data Validation:** Mongoose schemas enforce required fields, unique constraints, and predefined status enums.
- **CORS Protection:** Configured for authorized development and production frontend environments.

## 🛠️ Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **ODM:** Mongoose
- **Security:** `jsonwebtoken`, `bcryptjs`, `cors`
- **Deployment:** Vercel

## 📂 Project Structure

```text
taskconnect-api/
├── src/
│   ├── controllers/     # Business logic for auth, projects, tasks, and users
│   ├── middlewares/     # JWT verification and route protection
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions
│   ├── app.js           # Express configuration, CORS, and error handling
│   └── index.js         # Entry point and MongoDB connection logic
├── vercel.json          # Serverless deployment configuration
├── .babelrc
├── .env
├── package.json
└── README.md
```

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/carlop13/taskconnect-api.git
```

### 2. Navigate to the project directory

```bash
cd taskconnect-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
SECRET=your_jwt_crypto_secret
```

> **Important:** Never commit your actual `.env` file or sensitive credentials to version control.

### 5. Start the development server

```bash
npm run dev
```

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the local development server |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SECRET` | Secret key used to sign JWT tokens |

> **Note:** The `MONGODB_URI` should include the database name (for example, `/taskconnect`) before the query parameters.

## 📡 API Endpoints

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Verifies API status and version |

### Authentication & Users

**Base route:** `/api/users`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Creates a new user and encrypts the password |
| `POST` | `/signin` | Authenticates a user and returns a JWT |
| `GET` | `/:userId` | Retrieves a specific user |
| `PUT` | `/:userId` | Updates user information |

### Projects

**Base route:** `/api/projects`  
**Authentication:** JWT required.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Creates a new project |
| `GET` | `/:id` | Retrieves projects associated with a user |
| `DELETE` | `/:id` | Deletes a project |
| `PUT` | `/:id/members` | Adds members to a project |
| `DELETE` | `/deletemember/:projectId/users/:userId` | Removes a project member |

### Tasks

**Base route:** `/api/projects/task`  
**Authentication:** JWT required.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Creates a new task |
| `GET` | `/:id` | Retrieves tasks for a project |
| `PUT` | `/:taskId` | Updates task details or status |

Supported task statuses:

- `Pending`
- `In Progress`
- `Completed`

## 🔐 Authentication

TaskConnect uses **JWT-based authentication**.

For protected requests, include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

Passwords are securely hashed using `bcryptjs` before being stored.

## ☁️ Deployment

The API is configured for **Vercel serverless deployment**.

The `vercel.json` configuration redirects incoming requests to the `src/index.js` entry point. MongoDB connection handling is designed to reduce unnecessary connection exhaustion in serverless environments.

### Deploy with Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables:
   - `MONGODB_URI`
   - `SECRET`
   - `PORT`
4. Deploy the project.

## 🧪 Development

Run the project locally with:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## 📌 Project Highlights

- RESTful API architecture
- JWT authentication
- Password hashing with bcrypt
- MongoDB Atlas integration
- Mongoose data modeling
- Protected routes and middleware
- Serverless deployment with Vercel
- Project and task management
- CORS configuration
- Environment-based configuration

## 👨‍💻 Author

**Carlos López**

GitHub: https://github.com/carlop13