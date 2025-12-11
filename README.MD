gold health README


This week 10 assignment is a Health Tracker web application built using Node.js, Express, MySQL, and EJS templates. The application allows users to register an account, log in securely, and view or manage personal health entries. All user data is stored in a MySQL database, and each user can only access their own entries through session-based authentication.

Features:
**user authentication**
Secure user registration with:
Username validation (4–20 characters)
Valid email address check
Passwords hashed using bcrypt
Login system checks stored hashed passwords
Session management using express-session
Middleware (redirectLogin) ensures only logged-in users can access protected routes

**user accounts**
User information stored in a MySQL database (users table)
Includes:
id
username
email
password (hashed)

**health entries**
Each user can view only their own entries
Entries are linked through user_id
Protected routes to prevent unauthorised access


**input sanitization**
Input is sanitized using middleware to prevent injection attacks
User-submitted data is cleaned before insertion into the database


what was used:
Node.js
Express.js
EJS for templating
MySQL / mysql2 driver
express-session for login persistence
bcrypt for password hashing
express-validator for form validation
express-sanitizer for cleaning user input

how to run the app:
npm install
the app is forever running on the VM. links are inside the links.txt file.
and node index.js in terminal to start running it on localhost.
its open on port 8000.
