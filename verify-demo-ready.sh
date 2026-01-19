#!/bin/bash

# 🔍 Pre-Demo Verification Script
# Checks that everything is ready for a successful demo

set -e

FRONTEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/taskmanager-frontend"
BACKEND_DIR="/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Tabnine Demo Readiness Check"
echo "================================"
echo ""

ISSUES=0
WARNINGS=0

# Function to print status
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((ISSUES++))
}

check_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

echo "📁 Repository Status"
echo "────────────────────"

# Check frontend git status
cd "$FRONTEND_DIR"
if git diff-index --quiet HEAD -- 2>/dev/null; then
    check_pass "Frontend: Clean working tree"
else
    check_warn "Frontend: Uncommitted changes detected"
    git status --short | sed 's/^/     /'
    echo "     Run: ./demo-reset.sh to clean"
fi

# Check backend git status
cd "$BACKEND_DIR"
if git diff-index --quiet HEAD -- 2>/dev/null; then
    check_pass "Backend: Clean working tree"
else
    check_warn "Backend: Uncommitted changes detected"
    git status --short | sed 's/^/     /'
    echo "     Run: ./demo-reset.sh to clean"
fi

echo ""
echo "🗄️  Database Status"
echo "────────────────────"

cd "$BACKEND_DIR"
if [ -f taskmanager.db ]; then
    SIZE=$(du -h taskmanager.db | cut -f1)
    check_info "Database exists (size: $SIZE)"
    
    # Count tasks (if sqlite3 is available)
    if command -v sqlite3 &> /dev/null; then
        TASK_COUNT=$(sqlite3 taskmanager.db "SELECT COUNT(*) FROM Tasks;" 2>/dev/null || echo "?")
        if [ "$TASK_COUNT" = "0" ]; then
            check_pass "Database is empty (good for demo)"
        else
            check_warn "Database has $TASK_COUNT tasks"
            echo "     Consider running: ./demo-reset.sh"
        fi
    fi
else
    check_pass "No database (will be created on first run)"
fi

echo ""
echo "⚙️  Dependencies"
echo "────────────────────"

# Check .NET
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    check_pass ".NET SDK installed (v$DOTNET_VERSION)"
else
    check_fail ".NET SDK not found"
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    check_pass "Python 3 installed (v$PYTHON_VERSION)"
else
    check_fail "Python 3 not found"
fi

# Check VS Code
if command -v code &> /dev/null; then
    check_pass "VS Code CLI available"
else
    check_warn "VS Code CLI not in PATH (code command)"
fi

echo ""
echo "🌐 Port Availability"
echo "────────────────────"

# Check if port 5000 is available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    check_warn "Port 5000 in use (backend port)"
    echo "     Process: $(lsof -Pi :5000 -sTCP:LISTEN | tail -n1)"
    echo "     If it's the backend, that's OK!"
else
    check_pass "Port 5000 available (backend)"
fi

# Check if port 8080 is available
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    check_warn "Port 8080 in use (frontend port)"
    echo "     Process: $(lsof -Pi :8080 -sTCP:LISTEN | tail -n1)"
    echo "     If it's the frontend server, that's OK!"
else
    check_pass "Port 8080 available (frontend)"
fi

echo ""
echo "🔨 Build Status"
echo "────────────────────"

# Try to build backend
cd "$BACKEND_DIR"
if dotnet build --nologo -v q > /dev/null 2>&1; then
    check_pass "Backend builds successfully"
else
    check_fail "Backend build failed"
    echo "     Run: cd $BACKEND_DIR && dotnet build"
fi

echo ""
echo "🎯 Backend Service"
echo "────────────────────"

# Check if backend is running
if curl -s http://localhost:5000/api/tasks > /dev/null 2>&1; then
    check_pass "Backend API responding (http://localhost:5000)"
    
    # Try to get tasks
    RESPONSE=$(curl -s http://localhost:5000/api/tasks)
    TASK_COUNT=$(echo "$RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
    check_info "API returned $TASK_COUNT tasks"
else
    check_warn "Backend not running"
    echo "     Start with: cd $BACKEND_DIR && dotnet run"
fi

echo ""
echo "🎨 Frontend Service"
echo "────────────────────"

# Check if frontend server is running
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    check_pass "Frontend server responding (http://localhost:8080)"
else
    check_warn "Frontend server not running (optional for demo)"
    echo "     Start with: cd $FRONTEND_DIR && python3 -m http.server 8080"
fi

echo ""
echo "📝 Demo Files"
echo "────────────────────"

# Check key files exist
cd "$FRONTEND_DIR"
[ -f index.html ] && check_pass "index.html exists" || check_fail "index.html missing"
[ -f src/app.js ] && check_pass "src/app.js exists" || check_fail "src/app.js missing"
[ -f styles.css ] && check_pass "styles.css exists" || check_fail "styles.css missing"
[ -f TABNINE_DEMO_SETUP.md ] && check_pass "Demo guide exists" || check_warn "Demo guide missing"

echo ""
echo "🔄 Reset Scripts"
echo "────────────────────"

[ -x demo-reset.sh ] && check_pass "demo-reset.sh ready" || check_warn "demo-reset.sh not executable"
[ -x quick-reset.sh ] && check_pass "quick-reset.sh ready" || check_warn "quick-reset.sh not executable"
[ -f DEMO_RESET_GUIDE.md ] && check_pass "Reset guide exists" || check_warn "Reset guide missing"

echo ""
echo "════════════════════════════════════════"
echo "📊 SUMMARY"
echo "════════════════════════════════════════"
echo ""

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 You're ready to demo!"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure backend is running: cd $BACKEND_DIR && dotnet run"
    echo "  2. (Optional) Start frontend: cd $FRONTEND_DIR && python3 -m http.server 8080"
    echo "  3. Open VS Code: code $FRONTEND_DIR"
    echo "  4. Start demoing!"
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠ READY WITH WARNINGS${NC}"
    echo ""
    echo "Found $WARNINGS warning(s)"
    echo "You can proceed, but review warnings above"
    echo ""
    echo "To fix warnings, run: ./demo-reset.sh"
else
    echo -e "${RED}❌ ISSUES FOUND${NC}"
    echo ""
    echo "Found $ISSUES critical issue(s) and $WARNINGS warning(s)"
    echo "Fix issues above before demoing"
    echo ""
    echo "Common fixes:"
    echo "  • Reset: ./demo-reset.sh"
    echo "  • Build backend: cd $BACKEND_DIR && dotnet build"
    echo "  • Install dependencies: dotnet restore"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
