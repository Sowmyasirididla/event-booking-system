#  Event Booking System API

A backend service built with **Node.js**, **Express**, and **MySQL** that allows:

* User & Admin authentication
* Event creation (Admin only)
* Seat booking with transaction safety
* Booking cancellation
* Prevention of double-booking
* SQL row-level locking & transactions

This project demonstrates **real-world backend engineering**, **SQL schema design**, and **API development**.

---

## Tech Stack

* **Node.js**
* **Express.js**
* **MySQL** (mysql2/promise)
* **JWT Authentication**
* **BCrypt Password Hashing**
* **RESTful API Architecture**
* **SQL Transactions + SELECT … FOR UPDATE**

---

## Project Setup

### Clone the repo

```
git clone <your-repo-url>
cd event-booking-api
```

###  Install dependencies

```
npm install
```

###  Create `.env` file

Create a `.env` file in the root folder:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=eventdb
JWT_SECRET=mySuperStrongSecret123
JWT_EXPIRES_IN=1d
```

###  Create MySQL database & tables

Run this in MySQL Workbench or phpMyAdmin:

```sql
CREATE DATABASE IF NOT EXISTS eventdb;
USE eventdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  event_date DATETIME,
  total_seats INT,
  seats_available INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
  status ENUM('booked','cancelled') DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_event (user_id, event_id, status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

###  Start server

```
node server.js
```

or

```
npx nodemon server.js
```

Server will run at:
 **[http://localhost:5000](http://localhost:5000)**

---

#  Authentication (JWT)

### Register

POST `/auth/register`

```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login

POST `/auth/login`
→ Returns JWT token
Use in header:

```
Authorization: Bearer <your-token>
```

---

#  Events API

### Create Event (Admin only)

POST `/events`
Headers: `Authorization: Bearer <admin-token>`

```json
{
  "title": "Music Concert",
  "description": "Live show",
  "event_date": "2025-01-15 18:00:00",
  "total_seats": 100
}
```

### List Events

GET `/events`

### Get Event By ID

GET `/events/:id`

### Update Event (Admin)

PUT `/events/:id`

### Delete Event (Admin)

DELETE `/events/:id`

---

#  Bookings API

### Book a Seat

POST `/bookings/book/:eventId`
Header: `Authorization: Bearer <user-token>`

### Cancel Booking

POST `/bookings/cancel/:bookingId`
Header: `Authorization: Bearer <user-token>`

### User Bookings

GET `/bookings/me`
Header: `Authorization: Bearer <user-token>`

---

#  Key Features (Interview Talking Points)

###  SQL Transactions

Booking + seat decrement happens inside:

* `BEGIN`
* `SELECT … FOR UPDATE` (locks event row)
* `UPDATE seats_available`
* `INSERT booking`
* `COMMIT`

Prevents race conditions & overselling.

###  Prevent Double Booking

Unique combination of:

* App-level check
* `UNIQUE KEY uq_user_event (user_id, event_id, status)`

### Clean Node.js Architecture

Follows:

* **models/**
* **controllers/**
* **routes/**
* **middleware/**
* **config/**

### ✔ Role-Based Access Control

Admin can create/update/delete events.
Users can book/cancel seats.

---

# Project Structure

```
/config
   db.js
/controllers
   authController.js
   eventController.js
   bookingController.js
/middleware
   auth.js
   role.js
/models
   userModel.js
   eventModel.js
   bookingModel.js
/routes
   authRoutes.js
   eventRoutes.js
   bookingRoutes.js
server.js
.env
```
---

#  Author

Sowmya Siri

---

If you want, I can also generate:

✅ Postman Collection JSON
✅ Database Schema Diagram
✅ 1-minute interview explanation

Just tell me!
