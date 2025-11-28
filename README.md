# Effective Computing Machine

A simple REST API for user management built with Express.js.

## Features

- Create users (POST /api/users)
- Get all users with pagination and search (GET /api/users?page=1&limit=10&search=term)
- Get user by ID (GET /api/users/:id)
- Update user (PUT /api/users/:id)
- Delete users (DELETE /api/users/:id)
- Health check endpoint (GET /health)
- Email validation
- Input sanitization
- Duplicate email prevention
- Request logging with request ID tracking
- Rate limiting
- CORS support
- Error handling
- Timestamps (createdAt, updatedAt)
- Request ID middleware for tracing

## Getting Started

### Installation

```bash
npm install
cp env.example .env
```

### Node.js Version

The project targets Node.js `18.18.2` (see `.nvmrc`). Use `nvm use` to match the expected runtime before running scripts.

### Environment Variables

| Name | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port used by the Express server | `3000` |
| `NODE_ENV` | Runtime environment flag (`development`, `test`, `production`) | `development` |
| `CORS_ORIGIN` | Allowed origin(s) for CORS | `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests allowed per window | `100` |
| `REQUEST_BODY_LIMIT` | Maximum JSON payload size | `10mb` |
| `MAINTENANCE_MODE` | Enable maintenance mode responses | `false` |
| `MAINTENANCE_MESSAGE` | Message returned during maintenance | `Service temporarily unavailable` |
| `MAINTENANCE_ALLOW_HEALTH` | Allow health endpoints while in maintenance | `true` |
| `MAINTENANCE_RETRY_AFTER` | Retry-After hint (seconds) | `60` |
| `LOG_LEVEL` | Logging level (`info`, `silent`) | `info` |

### Running Locally

```bash
# Start the API
npm start

# Development mode with auto-reload
npm run dev
```

The server listens on `http://localhost:3000` by default. Visit `/` for service metadata and `/health` for a health report.

### Project Scripts

```bash
npm run lint        # Static analysis
npm run lint:fix    # Auto-fix lint issues
npm test            # Run Jest test suite
```

## API Reference

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users` | List users with pagination, searching, and filtering |
| `GET` | `/api/users/:id` | Retrieve a single user |
| `GET` | `/api/users/summary` | Aggregated counts by role and status |
| `GET` | `/api/users/export` | Download the user list as CSV |
| `POST` | `/api/users` | Create a user |
| `PUT` | `/api/users/:id` | Update an existing user |
| `DELETE` | `/api/users/:id` | Remove a user |

#### Listing users

```
GET /api/users?page=1&limit=20&search=doe&role=admin&status=active
```

Response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 1
  },
  "filters": {
    "search": "doe",
    "role": "admin",
    "status": "active"
  }
}
```

Available query parameters:

- `page`, `limit` — pagination controls
- `search` — matches name or email (case-insensitive)
- `role`, `status` — exact matches based on allowed enums
- `createdAfter`, `createdBefore` — ISO timestamps bounding `createdAt`
- `updatedAfter`, `updatedBefore` — ISO timestamps bounding `updatedAt`
- `sort` — one of `createdAt`, `updatedAt`, `name`
- `direction` — `asc` or `desc` (defaults to `desc`)

See `docs/sample-requests.http` for quick REST Client examples.

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Basic status payload with uptime and metadata |
| `GET` | `/health/live` | Minimal liveness probe |
| `GET` | `/health/ready` | Readiness probe that surfaces dependency info |

## Development Tips

- Use the included request logging (with `X-Request-ID`) to trace requests end-to-end.
- Set `LOG_LEVEL=silent` to disable request logging in noisy environments.
- Rate limiting and CORS settings can be adjusted via environment variables for different environments.
- Tests rely on Jest with Supertest, making it easy to expand coverage with additional API scenarios.
- Sample records live in `data/seed.json`; modify this file to pre-load users whenever the service starts.
- See `CONTRIBUTING.md` for guidelines on proposing changes.

## Recent Updates (v0.3.0)

- Added ESLint configuration
- Added helper utilities for response formatting
- Extended configuration with rate limit and CORS settings
- Added validation utility tests
- Improved code quality and maintainability
- See `CHANGELOG.md` for ongoing improvements.
- Enhanced code documentation with JSDoc comments

