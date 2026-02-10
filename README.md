# Meeting Scheduler Backend

A production-ready Node.js/Express backend API for scheduling meetings with built-in overlap detection to prevent conflicting time slots.

## Features

- ✅ User management (create, read, list)
- ✅ Meeting scheduling with full CRUD operations
- ✅ **Automatic overlap detection** - prevents double-booking per user
- ✅ Date range filtering on meetings
- ✅ Input validation (Joi + custom validators)
- ✅ Centralized error handling
- ✅ Structured logging with Winston
- ✅ PostgreSQL with Sequelize ORM
- ✅ UUID primary keys
- ✅ CORS and security headers (Helmet)
- ✅ Gzip compression

## Prerequisites

- Node.js 16.x or higher
- PostgreSQL 12.x or higher
- npm or yarn

## Installation

1. **Clone the repository**
    git clone <repository-url>
    cd meeting-scheduler-backend

2. **Install dependencies**
    npm install

3. **Set up environment variables**
    cp .env.example .env

Edit `.env` with your configuration:
    NODE_ENV=development
    PORT=3000
    LOG_LEVEL=info
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=meeting_scheduler
    DB_USER=postgres
    DB_PASSWORD=your_db_password

4. **Create PostgreSQL database**
    createdb meeting_scheduler

5. **Run migrations** (Sequelize auto-syncs on startup)
    npm run migrate

## Running the Application

### Development Mode (with auto-reload)
    npm run dev

### Production Mode
    npm start

The API will start on `http://localhost:3000/api`

## API Documentation

### Base URL
    http://localhost:3000/api

### User Endpoints

#### Create User
    POST /users
    Content-Type: application/json

Request body:
    {
      "name": "John Doe",
      "email": "john@example.com"
    }

Response (201 Created):
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }

#### Get User
    GET /users/:id

Response (200 OK):
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }

#### List All Users
    GET /users

Response (200 OK):
    {
      "data": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "total": 1
    }

### Meeting Endpoints

#### Create Meeting
    POST /meetings
    Content-Type: application/json

Request body:
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Team Standup",
      "startTime": "2024-01-20T09:00:00Z",
      "endTime": "2024-01-20T09:30:00Z"
    }

Response (201 Created):
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Team Standup",
      "startTime": "2024-01-20T09:00:00Z",
      "endTime": "2024-01-20T09:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }

Response (400 Bad Request - Time Conflict):
    {
      "status": "error",
      "code": "SCHEDULING_CONFLICT",
      "message": "Time slot already booked"
    }

#### Get Meeting
    GET /meetings/:id

Response (200 OK):
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Team Standup",
      "startTime": "2024-01-20T09:00:00Z",
      "endTime": "2024-01-20T09:30:00Z"
    }

#### List Meetings (with optional filters)
    GET /meetings?userId=550e8400-e29b-41d4-a716-446655440000&startDate=2024-01-20&endDate=2024-01-25

Query Parameters:
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter meetings on or after this date (YYYY-MM-DD)
- `endDate` (optional): Filter meetings on or before this date (YYYY-MM-DD)

Response (200 OK):
    {
      "data": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "userId": "550e8400-e29b-41d4-a716-446655440000",
          "title": "Team Standup",
          "startTime": "2024-01-20T09:00:00Z",
          "endTime": "2024-01-20T09:30:00Z"
        }
      ],
      "total": 1
    }

#### Update Meeting
    PUT /meetings/:id
    Content-Type: application/json

Request body:
    {
      "title": "Team Standup (Updated)",
      "startTime": "2024-01-20T10:00:00Z",
      "endTime": "2024-01-20T10:30:00Z"
    }

Response (200 OK):
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Team Standup (Updated)",
      "startTime": "2024-01-20T10:00:00Z",
      "endTime": "2024-01-20T10:30:00Z"
    }

#### Delete Meeting
    DELETE /meetings/:id

Response (204 No Content)

## Overlap Detection Logic

The system prevents scheduling conflicts using this algorithm:

    Conflict detected if:
    existing.startTime < new.endTime AND existing.endTime > new.startTime

Example scenarios (all for the same user):

Existing: 09:00-10:00
- New 08:30-09:15 → ❌ CONFLICT (overlaps by 15 minutes)
- New 09:30-10:30 → ❌ CONFLICT (overlaps by 30 minutes)
- New 10:00-11:00 → ✅ OK (adjacent, no overlap)
- New 08:00-09:00 → ✅ OK (adjacent, no overlap)
- New 08:00-11:00 → ❌ CONFLICT (contains entire slot)

When updating a meeting, the current meeting is excluded from conflict detection, allowing you to adjust times without false conflicts.

## Error Handling

The API returns standardized error responses:

### 400 Bad Request
    {
      "status": "error",
      "code": "VALIDATION_ERROR",
      "message": "Invalid input provided",
      "details": {
        "field": "email",
        "message": "must be a valid email"
      }
    }

### 404 Not Found
    {
      "status": "error",
      "code": "NOT_FOUND",
      "message": "Resource not found"
    }

### 500 Internal Server Error
    {
      "status": "error",
      "code": "INTERNAL_ERROR",
      "message": "An unexpected error occurred"
    }

## Database Schema

### Users Table
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX idx_users_email ON users(email);

### Meetings Table
    CREATE TABLE meetings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      "startTime" TIMESTAMP NOT NULL,
      "endTime" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX idx_meetings_user_start ON meetings("userId", "startTime");
    CREATE INDEX idx_meetings_start ON meetings("startTime");
    CREATE INDEX idx_meetings_end ON meetings("endTime");

## Project Structure

    src/
    ├── server.js                 # Express server startup
    ├── app.js                    # Express app configuration
    ├── config/
    │   ├── database.js           # Sequelize database config
    │   └── constants.js          # Application constants
    ├── utils/
    │   ├── logger.js             # Winston logging utility
    │   └── validators.js         # Custom validators
    ├── middlewares/
    │   ├── errorHandler.js       # Centralized error handling
    │   └── validateRequest.js    # Request validation middleware
    └── modules/
        ├── user/
        │   ├── index.js
        │   ├── model.js          # User Sequelize model
        │   ├── dto.js            # Joi validation schemas
        │   ├── service.js        # User business logic
        │   ├── interface.js      # User controllers
        │   └── routes.js         # User API routes
        └── meeting/
            ├── index.js
            ├── model.js          # Meeting Sequelize model
            ├── dto.js            # Joi validation schemas
            ├── service.js        # Meeting business logic + overlap detection
            ├── interface.js      # Meeting controllers
            └── routes.js         # Meeting API routes

## Troubleshooting

### Connection Refused Error
**Problem:** `ECONNREFUSED` on localhost:5432

**Solution:**
1. Verify PostgreSQL is running:
    sudo systemctl status postgresql
2. Check connection settings in `.env`
3. Ensure database exists:
    psql -U postgres -c "CREATE DATABASE meeting_scheduler;"

### Email Already Exists Error
**Problem:** Error when creating user with existing email

**Solution:**
This is expected behavior - emails are unique. Use a different email or delete the user first.

### Overlap Detection Not Working
**Problem:** Meetings with overlapping times are being created

**Solution:**
1. Verify meetings are for the same `userId`
2. Check time zone settings - use UTC format
3. Ensure `startTime` < `endTime`
4. Check database indexes are created

### Port Already in Use
**Problem:** `EADDRINUSE` error

**Solution:**
1. Change PORT in `.env`
2. Or kill process using the port:
    lsof -i :3000
    kill -9 <PID>

## Development

### Running Linter
    npm run lint

### Running Tests
    npm test

### Database Migrations
    npm run migrate
    npm run migrate:undo

## Performance Considerations

- Composite index on (userId, startTime) for fast overlap detection
- Individual indexes on startTime and endTime for date filtering
- UUID keys prevent sequential enumeration
- Gzip compression enabled
- Database connection pooling via Sequelize

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- UUID primary keys (no enumeration)
- Email uniqueness enforcement
- Centralized error handling (no stack traces in production)
- Environment-based error verbosity

## License

MIT

## Support

For issues or questions, please contact the development team or submit an issue in the repository.
