# 🎨 TaskManager Frontend

> **Modern Single-Page Application for Task Management**

A clean, responsive web interface for the TaskManager backend API. Built with vanilla JavaScript, HTML5, and CSS3.

---

## 🌟 Features

- ✅ **Task Management** - Create, view, edit, and delete tasks
- ✅ **User Management** - Manage users and assignments
- ✅ **Multi-View Interface** - Switch between list, card, and calendar views
- ✅ **Real-time Updates** - Instant UI updates after API calls
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **REST API Integration** - Connects to backend API
- ✅ **Excel Export** - Export tasks to Excel format
- ✅ **CSV Export** - Export tasks to CSV format
- ✅ **Priority Management** - Visual priority indicators
- ✅ **Due Date Tracking** - Calendar integration for deadlines

---

## 🚀 Quick Start

### **Option 1: Open Directly in Browser**

Simply open `index.html` in your browser:

```bash
open index.html
# or
double-click index.html
```

### **Option 2: Use a Local Server** (Recommended)

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then visit: http://localhost:8080

---

## ⚙️ Configuration

### **Backend API URL**

The frontend expects the backend API at: `http://localhost:5000`

To change this, edit `app.js`:

```javascript
// Line ~10-15 in app.js
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📁 Project Structure

```
taskmanager-frontend/
├── index.html          # Main HTML file
├── app.js              # JavaScript application logic
├── styles.css          # CSS styles
└── README.md           # This file
```

---

## 🔌 Backend Integration

This frontend connects to the TaskManager Backend API:

**Backend Repository:**  
https://github.com/BrokkoliX/taskmanager-backend

**API Endpoints Used:**
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user

---

## 🎨 Features in Detail

### **Views**

**List View** (Default)
- Tabular layout with all task details
- Sortable columns
- Quick actions (edit, delete)

**Card View**
- Card-based layout
- Visual priority indicators
- Compact display

**Calendar View**
- Due dates on calendar
- Monthly overview
- Visual task scheduling

### **Task Management**

- Create tasks with title, description, priority
- Assign tasks to users
- Set due dates
- Mark tasks as complete
- Edit existing tasks
- Delete tasks

### **Export Features**

- Export all tasks to Excel (.xlsx)
- Export all tasks to CSV
- Includes all task fields
- Preserves formatting

---

## 🎯 API Requirements

The frontend expects the backend API to provide:

### **Task Object**
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task Description",
  "isCompleted": false,
  "priority": 1,
  "dueDate": "2024-12-31T23:59:59Z",
  "assignedToId": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### **User Object**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🛠️ Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Fetch API** - HTTP requests
- **Local Storage** - Optional state persistence

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 (not supported)

---

## 🔧 Development

### **Enable CORS in Backend**

Make sure the backend API has CORS enabled for frontend origin:

```csharp
// In Program.cs (backend)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:8080")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### **Run Backend API**

```bash
cd taskmanager-backend
dotnet run
# Backend runs on http://localhost:5000
```

### **Run Frontend**

```bash
cd taskmanager-frontend
python3 -m http.server 8080
# Frontend runs on http://localhost:8080
```

---

## 🐛 Troubleshooting

### **"Failed to fetch tasks"**

**Cause:** Backend API is not running or CORS is blocking requests

**Solution:**
1. Start the backend: `dotnet run`
2. Check backend is running: `curl http://localhost:5000/api/tasks`
3. Enable CORS in backend (see above)

### **"Network error"**

**Cause:** Wrong API URL in frontend

**Solution:**
1. Check `API_BASE_URL` in `app.js`
2. Verify backend is running on correct port
3. Check browser console for errors

### **Styling Issues**

**Cause:** CSS file not loaded

**Solution:**
1. Check `styles.css` exists
2. Open in browser with local server (not file://)
3. Clear browser cache

---

## 📊 Sample Data

The frontend works with any data from the backend. To seed sample data, use the backend's seeding scripts.

---

## 🚀 Deployment

### **Static Hosting**

Deploy to any static hosting service:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Azure Static Web Apps**
- **AWS S3 + CloudFront**

### **Configuration for Production**

Update `API_BASE_URL` in `app.js` to production backend:

```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

---

## 📚 Related Repositories

**Backend API:**  
https://github.com/BrokkoliX/taskmanager-backend

**Original Demo:**  
https://github.com/BrokkoliX/tabnine-taskmanager-demo

---

## 🎯 Tabnine Demo

This repository is part of a Tabnine remote repository demonstration:

- **Local Development:** Work on frontend locally
- **Remote Reference:** Backend code indexed remotely by Tabnine
- **Cross-Repository:** Tabnine provides suggestions from both repos

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues or questions:
- **Backend Issues:** https://github.com/BrokkoliX/taskmanager-backend/issues
- **Frontend Issues:** https://github.com/BrokkoliX/taskmanager-frontend/issues

---

<div align="center">

**Built with vanilla JavaScript for simplicity and performance**

⭐ Star this repo if you find it useful!

</div>

---

**Version:** 1.0.0  
**Last Updated:** January 16, 2025
