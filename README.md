# Effective Computing Machine

A simple REST API for user management built with Express.js.

## Features

- Create users (POST /api/users)
- Get all users with pagination (GET /api/users?page=1&limit=10)
- Get user by ID (GET /api/users/:id)
- Update user (PUT /api/users/:id)
- Delete users (DELETE /api/users/:id)
- Health check endpoint (GET /health)
- Email validation
- Input sanitization
- Duplicate email prevention
- Request logging
- Rate limiting
- CORS support
- Error handling
- Timestamps (createdAt, updatedAt)

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

The server will run on port 3000 by default (configurable via PORT environment variable).

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
npm run lint:fix
```

## Recent Updates (v0.3.0)

- Added ESLint configuration
- Added helper utilities for response formatting
- Extended configuration with rate limit and CORS settings
- Added validation utility tests
- Improved code quality and maintainability

