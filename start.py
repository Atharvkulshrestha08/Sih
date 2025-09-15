#!/usr/bin/env python3
"""
EduBot Pro - Startup Script
Starts both the Flask backend and serves the frontend
"""

import os
import sys
import subprocess
import threading
import time
import webbrowser
from pathlib import Path

def start_backend():
    """Start the Flask backend server"""
    backend_dir = Path(__file__).parent / "Backend"
    os.chdir(backend_dir)
    
    print("🚀 Starting Flask backend server...")
    try:
        subprocess.run([sys.executable, "app.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

def start_frontend():
    """Start a simple HTTP server for the frontend"""
    frontend_dir = Path(__file__).parent
    os.chdir(frontend_dir)
    
    print("🌐 Starting frontend server...")
    try:
        # Try Python 3's built-in server first
        subprocess.run([sys.executable, "-m", "http.server", "8080"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import flask_cors
        print("✅ Backend dependencies found")
        return True
    except ImportError as e:
        print(f"❌ Missing backend dependencies: {e}")
        print("📦 Install with: pip install flask flask-cors")
        return False

def main():
    """Main startup function"""
    print("🤖 EduBot Pro - Smart Campus Assistant")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend
    try:
        print("\n🌐 Frontend will be available at: http://localhost:8080")
        print("🔧 Backend API available at: http://localhost:3001")
        print("📱 Press Ctrl+C to stop both servers")
        print("=" * 50)
        
        # Open browser after a short delay
        def open_browser():
            time.sleep(3)
            webbrowser.open("http://localhost:8080")
        
        browser_thread = threading.Thread(target=open_browser, daemon=True)
        browser_thread.start()
        
        start_frontend()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down EduBot Pro...")
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()


