# 🚀 Profile Intelligence Service API (HNG Stage 0 & Stage 1)

## 📌 Overview

This project is a backend API that evolves across two stages:

### 🟢 Stage 0

Classifies a name using the Genderize API and returns processed gender insights.

### 🔵 Stage 1

Builds a **Profile Intelligence Service** that:

* Enriches a name using multiple external APIs
* Processes and structures the data
* Stores results in a database (MongoDB)
* Provides endpoints for retrieval, filtering, and deletion
* Ensures idempotent behavior

---

## 🌐 Live API

```bash
https://name-classification-api.vercel.app
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Axios
* UUID
* CORS
* dotenv

---

## 📁 Project Structure

```
profile-intelligence-service/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   └── profile.model.js
│   │
│   ├── routes/
│   │   ├── classify.route.js
│   │   └── profile.route.js
│   │
│   ├── services/
│   │   ├── genderize.service.js
│   │   └── profile.service.js
│   │
│   └── utils/
│       └── helpers.js
│
├── index.js
├── package.json
├── .env
└── README.md
```

---

# 🟢 Stage 0 – Name Classification

## 📥 Endpoint

### GET `/api/classify?name={name}`

### ✅ Success Response

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 1,
    "sample_size": 2692560,
    "is_confident": true,
    "processed_at": "2026-04-12T10:03:13.620Z"
  }
}
```

---

# 🔵 Stage 1 – Profile Intelligence Service

## 📥 1. Create Profile

### POST `/api/profiles`

### Request Body

```json
{
  "name": "james"
}
```

---

### ✅ Success Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "019d8f68-b1b7-7484-b042-3c2d65e215ea",
    "name": "james",
    "gender": "male",
    "gender_probability": 1,
    "sample_size": 1458986,
    "age": 74,
    "age_group": "senior",
    "country_id": "US",
    "country_probability": 0.08733511114519656,
    "created_at": "2026-04-15T04:31:36.376Z"
  }
}
```

---

### 🔁 Idempotent Response (200)

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": {
    "id": "019d8f68-b1b7-7484-b042-3c2d65e215ea",
    "name": "james",
    "gender": "male",
    "gender_probability": 1,
    "sample_size": 1458986,
    "age": 74,
    "age_group": "senior",
    "country_id": "US",
    "country_probability": 0.08733511114519656,
    "created_at": "2026-04-15T04:31:36.376Z"
  }
}
```

---

## 📥 2. Get Profile by ID

### GET `/api/profiles/{id}`

### ✅ Success Response (200)

```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emmanuel",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 25,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

---

## 📥 3. Get All Profiles (with Filtering)

### GET `/api/profiles`

### Optional Query Parameters

* `gender`
* `country_id`
* `age_group`

### Example

```bash
/api/profiles?gender=male&country_id=NG
```

---

### ✅ Success Response (200)

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "john",
      "gender": "male",
      "age": 22,
      "age_group": "adult",
      "country_id": "US"
    },
  ]
}
```

---

## 📥 4. Delete Profile

### DELETE `/api/profiles/{id}`

### ✅ Success Response

```
204 No Content
```

---

# ❌ Error Responses

### 400 – Missing Name

```json
{
  "status": "error",
  "message": "Name is required"
}
```

### 422 – Invalid Type

```json
{
  "status": "error",
  "message": "Name must be a string"
}
```

### 404 – Not Found

```json
{
  "status": "error",
  "message": "Profile not found"
}
```

### 502 – External API Error

```json
{
  "status": "error",
  "message": "Genderize returned an invalid response"
}
```

---

# 🧠 Processing Logic

### Genderize

* Extract:

  * `gender`
  * `probability → gender_probability`
  * `count → sample_size`

### Agify

* Extract:

  * `age`
* Classify:

  * 0–12 → child
  * 13–19 → teenager
  * 20–59 → adult
  * 60+ → senior

### Nationalize

* Extract country list
* Select highest probability:

  * `country_id`
  * `country_probability`

---

# 💾 Data Persistence

* MongoDB used for persistent storage
* Each record includes:

  * UUID v7 identifier
  * Processed API data
  * ISO 8601 timestamp

---

# 🔁 Idempotency

* Same name submission does not create duplicates
* Existing profile is returned instead

---

# ⚡ Performance Notes

* External API calls executed in parallel (`Promise.all`)
* Efficient querying with MongoDB
* Designed to handle multiple requests reliably

---

# 🔐 CORS

```
Access-Control-Allow-Origin: *
```

---

# 🚀 Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 3. Start server

```bash
npm run dev
```

---

# 🌍 Deployment

Supported platforms:

* Vercel
* Railway
* AWS
* Heroku

---

# 🧪 Testing Checklist

* Create profile successfully
* Duplicate name returns existing record
* Fetch by ID works
* Filtering works correctly
* Delete endpoint works
* Error cases handled correctly

---

# 👨‍💻 Author

FunGeek – Jeremiah Bankole
