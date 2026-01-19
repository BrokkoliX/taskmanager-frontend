#!/bin/bash

# 🎯 Tabnine Demo Reset Script
# Restores both frontend and backend to clean demo state

set -e  # Exit on error

echo "🎯 Tabnine Demo Reset Utility"
echo "=============================="
echo ""
echo "This will reset BOTH frontend and backend to demo-ready state"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paths
FRONTEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend"
BACKEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api"

# Function to print colored status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if directories exist
if [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

echo "📋 What will be reset:"
echo "   • Frontend: Discard any code changes (git reset)"
echo "   • Backend: Reset database to clean state"
echo "   • Backend: Discard any code changes (git reset)"
echo ""

read -p "Continue with reset? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_warning "Reset cancelled."
    exit 0
fi

echo ""
echo "════════════════════════════════════════"
echo "🎨 FRONTEND RESET"
echo "════════════════════════════════════════"
echo ""

cd "$FRONTEND_DIR"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_warning "Uncommitted changes detected in frontend"
    echo "   Files changed:"
    git status --short
    echo ""
    
    read -p "   Discard these changes? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git reset --hard HEAD
        git clean -fd
        print_status "Frontend code reset to clean state"
    else
        print_warning "Frontend changes preserved"
    fi
else
    print_status "Frontend already clean (no changes)"
fi

# Clear any browser storage instruction
echo ""
echo "   📱 Remember to clear browser storage:"
echo "      1. Open DevTools (F12)"
echo "      2. Application tab → Storage → Clear site data"
echo "      3. Or use incognito/private mode for demo"
echo ""

echo "════════════════════════════════════════"
echo "⚙️  BACKEND RESET"
echo "════════════════════════════════════════"
echo ""

cd "$BACKEND_DIR"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    print_warning "Uncommitted changes detected in backend"
    echo "   Files changed:"
    git status --short
    echo ""
    
    read -p "   Discard these changes? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git reset --hard HEAD
        git clean -fd -e "*.db*"  # Keep database files for now
        print_status "Backend code reset to clean state"
    else
        print_warning "Backend changes preserved"
    fi
else
    print_status "Backend code already clean (no changes)"
fi

# Database reset
echo ""
print_warning "Database Reset Options:"
echo "   1. Keep current data (tasks created during demo)"
echo "   2. Delete all data (start with empty database)"
echo "   3. Restore initial sample data (if seed script exists)"
echo ""

read -p "Choose option (1/2/3): " -n 1 -r
echo ""
echo ""

case $REPLY in
    2)
        print_warning "Deleting database..."
        
        # Backup first
        if [ -f taskmanager.db ]; then
            BACKUP_NAME="taskmanager.db.demo-backup-$(date +%Y%m%d-%H%M%S)"
            cp taskmanager.db "$BACKUP_NAME"
            print_status "Backup created: $BACKUP_NAME"
        fi
        
        # Delete database files
        rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal
        print_status "Database deleted (will be recreated on next run)"
        ;;
    3)
        if [ -f seed-data.sh ]; then
            print_warning "Resetting and seeding database..."
            
            # Backup first
            if [ -f taskmanager.db ]; then
                BACKUP_NAME="taskmanager.db.demo-backup-$(date +%Y%m%d-%H%M%S)"
                cp taskmanager.db "$BACKUP_NAME"
                print_status "Backup created: $BACKUP_NAME"
            fi
            
            # Delete database files
            rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal
            
            # Run seed script
            chmod +x seed-data.sh
            ./seed-data.sh
            
            print_status "Database reset with sample data"
        else
            print_error "Seed script not found: seed-data.sh"
            print_warning "Falling back to empty database..."
            rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal
        fi
        ;;
    *)
        print_status "Keeping current database data"
        ;;
esac

echo ""
echo "════════════════════════════════════════"
echo "✅ RESET COMPLETE"
echo "════════════════════════════════════════"
echo ""
echo "📝 Summary:"
echo "   • Frontend: Ready for demo"
echo "   • Backend: Ready for demo"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "   1. Start Backend:"
echo "      cd $BACKEND_DIR"
echo "      dotnet run"
echo ""
echo "   2. Start Frontend (optional):"
echo "      cd $FRONTEND_DIR"
echo "      python3 -m http.server 8080"
echo ""
echo "   3. Open VS Code (frontend only):"
echo "      code $FRONTEND_DIR"
echo ""
echo "   4. Verify Tabnine:"
echo "      • Check status bar (bottom-right)"
echo "      • Confirm backend repo indexed"
echo ""
echo "📚 All backups:"
cd "$BACKEND_DIR"
ls -lh taskmanager.db.demo-backup* 2>/dev/null || echo "   (none created this time)"

echo ""
echo "🎊 Ready to demo! Good luck!"
echo ""
