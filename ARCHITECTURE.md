# Task Manager - Architecture Diagram

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                              │
│                    (User Interface)                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       src/app.js                                │
│                  (Main Orchestrator)                            │
│  • Initialize views                                             │
│  • Attach event listeners                                       │
│  • Setup global actions                                         │
│  • Coordinate view switching                                    │
└──────┬────────────────────────┬─────────────────────────────────┘
       │                        │
       ▼                        ▼
┌──────────────┐        ┌──────────────┐
│  Tasks View  │        │  Users View  │
│              │        │              │
│ tasksView.js │        │ usersView.js │
└──────┬───────┘        └──────┬───────┘
       │                       │
       └───────────┬───────────┘
                   │
       ┌───────────┴───────────┬──────────────┬──────────────┐
       ▼                       ▼              ▼              ▼
┌─────────────┐         ┌─────────────┐  ┌─────────┐  ┌──────────┐
│  API Layer  │         │ Components  │  │  Utils  │  │  State   │
├─────────────┤         ├─────────────┤  ├─────────┤  ├──────────┤
│ tasks.js    │         │ taskList.js │  │helpers  │  │appState  │
│ users.js    │────────▶│ userList.js │  │.js      │  │.js       │
│ comments.js │         │commentList  │  │notifi-  │  │          │
│             │         │.js          │  │cations  │  │          │
│             │         │taskDetails  │  │.js      │  │          │
│             │         │.js          │  │         │  │          │
│             │         │ modal.js    │  │         │  │          │
└──────┬──────┘         └──────┬──────┘  └─────────┘  └──────────┘
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│   Backend   │         │     DOM     │
│  REST API   │         │  (Browser)  │
└─────────────┘         └─────────────┘
```

## 📦 Module Dependencies

```
app.js
├── views/
│   ├── tasksView.js
│   │   ├── api/tasks.js
│   │   ├── api/comments.js
│   │   ├── components/taskList.js
│   │   ├── components/taskDetails.js
│   │   ├── components/commentList.js
│   │   ├── components/userList.js (populateUserDropdown)
│   │   ├── components/modal.js
│   │   ├── utils/notifications.js
│   │   └── state/appState.js
│   │
│   └── usersView.js
│       ├── api/users.js
│       ├── components/userList.js
│       ├── components/modal.js
│       ├── utils/notifications.js
│       └── state/appState.js
│
└── components/modal.js
```

## 🔄 Data Flow Examples

### Example 1: Loading Tasks

```
User opens page
      │
      ▼
[app.js] init()
      │
      ▼
[tasksView.js] initTasksView()
      │
      ▼
[tasksView.js] loadTasks()
      │
      ▼
[tasks.js API] getAllTasks()
      │
      ▼
[Backend] GET /api/tasks
      │
      ▼
[tasks.js API] returns data
      │
      ▼
[taskList.js] renderTasksList()
      │
      ▼
[DOM] Tasks displayed
```

### Example 2: Adding a Task

```
User clicks "Add Task"
      │
      ▼
[HTML] Form submit event
      │
      ▼
[app.js] Event listener triggers
      │
      ▼
[tasksView.js] handleAddTask()
      │
      ├─▶ Validate input
      │
      ▼
[tasks.js API] createTask(newTask)
      │
      ▼
[Backend] POST /api/tasks
      │
      ▼
[tasks.js API] returns created task
      │
      ▼
[tasksView.js] loadTasks()
      │
      ▼
[taskList.js] renderTasksList()
      │
      ├─▶ [notifications.js] showSuccessMessage()
      │
      ▼
[DOM] Updated list + notification
```

### Example 3: Deleting a Comment

```
User clicks "Delete Comment"
      │
      ▼
[HTML] onclick="window.commentActions.delete(id)"
      │
      ▼
[app.js] Global action handler
      │
      ▼
[tasksView.js] deleteComment(id)
      │
      ├─▶ Show confirmation dialog
      │
      ▼
[comments.js API] deleteComment(id)
      │
      ▼
[Backend] DELETE /api/comments/{id}
      │
      ▼
[comments.js API] Success
      │
      ▼
[tasksView.js] loadComments(taskId)
      │
      ▼
[comments.js API] getCommentsByTaskId()
      │
      ▼
[commentList.js] renderCommentsList()
      │
      ├─▶ [notifications.js] showSuccessMessage()
      │
      ▼
[DOM] Updated comments
```

## 🎨 Component Hierarchy

```
Application
│
├── Tasks View
│   ├── Task Form
│   ├── Search & Filter
│   ├── Task List
│   │   └── Task Items (N)
│   │       ├── Task Metadata
│   │       └── Task Actions
│   ├── Edit Task Modal
│   └── Task Details Modal
│       ├── Task Info Card
│       ├── Add Comment Form
│       └── Comments List
│           └── Comment Items (N)
│
└── Users View
    ├── User Form
    ├── User Filter
    ├── User List
    │   └── User Items (N)
    │       ├── User Metadata
    │       └── User Actions
    └── Edit User Modal
```

## 🔐 Responsibility Matrix

| Layer | Responsibilities | Does NOT Handle |
|-------|-----------------|-----------------|
| **app.js** | Initialize, coordinate, setup | Business logic, rendering |
| **Views** | Business logic, orchestration | Direct DOM, API details |
| **API** | HTTP requests, data fetching | UI logic, state |
| **Components** | Rendering, DOM manipulation | API calls, business logic |
| **Utils** | Helper functions, notifications | Application logic |
| **State** | Global state storage | Business logic |

## 🚦 Error Handling Flow

```
[API Layer]
    │
    ├─ Success ──▶ Return data
    │
    └─ Error ──▶ Throw Error
                      │
                      ▼
              [View Controller]
                      │
                 try/catch
                      │
                      ├─ Success ──▶ Update UI
                      │
                      └─ Error ──▶ [notifications.js]
                                        │
                                        ▼
                                  showErrorAlert()
                                        │
                                        ▼
                                   User sees error
```

## 🎯 Communication Patterns

### View to API
```javascript
// Direct async/await
const tasks = await tasksApi.getAllTasks();
```

### View to Component
```javascript
// Function call with data
renderTasksList(tasks, container, countElement);
```

### View to State
```javascript
// Getter/Setter pattern
appState.setUsers(users);
const users = appState.getUsers();
```

### HTML to View
```javascript
// Global window object
window.taskActions.delete(id);
```

## 📊 Module Size Guidelines

| Module Type | Recommended Size | Max Size |
|-------------|-----------------|----------|
| API | 60-120 lines | 150 lines |
| Component | 40-100 lines | 150 lines |
| View Controller | 150-300 lines | 400 lines |
| Utility | 30-80 lines | 100 lines |
| State | 30-50 lines | 80 lines |

**Rule**: If a file exceeds max size, consider splitting it.

## 🧩 Extension Points

### Adding a New Entity (e.g., "Projects")

1. **Create API module** (`src/api/projects.js`)
2. **Create component** (`src/components/projectList.js`)
3. **Create view controller** (`src/views/projectsView.js`)
4. **Update state** (if needed in `appState.js`)
5. **Register in app.js** (initialize, events, actions)
6. **Update HTML** (add view container, navigation)

### Adding a New Feature to Existing Entity

1. **Add API function** (e.g., `archiveTask()` in `tasks.js`)
2. **Add component rendering** (if UI changes)
3. **Add view handler** (e.g., `handleArchiveTask()`)
4. **Wire up events** (in view or app.js)
5. **Update HTML** (if new UI elements)

## 🎓 Design Patterns Used

1. **Module Pattern**: ES6 modules for encapsulation
2. **Singleton**: appState for global state
3. **Facade**: API modules simplify backend interaction
4. **Observer**: Event listeners for user interactions
5. **MVC-ish**: Views (Controller), Components (View), State (Model)
6. **Dependency Injection**: Passing elements to init functions

## ✨ Conclusion

This architecture provides:
- **Scalability**: Easy to add features
- **Maintainability**: Clear structure, easy to navigate
- **Testability**: Isolated modules
- **Collaboration**: Multiple devs can work simultaneously
- **Performance**: Potential for optimization
- **Quality**: Consistent patterns and practices

The modular design ensures the application can grow sustainably without becoming unmaintainable.
