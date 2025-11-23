# VotingBooth API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Response Format

All responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Only for list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "..." // Only in development mode
  }
}
```

---

## Endpoints

### 1. Get All Votes

Retrieve all votes with their options.

**Endpoint:** `GET /votes`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "What's your favorite programming language?",
      "description": "Vote for your preferred language",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "closedAt": null,
      "options": [
        {
          "id": 1,
          "voteId": 1,
          "optionText": "JavaScript",
          "voteCount": 45,
          "createdAt": "2024-01-15T10:30:00.000Z"
        },
        {
          "id": 2,
          "voteId": 1,
          "optionText": "Python",
          "voteCount": 60,
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  ]
}
```

---

### 2. Get Single Vote

Retrieve a specific vote by ID.

**Endpoint:** `GET /votes/:id`

**Parameters:**
- `id` (integer, required) - Vote ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "What's your favorite programming language?",
    "description": "Vote for your preferred language",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "closedAt": null,
    "options": [...]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Vote not found"
  }
}
```

---

### 3. Create New Vote

Create a new vote with options.

**Endpoint:** `POST /votes`

**Request Body:**
```json
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

**Validation Rules:**
- `title` (string, required) - Max 255 characters
- `description` (string, optional)
- `options` (array, required) - Minimum 2 options
- `options[].optionText` (string, required) - Cannot be empty

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "What's your favorite programming language?",
    "description": "Vote for your preferred language",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "closedAt": null,
    "options": [
      {
        "id": 1,
        "voteId": 1,
        "optionText": "JavaScript",
        "voteCount": 0,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "At least 2 options are required"
  }
}
```

---

### 4. Update Vote

Update an existing vote's details.

**Endpoint:** `PUT /votes/:id`

**Parameters:**
- `id` (integer, required) - Vote ID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "isActive": false
}
```

**Validation Rules:**
- `title` (string, optional) - Max 255 characters
- `description` (string, optional)
- `isActive` (boolean, optional)

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "isActive": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "closedAt": null,
    "options": [...]
  }
}
```

---

### 5. Delete Vote

Delete a vote and all its options (cascade delete).

**Endpoint:** `DELETE /votes/:id`

**Parameters:**
- `id` (integer, required) - Vote ID

**Response:**
```json
{
  "success": true,
  "message": "Vote deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Vote not found"
  }
}
```

---

### 6. Get Vote Results

Get vote results with percentages and total vote count.

**Endpoint:** `GET /votes/:id/results`

**Parameters:**
- `id` (integer, required) - Vote ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "What's your favorite programming language?",
    "description": "Vote for your preferred language",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "closedAt": null,
    "totalVotes": 150,
    "options": [
      {
        "id": 2,
        "voteId": 1,
        "optionText": "Python",
        "voteCount": 60,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "percentage": "40.00"
      },
      {
        "id": 1,
        "voteId": 1,
        "optionText": "JavaScript",
        "voteCount": 50,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "percentage": "33.33"
      },
      {
        "id": 3,
        "voteId": 1,
        "optionText": "Java",
        "voteCount": 30,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "percentage": "20.00"
      },
      {
        "id": 4,
        "voteId": 1,
        "optionText": "Go",
        "voteCount": 10,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "percentage": "6.67"
      }
    ]
  }
}
```

**Note:** Options are sorted by vote count in descending order.

---

### 7. Cast a Vote

Cast an anonymous vote for a specific option.

**Endpoint:** `POST /votes/:id/cast`

**Parameters:**
- `id` (integer, required) - Vote ID

**Request Body:**
```json
{
  "optionId": 2
}
```

**Validation Rules:**
- `optionId` (integer, required) - Must be a valid option ID for this vote

**Response:**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "data": {
    "id": 2,
    "voteId": 1,
    "optionText": "Python",
    "voteCount": 61,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**Vote not found (404):**
```json
{
  "success": false,
  "error": {
    "message": "Vote not found"
  }
}
```

**Vote is closed (400):**
```json
{
  "success": false,
  "error": {
    "message": "This vote is closed"
  }
}
```

**Invalid option (400):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid option for this vote"
  }
}
```

---

## Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "VotingBooth API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Testing with cURL

### Create a vote:
```bash
curl -X POST http://localhost:3000/api/v1/votes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best JavaScript Framework?",
    "description": "Vote for your favorite",
    "options": [
      {"optionText": "React"},
      {"optionText": "Vue"},
      {"optionText": "Angular"}
    ]
  }'
```

### Cast a vote:
```bash
curl -X POST http://localhost:3000/api/v1/votes/1/cast \
  -H "Content-Type: application/json" \
  -d '{"optionId": 1}'
```

### Get results:
```bash
curl http://localhost:3000/api/v1/votes/1/results
```

---

## Notes

- All votes are **anonymous** - no user tracking
- Vote counts are incremented atomically
- Options are cascade deleted when a vote is deleted
- Closed votes (isActive: false) cannot receive new votes
- Timestamps are in ISO 8601 format (UTC)
