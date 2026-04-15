# 🚀 HNG Backend Task – Stage 0 & Stage 1 API

## 📌 Overview

This project implements a backend API that:

* **Stage 0:** Classifies a given name by gender using the Genderize API
* **Stage 1:** Creates and stores a complete user profile by aggregating data from multiple external APIs

The system integrates with:

* Genderize (gender prediction)
* Agify (age prediction)
* Nationalize (nationality prediction)

It processes, validates, and persists structured results while ensuring idempotency.

---

## 🌐 Live API

```bash
https://name-classification-api.vercel.app
```

### Example Endpoints

```bash
GET  /api/classify?name=john
POST /api/profiles
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* Axios
* lowdb (JSON database)
* UUID
* CORS
* dotenv

---

## 📁 Project Structure

```
name-classification-api/
│
├── src/
│   ├── routes/
│   │   ├── classify.route.js
│   │   └── profile.route.js
│   │
│   ├── services/
│   │   ├── genderize.service.js
│   │   └── profile.service.js
│   │
│   └── utils/
│       ├── helpers.js
│       └── db.js
│
├── db.json
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

# 🔵 Stage 1 – Profile Creation & Persistence

## 📥 Endpoint

### POST `/api/profiles`

### Request Body

```json
{
  "name": "james"
}
```

---

## ✅ Success Response (New Profile)

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

## 🔁 Idempotent Response (Existing Profile)

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

## ❌ Error Responses

### 400 – Missing Name

```json
{
  "status": "error",
  "message": "Name is required"
}
```

### 422 – Invalid Name Type

```json
{
  "status": "error",
  "message": "Name must be a string"
}
```

### 422 – No Prediction Available

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

### 502 – External API Failure

```json
{
  "status": "error",
  "message": "Failed to fetch external APIs"
}
```

---

## 🧠 Processing Logic

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

* Extract:

  * List of countries
* Select:

  * Country with highest probability → `country_id`

---

## 💾 Data Persistence

* Profiles are stored in a local JSON database (`db.json`)
* Each profile includes:

  * UUID
  * Processed fields
  * UTC timestamp

---

## 🔁 Idempotency

* Submitting the same name multiple times does **not create duplicates**
* Existing record is returned instead

---

## ⚡ Performance Notes

* External API calls are executed in parallel using `Promise.all`
* Response time optimized for efficiency
* Lightweight storage ensures fast read/write operations

---

## 🔐 CORS

```
Access-Control-Allow-Origin: *
```

---

## 🚀 Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start server

```bash
npm run dev
```

### 3. Test endpoints

```bash
http://localhost:3000/api/classify?name=john
```

---

## 🌍 Deployment

Supported platforms:

* Vercel
* Railway
* Heroku
* AWS

---

## 🧪 Testing Checklist

* Valid request returns correct structure
* Duplicate name returns existing profile
* Missing name → 400 error
* Invalid type → 422 error
* Invalid predictions → 422 error
* API failure → 502 error

---

## 👨‍💻 Author

FunGeek – Jeremiah Bankole
