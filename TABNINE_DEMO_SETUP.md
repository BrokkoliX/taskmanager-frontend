# 🎯 Tabnine Demo - Setup & Run Guide

> **Quick reference for running the Tabnine remote repository demo**

---

## 📋 Pre-Demo Checklist

- [ ] Backend repo exists: https://github.com/BrokkoliX/taskmanager-backend
- [ ] Frontend repo exists: https://github.com/BrokkoliX/taskmanager-frontend
- [ ] MCP Servers repo exists: https://github.com/BrokkoliX/MCP-servers
- [ ] VS Code is installed
- [ ] .NET 9 SDK is installed
- [ ] Node.js is installed (for MCP servers)
- [ ] Python 3 is installed (for frontend server)
- [ ] MCP server dependencies installed: `cd taskmanager-mcp-servers && npm run install:all`

---

## 🚀 Quick Start (Every Time You Demo)

### **Step 1: Open Frontend in VS Code**

```bash
# Close any open workspace first
# Then open ONLY the frontend folder
code /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend
```

**Verify:** VS Code file explorer shows only:
- index.html
- app.js
- styles.css
- README.md
- .gitignore
- TABNINE_DEMO_SETUP.md (this file)

---

### **Step 2: Configure Tabnine (First Time Only)**

1. Open Tabnine settings in VS Code
   - Command Palette (Cmd+Shift+P)
   - Type: "Tabnine: Open Settings"

2. Navigate to "Remote Repositories" or "Workspace"

3. Add backend repository:
   ```
   https://github.com/BrokkoliX/taskmanager-backend
   ```
   OR (if using SSH):
   ```
   git@github.com:BrokkoliX/taskmanager-backend.git
   ```

4. Wait for indexing to complete (check Tabnine status bar)

---

### **Step 3: Start MCP Servers**

MCP servers provide additional functionality (database access, security scanning).

Open a **NEW TERMINAL WINDOW** (NOT in VS Code):

```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers
./start-demo.sh
```

**Expected Output:**
```
🚀 Starting TaskManager MCP Servers for Demo...
✅ SQLite MCP Server started (PID: xxxxx)
✅ Snyk MCP Server started (PID: xxxxx)
```

**Note:** MCP servers run in background. Check status anytime:
```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers
./status-demo.sh
```

---

### **Step 4: Start Backend API**

Open a **NEW TERMINAL WINDOW** (NOT in VS Code):

```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-backend
dotnet run
```

**Expected Output:**
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

**⚠️ Keep this terminal running during the demo!**

**Alternative:** Use the full demo startup script:
```bash
cd /Users/robbie/Tab/TabnineTaskDemo
./start-full-demo.sh  # Starts MCP servers + Backend
```

---

### **Step 5: Start Frontend Server (Optional)**

If you want to test the UI:

Open **ANOTHER TERMINAL WINDOW**:

```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend
python3 -m http.server 8080
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

**Open in browser:** http://localhost:8080

---

### **Step 6: Verify Everything Works**

#### **Test Backend API:**
```bash
# In a new terminal
curl http://localhost:5000/api/tasks

# Should return JSON array (might be empty)
# If you get "Connection refused", backend isn't running
```

#### **Test Frontend:**
- Open: http://localhost:8080
- Should see TaskManager interface
- Try creating a task
- Should connect to backend successfully

---

## 🎭 Demo Scenarios

### **Scenario 1: API Call Suggestions**

**What to show:** Tabnine suggests backend API structure

**Steps:**
1. In VS Code, open `app.js`
2. Scroll to an API call (e.g., `createTask` function)
3. Start typing a new API call:
   ```javascript
   async function getTasks() {
       const response = await fetch(`${API_BASE_URL}/
   ```
4. **Pause and show:** Tabnine suggests:
   - `/tasks` endpoint
   - Method: GET
   - Headers
   - Error handling

**Talking point:**
> "Notice how Tabnine knows about the `/tasks` endpoint even though the backend code isn't in this workspace. It's indexed remotely from GitHub!"

---

### **Scenario 2: Request Body Structure**

**What to show:** Tabnine suggests DTO structure from backend

**Steps:**
1. In `app.js`, find `createTask` function
2. Look at the request body structure:
   ```javascript
   const response = await fetch(`${API_BASE_URL}/tasks`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
           // Tabnine suggests these fields
   ```
3. Start typing field names

**Talking point:**
> "Tabnine suggests field names that match the backend's CreateTaskDto - title, description, priority, etc. It learned this from the remote repository!"

---

### **Scenario 3: New Feature - Add Priority Filter**

**What to show:** Cross-repo code generation

**Steps:**
1. In `app.js`, create a new function:
   ```javascript
   async function getTasksByPriority(priority) {
       // Start typing...
   ```

2. **Show:** Tabnine suggests:
   - Endpoint structure similar to other endpoints
   - Query parameter format
   - Response handling

**Talking point:**
> "Tabnine understands both the frontend patterns and backend API structure. It suggests code that will work with the actual backend."

---

### **Scenario 4: Error Handling**

**What to show:** Consistent error handling patterns

**Steps:**
1. Find any API call with error handling
2. Start typing a new API call
3. **Show:** Tabnine suggests similar error handling:
   ```javascript
   .catch(error => {
       console.error('Error:', error);
       // Tabnine suggests consistent error handling
   ```

---

## 🔧 Troubleshooting

### **Problem: Tabnine not giving backend suggestions**

**Solutions:**
1. Check backend repo is added in Tabnine settings
2. Wait for indexing to complete (check status bar)
3. Restart Tabnine: Cmd+Shift+P → "Tabnine: Restart"
4. Restart VS Code

---

### **Problem: Backend not running**

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
1. Check backend is running:
   ```bash
   curl http://localhost:5000/api/tasks
   ```

2. If not running, start it:
   ```bash
   cd /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api
   dotnet run
   ```

3. Check for port conflicts:
   ```bash
   lsof -i :5000
   # Kill any process using port 5000
   ```

---

### **Problem: Frontend not loading**

**Solutions:**
1. Check frontend server is running:
   ```bash
   # Should see server running on 8080
   ```

2. Restart frontend server:
   ```bash
   cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend
   python3 -m http.server 8080
   ```

3. Clear browser cache and reload

---

### **Problem: CORS errors in browser console**

**Error:** `Access to fetch at 'http://localhost:5000/api/tasks' from origin 'http://localhost:8080' has been blocked by CORS policy`

**Solution:**
Backend should have CORS enabled. Verify in backend `Program.cs`:
```csharp
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
```

If CORS is missing, add it to backend code.

---

## 📊 Demo Architecture

```
┌─────────────────────────────────────────┐
│  VS Code Workspace (Frontend Only)     │
│  - index.html                           │
│  - app.js                               │
│  - styles.css                           │
│  ✅ Tabnine indexing locally            │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  Tabnine Remote Repo  │
        │  (Backend from GitHub)│
        │  ✅ Indexed remotely   │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  Suggestions combine: │
        │  - Frontend patterns  │
        │  - Backend API struct │
        └───────────────────────┘


┌─────────────────────────────────────────┐
│  Separate Terminal (Backend Running)   │
│  cd TaskManager.Api                     │
│  dotnet run                             │
│  → http://localhost:5000                │
└─────────────────────────────────────────┘
                    ↑
        Frontend API calls connect here
```

---

## 🎯 Key Talking Points

1. **Separation:**
   > "Frontend code is in this workspace, backend is indexed remotely from GitHub"

2. **No Duplication:**
   > "I don't need the backend code locally for Tabnine to understand it"

3. **Cross-Repository Intelligence:**
   > "Tabnine provides suggestions based on both repositories"

4. **Real-World Scenario:**
   > "This is how teams work - frontend and backend in separate repos, Tabnine bridges the gap"

5. **Always Up-to-Date:**
   > "When backend team pushes changes to GitHub, Tabnine re-indexes and suggestions stay current"

---

## 🔗 Quick Links

### **Repositories**
- **Frontend:** https://github.com/BrokkoliX/taskmanager-frontend
- **Backend:** https://github.com/BrokkoliX/taskmanager-backend
- **MCP Servers:** https://github.com/BrokkoliX/MCP-servers

### **Local Paths**
- **Frontend:** `/Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend`
- **Backend:** `/Users/robbie/Tab/TabnineTaskDemo/taskmanager-backend`
- **MCP Servers:** `/Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers`

### **URLs When Running**
- **Backend API:** http://localhost:5000
- **Backend Swagger:** http://localhost:5000/swagger
- **Frontend UI:** http://localhost:8080

---

## 📝 Quick Command Reference

```bash
# Full demo startup (MCP + Backend)
cd /Users/robbie/Tab/TabnineTaskDemo && ./start-full-demo.sh

# Start MCP servers only
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers && ./start-demo.sh

# Check MCP server status
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers && ./status-demo.sh

# Open frontend workspace
code /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend

# Start backend (separate terminal)
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-backend && dotnet run

# Start frontend server (separate terminal)
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend && python3 -m http.server 8080

# Test backend
curl http://localhost:5000/api/tasks

# Test frontend
open http://localhost:8080

# Stop everything
cd /Users/robbie/Tab/TabnineTaskDemo && ./stop-full-demo.sh

# Check Tabnine status
# Look at bottom-right status bar in VS Code
```

---

## ✅ Pre-Demo Verification

Before starting your demo, run through this checklist:

- [ ] VS Code open with **frontend workspace only**
- [ ] Tabnine showing in status bar (bottom-right)
- [ ] Backend repo added to Tabnine remote repositories
- [ ] MCP servers running: `cd taskmanager-mcp-servers && ./status-demo.sh`
- [ ] Backend running in terminal (http://localhost:5000)
- [ ] Backend responding: `curl http://localhost:5000/api/tasks`
- [ ] Frontend server running (optional): http://localhost:8080
- [ ] Frontend connects to backend (test in browser)
- [ ] Tabnine suggestions working (type something in app.js)

**All green?** You're ready to demo! 🚀

---

## 🎊 Demo Complete - Cleanup

After demo, stop all services:

### **Option 1: Quick Stop (Automated)**
```bash
cd /Users/robbie/Tab/TabnineTaskDemo
./stop-full-demo.sh  # Stops MCP servers + Backend
```

Then stop frontend:
```bash
# In frontend terminal: Ctrl+C
```

### **Option 2: Manual Stop**
```bash
# Stop MCP servers
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-mcp-servers
./stop-demo.sh

# In backend terminal: Ctrl+C
# In frontend terminal: Ctrl+C
```

**Optional:** Clear any test data created during demo:
```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-backend
rm taskmanager.db
dotnet ef database update  # Recreate empty database
```

---

## 🔄 Reset for Next Demo

**Want to demo again? Reset everything to pristine state!**

### **Option 1: Automated Reset (Recommended)**

Interactive script with options:
```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend
./demo-reset.sh
```

This will:
- Reset frontend code (discard any changes)
- Reset backend code (discard any changes)
- Offer database reset options (keep/delete/reseed)
- Create automatic backups
- Show next steps

### **Option 2: Quick Reset (No Prompts)**

Fast reset for quick turnarounds:
```bash
cd /Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend
./quick-reset.sh
```

This instantly:
- Resets all code to original state
- Deletes database (with backup)
- No questions asked!

### **Full Documentation**

See **DEMO_RESET_GUIDE.md** for:
- Manual reset procedures
- Troubleshooting reset issues
- Creating baseline snapshots
- Git branch strategies
- Browser storage cleanup
- Advanced reset workflows

**Pro Tip:** Clear browser storage between demos or use incognito mode!

---

## 📞 Need Help?

**Documentation:**
- Frontend README: `/Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend/README.md`
- Backend README: https://github.com/BrokkoliX/taskmanager-backend
- Full Setup: `/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/TABNINE_DEMO_SETUP_COMPLETE.md`

**Common Issues:**
- Backend not building: `cd TaskManager.Api && dotnet clean && dotnet build`
- Port conflicts: `lsof -i :5000` or `lsof -i :8080`
- Tabnine not working: Restart VS Code

---

<div align="center">

**Happy Demoing! 🚀**

**Show the power of Tabnine remote repositories!**

</div>

---

**Version:** 1.0  
**Last Updated:** January 17, 2025  
**Created by:** Architecture Migration Process
