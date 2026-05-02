# Comprehensive API Documentation

This document outlines the endpoints, request payloads, and expected success/error responses for the backend API.

## Base URL
All API endpoints are prefixed with `/api`.
*(Example: `http://localhost:5000/api`)*

## Global Error Responses
Almost all endpoints follow a standard error response structure if something goes wrong:
```json
// General Error (500 Server Error, 404 Not Found, 401 Unauthorized, 403 Forbidden)
{
  "success": false,
  "message": "Error message describing the issue."
}

// Validation Error (400 Bad Request - typically for creation endpoints)
{
  "success": false,
  "errors": ["Field X is required", "Invalid format for Y"],
  "message": "Urgent fields missing"
}
```

---

## 1. User Authentication (`/api/user/auth`)

### Register (Step 1)
- **Endpoint**: `POST /register`
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "city": "Mumbai",
    "userType": "investor",
    "password": "strongPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully.",
    "tempToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  { "success": false, "message": "All fields are required." } // or "User already exists."
  ```

### Verify OTP (Step 2)
- **Endpoint**: `POST /register/verify`
- **Payload**:
  ```json
  {
    "otp": "123456",
    "tempToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "accessToken": "eyJhb...",
    "refreshToken": "eyJhb...",
    "user": {
      "id": "60d21...",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "1234567890",
      "role": "user",
      "isVerified": true
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  { "success": false, "message": "Invalid or expired OTP." }
  ```

### Login
- **Endpoint**: `POST /login`
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "accessToken": "eyJhb...",
    "refreshToken": "eyJhb...",
    "user": { ... }
  }
  ```
- **Error Response (401 Unauthorized / 403 Forbidden)**:
  ```json
  { "success": false, "message": "Invalid credentials." }
  // OR if not verified
  { "success": false, "sendotp": true, "message": "Please verify account first." }
  ```

### Refresh Token
- **Endpoint**: `POST /refresh`
- **Payload**:
  ```json
  {
    "token": "<refresh_token_here>"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "accessToken": "eyJhb...",
    "refreshToken": "eyJhb..."
  }
  ```

### Logout (Requires Auth)
- **Endpoint**: `POST /logout`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Success Response (200 OK)**:
  ```json
  { "success": true, "message": "Logged out successfully." }
  ```

### Forgot Password Flow
- **Send OTP**: `POST /password/send-otp` (Payload: `{ "email": "user@example.com" }`)
  - **Success**: `{ "success": true, "message": "Reset OTP sent." }`
- **Resend OTP**: `POST /password/resend-otp` (Payload: `{ "email": "user@example.com" }`)
  - **Success**: `{ "success": true, "message": "OTP resent successfully." }`
- **Reset Password**: `POST /password/reset` (Payload: `{ "email": "test@test.com", "otp": "123456", "newPassword": "new123" }`)
  - **Success**: `{ "success": true, "message": "Password reset successful." }`
  - **Error (400)**: `{ "success": false, "message": "Invalid OTP." }`

---

## 2. Admin Authentication (`/api/admin/auth`)
*Follows the exact same structure as User Authentication. The endpoints are identical but prefixed with `/admin/auth` instead of `/user/auth`.*

---

## 3. Admin Management (Requires Auth + Admin Role)
**Headers**: `Authorization: Bearer <accessToken>`

### Create Property
- **Endpoint**: `POST /api/admin/properties`
- **Payload (JSON)**:
  ```json
  {
    "title": "Luxury Villa",
    "description": "Beautiful 4BHK villa...",
    "price": 15000000,
    "purpose": "sale",
    "proprtyType": "residential",
    "category": "house/villa",
    "configuration": "4BHK",
    "location": { "city": "Mumbai", "address": "Andheri West" },
    "area": { "value": 2500, "unit": "sqft" },
    "amenities": ["Pool", "Gym"],
    "tags": ["Luxury", "Sea View"],
    "propertyAvailability": true,
    "isFeatured": false
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Property created successfully",
    "data": { "_id": "60d...", "title": "Luxury Villa", "status": "active", ... }
  }
  ```

### Get All Properties
- **Endpoint**: `GET /api/admin/properties`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 10,
    "data": [ { ...property_1 }, { ...property_2 } ]
  }
  ```

### Upload Property Media
- **Endpoint**: `PATCH /api/admin/properties/:id/media`
- **Headers**: `Content-Type: multipart/form-data`
- **Payload**: FormData containing `coverImage`, `brochure`, `gallery` (multiple), `video`.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Property media uploaded successfully",
    "data": { ...updated_property_with_media_urls... }
  }
  ```

### Toggle Property Status
- **Endpoint**: `PATCH /api/admin/properties/:id/toggle`
- **Success Response (200 OK)**:
  ```json
  { "success": true, "message": "Property status updated", "data": { ... } }
  ```

### Delete Property
- **Endpoint**: `DELETE /api/admin/properties/:id`
- **Success Response (200 OK)**:
  ```json
  { "success": true, "message": "Property and all associated media deleted successfully" }
  ```

*(Note: The endpoints for **Admin Projects** `/api/admin/projects` mirror the Property endpoints perfectly, including creation, toggling, media uploads, and deletion.)*

---

## 4. User Endpoints (Requires Auth)
**Headers**: `Authorization: Bearer <accessToken>`

### User Favorites (`/api/user/favorites`)
- **Get Favorites**: `GET /`
  - **Success**: `{ "success": true, "count": 2, "data": [ { "itemId": {...populated_doc...}, "itemType": "Property" } ] }`
- **Toggle Favorite**: `POST /toggle`
  - **Payload**: `{ "itemId": "60d...", "itemType": "Property" }`
  - **Success (Added)**: `{ "success": true, "message": "Added to favorites", "isFavourite": true, "data": {...} }`
  - **Success (Removed)**: `{ "success": true, "message": "Removed from favorites", "isFavourite": false }`
  - **Error (400)**: `{ "success": false, "message": "Invalid item type. Must be Property or Project." }`

### User Properties (`/api/user/properties`)
- **Get Filtered Properties**: `GET /`
  - **Query Parameters**: `city`, `state`, `purpose`, `category`, `proprtyType`, `minPrice`, `maxPrice`, `minArea`, `maxArea`, `amenities`, `tags`, `search`, `page`, `limit`, `sort`.
  - **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "total": 50,
      "page": 1,
      "pages": 5,
      "count": 10,
      "data": [ { ...property_objects... } ]
    }
    ```
- **Get Single Property**: `GET /:id`
  - **Success Response (200 OK)**: `{ "success": true, "data": { ...property... } }`
  - **Error Response (404 Not Found)**: `{ "success": false, "message": "Property not found" }`

### User Projects (`/api/user/projects`)
- **Get Filtered Projects**: `GET /`
  - **Query Parameters**: `title`, `city`, `minPrice`, `maxPrice`, `projectStatus`, `availabilityStatus`, `isFeatured`.
  - **Success Response (200 OK)**: `{ "success": true, "count": 5, "data": [ ...project_objects... ] }`
- **Get Single Project**: `GET /:id`
  - **Success**: `{ "success": true, "data": { ...project... } }`
  - **Error**: `{ "success": false, "message": "Project not found" }`
