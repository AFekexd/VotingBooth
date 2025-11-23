# VotingBooth Backend API

A RESTful backend API for anonymous voting built with Express.js, Node.js, MySQL, and Prisma. This project demonstrates CRUD operations for educational purposes.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Prisma** - ORM
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VotingBooth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update with your MySQL credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/voting_booth"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
   
   Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Votes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/votes` | Get all votes |
| GET | `/api/v1/votes/:id` | Get single vote by ID |
| POST | `/api/v1/votes` | Create new vote |
| PUT | `/api/v1/votes/:id` | Update vote |
| DELETE | `/api/v1/votes/:id` | Delete vote |
| GET | `/api/v1/votes/:id/results` | Get vote results with percentages |
| POST | `/api/v1/votes/:id/cast` | Cast a vote |

## 📝 API Usage Examples

### Create a Vote
```bash
POST /api/v1/votes
Content-Type: application/json

{
  "title": "What's your favorite programming language?",
  "description": "Vote for your preferred language",
  "options": [
    { "optionText": "JavaScript" },
    { "optionText": "Python" },
    { "optionText": "Java" },
    { "optionText": "Go" }
  ]
}
```

### Cast a Vote
```bash
POST /api/v1/votes/1/cast
Content-Type: application/json

{
  "optionId": 2
}
```

### Get Vote Results
```bash
GET /api/v1/votes/1/results
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "What's your favorite programming language?",
    "totalVotes": 150,
    "options": [
      {
        "id": 2,
        "optionText": "Python",
        "voteCount": 60,
        "percentage": "40.00"
      },
      {
        "id": 1,
        "optionText": "JavaScript",
        "voteCount": 50,
        "percentage": "33.33"
      }
    ]
  }
}
```

## 🗂️ Project Structure

```
VotingBooth/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client
│   ├── controllers/
│   │   └── voteController.js  # Vote business logic
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling
│   │   └── validator.js       # Validation middleware
│   ├── routes/
│   │   └── voteRoutes.js      # API routes
│   ├── utils/
│   │   └── AppError.js        # Custom error class
│   ├── validators/
│   │   └── voteValidators.js  # Input validation rules
│   └── server.js              # Express app entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Votes Table
- `id` - Auto-increment primary key
- `title` - Vote question (required)
- `description` - Optional description
- `isActive` - Boolean flag for active/closed votes
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
- `closedAt` - Optional closing timestamp

### Options Table
- `id` - Auto-increment primary key
- `voteId` - Foreign key to votes
- `optionText` - The choice text
- `voteCount` - Number of votes (default: 0)
- `createdAt` - Timestamp

## 🔧 Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## ✨ Features

- ✅ Full CRUD operations for votes
- ✅ Anonymous voting (no user tracking)
- ✅ Real-time vote counting
- ✅ Percentage calculation for results
- ✅ Input validation
- ✅ Error handling
- ✅ CORS support
- ✅ Request logging
- ✅ Active/inactive vote status

## 🎓 Educational Purpose

This project is designed for learning:
- RESTful API design
- CRUD operations
- Database relationships with Prisma
- Express.js middleware
- Input validation
- Error handling patterns
- MySQL integration

## 📄 License

ISC

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!
