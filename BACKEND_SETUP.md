# Backend Setup Guide - Daily Task Management

## 📁 Backend Folder Structure (Configured)

```
Backend_daily-task-management/
├── server.js                    ✅ Express server entry point
└── src/
    ├── app.js                   ✅ Express app with middleware & routes
    ├── config/
    │   └── database.js          ✅ Prisma client configuration
    ├── controllers/
    │   └── taskController.js    ✅ 9 task handlers with validation
    ├── routes/
    │   └── tasks.js             ✅ 9 API endpoints
    ├── middlewares/
    └── services/
```

## 🚀 Quick Start

### Step 1: Install Dependencies
Open Command Prompt (cmd.exe) and run:
```bash
cd "c:\Users\Ritesh Upadhyay\OneDrive - Appyzie\Documents\Daily-Task-Management"
npm install
```

**This installs:**
- ✅ @prisma/client (ORM for database)
- ✅ cors (Cross-Origin Resource Sharing)
- ✅ dotenv (Environment variables)
- ✅ express (Web framework)
- ✅ nodemon (Auto-restart during development)
- ✅ prisma (Database toolkit)

### Step 2: Setup Environment Variables
1. Copy `.env.example` to `.env`
2. Update `.env` with your Neon DB connection:
```bash
DATABASE_URL=postgresql://user:password@region.neon.tech/dbname?sslmode=require
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) View database in Prisma Studio
npm run prisma:studio
```

### Step 4: Start the Server
**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

---

## 📋 Available API Endpoints

### Base URL: `http://localhost:5000/api`

#### Tasks Operations
```
GET    /tasks                      → Get all tasks
POST   /tasks                      → Create new task
GET    /tasks/:id                  → Get single task
PUT    /tasks/:id                  → Update task
DELETE /tasks/:id                  → Delete task
```

#### Filter Operations
```
GET    /tasks/status/:status           → Filter by status (pending, in_progress, completed, cancelled)
GET    /tasks/priority/:priority       → Filter by priority (1=high, 2=medium, 3=low)
GET    /tasks/assignee/:assignee_id    → Filter by assignee
GET    /tasks/due-date/:due_date       → Filter by due date (YYYY-MM-DD)
```

#### Health & Info
```
GET    /health                     → Server health check
GET    /api                        → API documentation
```

---

## 🔧 NPM Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server (auto-reload)
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open Prisma Studio (visual database editor)
```

---

## 📊 Request/Response Examples

### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the daily task management system",
  "priority": 2,
  "status": "in_progress",
  "due_date": "2025-12-31",
  "owner_id": "uuid-here",
  "assignee_id": "uuid-here"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Complete project",
    "priority": 2,
    "status": "in_progress",
    "created_at": "2025-11-21T10:30:00Z",
    "owner": { "id": "...", "first_name": "...", "last_name": "...", "email": "..." }
  }
}
```

### Get All Tasks
```bash
GET /api/tasks
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": "...", "title": "...", "priority": 2, ... },
    { "id": "...", "title": "...", "priority": 3, ... }
  ]
}
```

---

## 🔐 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Required | PostgreSQL connection string |
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `FRONTEND_URL` | http://localhost:5173 | CORS origin |
| `JWT_SECRET` | Optional | For future auth |

---

## 📝 Backend Code Features

### ✅ taskController.js (9 Handlers)
1. **getAllTasks()** - Fetch all tasks with user relations
2. **getTaskById()** - Get single task by ID
3. **createTask()** - Create new task with validation
4. **updateTask()** - Partial update with field validation
5. **deleteTask()** - Delete task safely
6. **getTasksByStatus()** - Filter by status
7. **getTasksByPriority()** - Filter by priority
8. **getTasksByAssignee()** - Filter by assignee
9. **getTasksByDueDate()** - Filter by due date

### ✅ Data Validation
- Title: Required, non-empty string
- Priority: 1-3 (high, medium, low)
- Status: pending, in_progress, completed, cancelled
- Due Date: ISO format (YYYY-MM-DD), converted to UTC
- UUIDs: Validated for owner_id, assignee_id

### ✅ Error Handling
- 400: Bad Request (validation errors)
- 404: Not Found (resource doesn't exist)
- 500: Server Error (with logging)
- All errors return consistent JSON format

### ✅ Database Features
- Prisma ORM with type safety
- Automatic timestamps (created_at, updated_at)
- User relationships (owner, assignee, modifiedBy)
- UTC timezone normalization
- Connection pooling

---

## 🐛 Troubleshooting

### Issue: "Port 5000 already in use"
**Solution:** Use different port
```bash
PORT=5001 npm run dev
```

### Issue: Database connection error
**Solution:** Check your DATABASE_URL in .env
```bash
# Test connection
npx prisma db execute --stdin < <(echo "SELECT 1")
```

### Issue: npm install fails
**Solution:** Open Command Prompt (not PowerShell) as Administrator
```bash
# In cmd.exe
npm install
```

### Issue: Prisma client not found
**Solution:** Generate Prisma client
```bash
npm run prisma:generate
```

---

## 📚 Database Schema

### Task Model
```prisma
model Task {
  id          String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String    @db.Text
  description String?   @db.Text
  priority    Int       @default(2)  // 1=high, 2=medium, 3=low
  status      String    @default("pending")
  due_date    DateTime? @db.Date
  
  owner_id    String?   @db.Uuid
  owner       User?     @relation("TaskOwner", fields: [owner_id], references: [id])
  
  assignee_id String?   @db.Uuid
  assignee    User?     @relation("TaskAssignee", fields: [assignee_id], references: [id])
  
  modified_by String?   @db.Uuid
  modifiedBy  User?     @relation("TaskModifiedBy", fields: [modified_by], references: [id])
  
  created_at  DateTime  @default(now()) @db.Timestamptz
  updated_at  DateTime  @default(now()) @db.Timestamptz
  modified_on DateTime  @default(now()) @db.Timestamptz
}
```

---

## ✨ Key Technologies

- **Express.js** - Web framework
- **Prisma** - ORM for database
- **PostgreSQL** - Database (via Neon)
- **CORS** - Cross-origin requests
- **dotenv** - Environment management
- **nodemon** - Development auto-reload

---

## 🎯 Next Steps

1. ✅ Backend is fully configured
2. ⏭️ Use your separate frontend folder
3. ⏭️ Ensure frontend FRONTEND_URL matches this backend
4. ⏭️ Test API endpoints using Postman or frontend

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start development | `npm run dev` |
| Start production | `npm start` |
| Database migrations | `npm run prisma:migrate` |
| View database | `npm run prisma:studio` |
| Install packages | `npm install` |

**All done! Your backend is ready to use.** 🚀
