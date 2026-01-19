#!/bin/bash

# 🚀 Quick Demo Reset - No Prompts, Just Reset Everything
# Use this when you want a fast reset between demos

set -e

FRONTEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend"
BACKEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api"

echo "🚀 Quick Reset - No prompts!"
echo ""

# Frontend reset
echo "🎨 Resetting frontend..."
cd "$FRONTEND_DIR"
git reset --hard HEAD > /dev/null 2>&1
git clean -fd > /dev/null 2>&1
echo "   ✓ Frontend clean"

# Backend code reset
echo "⚙️  Resetting backend..."
cd "$BACKEND_DIR"
git reset --hard HEAD > /dev/null 2>&1
git clean -fd -e "*.db*" > /dev/null 2>&1
echo "   ✓ Backend code clean"

# Database reset
echo "🗄️  Resetting database..."
if [ -f taskmanager.db ]; then
    BACKUP="taskmanager.db.quick-backup-$(date +%Y%m%d-%H%M%S)"
    cp taskmanager.db "$BACKUP"
    echo "   ✓ Backup: $BACKUP"
fi
rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal
echo "   ✓ Database deleted"

echo ""
echo "✅ Reset complete! Ready for next demo."
echo ""
echo "Next steps:"
echo "  1. cd $BACKEND_DIR && dotnet run"
echo "  2. Open browser in incognito mode"
echo ""
