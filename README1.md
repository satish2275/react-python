# React + Python + PostgreSQL App

A simple full-stack application with React frontend, Python Flask backend, and PostgreSQL database.

## Features

- User authentication (register/login/logout)
- Session-based authentication
- Create and view posts
- PostgreSQL database
- RESTful API
- Responsive UI with Tailwind CSS

## Project Structure

```
project/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker container config
├── docker-compose.yml # Multi-container setup
├── package.json       # React dependencies
├── src/
│   └── App.js         # React frontend
└── README.md
```

## Quick Start with Docker

1. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd <project-folder>
   ```

2. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Backend API: http://localhost:5000
   - Database: localhost:5432

## Manual Setup

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup PostgreSQL:**
   ```bash
   # Install PostgreSQL
   # Create database
   createdb myapp
   ```

3. **Set environment variables:**
   ```bash
   export DB_HOST=localhost
   export DB_NAME=myapp
   export DB_USER=postgres
   export DB_PASSWORD=password
   export SECRET_KEY=your-secret-key
   ```

4. **Run the backend:**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start React development server:**
   ```bash
   npm start
   ```

3. **Access frontend:** http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (authenticated)
- `POST /api/posts` - Create new post (authenticated)

### Health Check
- `GET /api/health` - API health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_NAME` | Database name | myapp |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | password |
| `DB_PORT` | Database port | 5432 |
| `SECRET_KEY` | Flask secret key | dev-secret-key |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CORS protection
- Input validation
- SQL injection protection with parameterized queries

## Development

### Backend Development
- Flask with auto-reload: `flask run --debug`
- Database migrations: Handled automatically on startup

### Frontend Development  
- React hot reload: `npm start`
- Build for production: `npm run build`

## Production Deployment

1. **Set production environment variables**
2. **Use production database credentials**
3. **Build React app:** `npm run build`
4. **Serve React build with Flask or nginx**
5. **Use production WSGI server like Gunicorn**

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

### CORS Issues
- Frontend and backend on different ports
- Check CORS configuration in Flask

### Authentication Issues
- Check session configuration
- Verify cookie settings
- Ensure HTTPS in production

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License