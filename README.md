Bitespeed Backend Task: Identity Reconciliation
==================================================

🌐 Hosted Backend Link
----------------------

🔗 **Try it out now**: [Bitespeed Backend API](https://bite-speed-backend.onrender.com/identify)

(Make POST requests with JSON payloads to /identify.)

💻 Tech Stack
-------------

*   **Backend Framework**: Node.js

*   **Database**: PostgreSQL

*   **ORM**: Prisma


🛠️ Running Locally
-------------------

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/rachitk05/Bite-Speed-Backend.git
cd Bite-Speed-Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory with the following values:
```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
PORT=3001
```

### 4. Apply Prisma Migrations
Run the following command to apply Prisma migrations:
```bash
npx prisma migrate dev
```

### 5. Run the Server
Start the server using the following command:

```bash
npm start
```

### 6. Test the Endpoint
Use tools like Postman or cURL to send a `POST` request to the following URL:

```bash
http://localhost:3001/identify
```

🧪 Examples
----------------

**Request**:

`POST /identify
{
    "email": "example@example.com",
    "phoneNumber": "1234567890"
}`

**Response**:

`{
    "contact": {
        "primaryContactId": 1,
        "emails": ["example@example.com"],
        "phoneNumbers": ["1234567890"],
        "secondaryContactIds": []
    }
}`

📂 Project Structure
--------------------

*   **/prisma**: Contains the Prisma schema for database modeling.

*   **/src**: Main source code, including controllers, routes, and database logic.

*   **/index.ts**: Entry point of the application.


🚀 Deployed Link
----------------

🔗 **API**: [Bitespeed Backend API](https://bite-speed-backend.onrender.com/identify)
