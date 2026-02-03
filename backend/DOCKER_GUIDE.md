# 🐳 Docker Guide for FastAPI ML Backend

## 📚 Table of Contents
- [What is Docker?](#what-is-docker)
- [Why Use Docker?](#why-use-docker)
- [Prerequisites](#prerequisites)
- [Understanding the Dockerfile](#understanding-the-dockerfile)
- [Building Your Docker Image](#building-your-docker-image)
- [Running Your Container Locally](#running-your-container-locally)
- [Deploying to Render](#deploying-to-render)
- [Common Docker Commands](#common-docker-commands)
- [Troubleshooting](#troubleshooting)

---

## 🤔 What is Docker?

Docker is a platform that packages your application and all its dependencies into a standardized unit called a **container**. Think of it as a lightweight virtual machine that:
- Contains your code, runtime, libraries, and system tools
- Runs the same way on any machine (your laptop, server, cloud)
- Isolates your app from other applications

### Key Concepts:

1. **Dockerfile**: A recipe/blueprint for building your container
2. **Image**: The built package (like a snapshot of your app)
3. **Container**: A running instance of your image
4. **Registry**: A storage place for images (like Docker Hub)

```
Dockerfile → (build) → Image → (run) → Container
```

---

## 💡 Why Use Docker?

### ✅ Benefits for Your Project:

1. **Consistency**: Your backend will run the same way locally, on Render, or anywhere else
2. **Easy Deployment**: Deploy to Render with just a Dockerfile
3. **Isolation**: ML models, dependencies, and code are packaged together
4. **No Environment Issues**: No more "it works on my machine" problems
5. **Scalability**: Easy to scale your backend on cloud platforms

---

## 📋 Prerequisites

### Install Docker Desktop:
- **Windows**: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- **Mac**: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Linux**: [Install Docker Engine](https://docs.docker.com/engine/install/)

### Verify Installation:
```powershell
docker --version
# Should output: Docker version XX.XX.X
```

---

## 🔍 Understanding the Dockerfile

Let me break down each part of your Dockerfile:

```dockerfile
# Use official Python runtime as base image
FROM python:3.11-slim
```
- **FROM**: Starts with a pre-built Python 3.11 image
- **slim**: Uses a smaller version (saves space, faster downloads)

```dockerfile
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
```
- Optimizes Python for containers
- Ensures logs appear in real-time (important for debugging)

```dockerfile
WORKDIR /app
```
- Sets `/app` as the working directory inside the container
- All commands run from this directory

```dockerfile
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
```
- Copies your dependencies file
- Installs Python packages
- `--no-cache-dir`: Reduces image size

```dockerfile
COPY app ./app
COPY data ./data 2>/dev/null || true
```
- Copies your application code and data folder
- Includes your ML models (`.pkl` files)

```dockerfile
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser
```
- **Security best practice**: Runs app as non-root user
- Protects your container from potential attacks

```dockerfile
EXPOSE 8000
```
- Documents that your app uses port 8000
- Doesn't actually publish the port (done with `-p` flag when running)

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/')" || exit 1
```
- Automatically checks if your app is healthy
- Cloud platforms use this to restart failed containers

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
- Starts your FastAPI application when container runs

---

## 🏗️ Building Your Docker Image

### Step 1: Open Terminal in Backend Folder
```powershell
cd r:\python\py_fullstack\backend
```

### Step 2: Build the Image
```powershell
docker build -t ml-backend:latest .
```

**Explanation:**
- `docker build`: Command to build an image
- `-t ml-backend:latest`: Tags (names) your image as "ml-backend" with version "latest"
- `.`: Uses the current directory (looks for Dockerfile)

**What happens:**
1. Docker reads your Dockerfile
2. Downloads Python 3.11 base image (first time only)
3. Installs dependencies from requirements.txt
4. Copies your code and models
5. Creates the final image

**Expected Output:**
```
[+] Building 45.2s (12/12) FINISHED
...
=> => naming to docker.io/library/ml-backend:latest
```

### Step 3: Verify Image Was Created
```powershell
docker images
```

**You should see:**
```
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
ml-backend    latest    abc123def456   2 minutes ago   450MB
```

---

## 🚀 Running Your Container Locally

### Basic Run Command:
```powershell
docker run -d -p 8000:8000 --name ml-backend-container ml-backend:latest
```

**Explanation:**
- `docker run`: Starts a container from an image
- `-d`: Runs in detached mode (background)
- `-p 8000:8000`: Maps port 8000 (host:container)
  - First 8000 → Your computer's port
  - Second 8000 → Container's port
- `--name ml-backend-container`: Names the container
- `ml-backend:latest`: The image to use

### Test Your Backend:
Open browser and go to: `http://localhost:8000`

You should see:
```json
{"message": "FastAPI ML Server is Running"}
```

### View Container Logs:
```powershell
docker logs ml-backend-container
```

**Expected logs:**
```
--- Starting Server: Loading Models ---
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Stop Container:
```powershell
docker stop ml-backend-container
```

### Start Container Again:
```powershell
docker start ml-backend-container
```

### Remove Container:
```powershell
docker rm ml-backend-container
```

---

## ☁️ Deploying to Render

Render makes deployment incredibly easy with Docker!

### Step 1: Push Code to GitHub

1. **Create a GitHub repository** (if you haven't)
2. **Push your backend folder:**
```powershell
cd r:\python\py_fullstack\backend
git init
git add .
git commit -m "Add dockerized backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### Step 3: Create New Web Service

1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure settings:**

```
Name: ml-backend
Region: Choose closest to you (e.g., Oregon)
Branch: main
Root Directory: backend (or leave blank if repo is just backend)
Runtime: Docker
Instance Type: Free (or paid for production)
```

4. **Build Command**: Leave blank (Render auto-detects Dockerfile)
5. **Start Command**: Leave blank (uses CMD from Dockerfile)

### Step 4: Environment Variables (if needed)
If you have any secrets, add them in Render dashboard:
- Click "Environment"
- Add variables like `DATABASE_URL`, `API_KEY`, etc.

### Step 5: Deploy
- Click **"Create Web Service"**
- Render will:
  1. Clone your repo
  2. Build Docker image
  3. Deploy container
  4. Give you a URL like `https://ml-backend-xxxx.onrender.com`

### Step 6: Update Frontend
Update your frontend `.env` file:
```env
NEXT_PUBLIC_API_URL=https://ml-backend-xxxx.onrender.com
```

### Step 7: Update CORS in Backend
Edit `app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app"  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```powershell
git add app/main.py
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes!

---

## 🛠️ Common Docker Commands

### Image Management:
```powershell
# List all images
docker images

# Remove an image
docker rmi ml-backend:latest

# Remove unused images
docker image prune
```

### Container Management:
```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs (live)
docker logs -f ml-backend-container

# Execute command in running container
docker exec -it ml-backend-container bash

# Stop all running containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune
```

### Debugging:
```powershell
# Run container in interactive mode (see errors immediately)
docker run -it -p 8000:8000 ml-backend:latest

# Check container resource usage
docker stats ml-backend-container

# Inspect container details
docker inspect ml-backend-container
```

---

## 🐛 Troubleshooting

### Problem: "Port 8000 is already in use"
**Solution:**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Stop the container using that port
docker stop ml-backend-container

# Or use a different port on your machine
docker run -d -p 8001:8000 --name ml-backend-container ml-backend:latest
```

### Problem: "Cannot connect to Docker daemon"
**Solution:**
- Make sure Docker Desktop is running
- Restart Docker Desktop
- On Windows, check if Docker service is running

### Problem: "ModuleNotFoundError" when running container
**Solution:**
- Rebuild image: `docker build --no-cache -t ml-backend:latest .`
- Check `requirements.txt` has all dependencies
- Ensure you copied the correct folders in Dockerfile

### Problem: Container starts then immediately stops
**Solution:**
```powershell
# Check logs for errors
docker logs ml-backend-container

# Run in foreground to see errors
docker run -it -p 8000:8000 ml-backend:latest
```

### Problem: ML models not loading
**Solution:**
- Verify `.pkl` files are in `app/ml/` folder
- Check file paths in your code match the container structure
- Ensure models are included (not in `.dockerignore`)

### Problem: Build takes too long
**Solution:**
- Docker caches layers - only changed layers rebuild
- Keep `requirements.txt` stable
- Use `.dockerignore` to exclude unnecessary files

### Problem: Image size is too large
**Solution:**
```powershell
# Check image size
docker images ml-backend

# Use multi-stage builds (advanced)
# Or switch to python:3.11-alpine (even smaller)
```

---

## 📝 Quick Reference Card

```powershell
# Build image
docker build -t ml-backend:latest .

# Run container
docker run -d -p 8000:8000 --name ml-backend-container ml-backend:latest

# View logs
docker logs -f ml-backend-container

# Stop container
docker stop ml-backend-container

# Remove container
docker rm ml-backend-container

# Clean up everything
docker system prune -a
```

---

## 🎯 Next Steps

1. ✅ **Test locally**: Build and run your Docker container
2. ✅ **Push to GitHub**: Make sure your Dockerfile is in the repo
3. ✅ **Deploy to Render**: Follow the deployment steps above
4. ✅ **Deploy frontend to Vercel**: Point it to your Render backend URL
5. ✅ **Test end-to-end**: Make sure frontend can call backend APIs

---

## 📚 Additional Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Render Docker Deployment](https://render.com/docs/docker)
- [FastAPI in Containers](https://fastapi.tiangolo.com/deployment/docker/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---


