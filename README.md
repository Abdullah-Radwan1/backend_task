# 📦 Express REST API

A RESTful API built with **Express.js**, **MongoDB**, **JWT authentication**, and **Zod** schema validation. It supports user authentication and post management with image upload capabilities.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (via cookies) |
| Validation | Zod |
| File Uploads | Multer |
| Password Hashing | bcryptjs |
| Rate Limiting | express-rate-limit |
| Logging | Morgan |

---

## 🗄️ Database Choice — MongoDB

This project uses **MongoDB** as its database for the following reasons:

- **Flexible Schema**: MongoDB's document model maps naturally to JSON, making it easy to evolve the data model without painful migrations. Fields like post `image` can be optional without any schema alteration overhead.
- **Seamless Node.js Integration**: The **Mongoose** ODM provides a clean, schema-based abstraction over MongoDB that fits perfectly in a JavaScript/Node.js ecosystem.
- **Scalability**: MongoDB scales horizontally out of the box, which is ideal for content-heavy APIs with growing volumes of posts and users.
- **Rapid Development**: Schema definitions with Mongoose (e.g., `User`, `Post`) are quick to write and easy to extend, enabling faster iteration during development.
- **Population / References**: Mongoose's `.populate()` makes it straightforward to resolve references between collections (e.g., resolving a post's `author` field to the full `User` document).

---

## ⚙️ Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd back
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Then open `.env` and set the variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/express-api-db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | JWT token expiry duration (e.g. `7d`, `1h`) |
| `NODE_ENV` | Environment (`development` / `production`) |

### 4. Run the server

**Development** (with hot-reload via nodemon):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The API will be available at: `http://localhost:5000`

---

## 📡 API Endpoints

All endpoints are prefixed with `/v1`.

### 🔐 Auth — `/v1/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/v1/auth/register` | ❌ | Register a new user |
| `POST` | `/v1/auth/login` | ❌ | Log in and receive a JWT cookie |
| `POST` | `/v1/auth/logout` | ❌ | Clear the auth cookie |
| `GET` | `/v1/auth/me` | ✅ | Get the currently authenticated user |

#### Register — `POST /v1/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login — `POST /v1/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

---

### 📝 Posts — `/v1/posts`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/v1/posts` | ❌ | Get all posts |
| `GET` | `/v1/posts/:id` | ❌ | Get a single post by ID |
| `POST` | `/v1/posts` | ✅ | Create a new post (supports image upload) |
| `PUT` | `/v1/posts/:id` | ✅ | Update an existing post (owner only) |
| `DELETE` | `/v1/posts/:id` | ✅ | Delete a post (owner only) |

#### Create Post — `POST /v1/posts`

Sent as `multipart/form-data`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✅ | Post title |
| `content` | `string` | ✅ | Post body content |
| `image` | `file` | ❌ | Optional image attachment |

---

## 📁 Project Structure

```
src/
├── app.js              # Express app setup & middleware
├── server.js           # Entry point — DB connection & server start
├── config/             # Database configuration
├── controllers/        # Route handler logic
│   ├── auth.controller.js
│   └── post.controller.js
├── middlewares/        # Custom Express middlewares
│   ├── auth.middleware.js      # JWT protect guard
│   ├── validate.middleware.js  # Zod schema validation
│   ├── upload.middleware.js    # Multer file upload
│   └── rateLimiter.middleware.js
├── models/             # Mongoose models
│   ├── User.js
│   └── Post.js
├── routes/             # Express routers
│   ├── index.js
│   ├── auth.routes.js
│   └── post.routes.js
├── schemas/            # Zod validation schemas
│   ├── auth.schema.js
│   └── post.schema.js
├── services/           # Business logic layer
└── utils/              # Shared utilities (error handler, etc.)
```

---

## 🔒 Authentication

Authentication is handled via **JWT tokens stored in HTTP-only cookies**. On a successful login or register, the server sets a `token` cookie automatically. Protected routes require this cookie to be present.

---

## 🖼️ Static Files

Uploaded images are served statically from:

```
GET /uploads/<filename>
```

---

## 🚦 Rate Limiting

All API routes are rate-limited via `express-rate-limit` to prevent abuse. Exceeding the limit returns a `429 Too Many Requests` response.
