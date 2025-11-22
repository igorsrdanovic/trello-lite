# Quick Start Guide

Get Trello Lite running in 60 seconds! ⚡

## 🐳 Docker (Easiest)

### 1-Command Install

```bash
# Production
docker-compose up -d && echo "✅ Running at http://localhost"

# Development
docker-compose -f docker-compose.dev.yml up -d && echo "✅ Running at http://localhost:5173"
```

### Using Makefile

```bash
make up      # Production
make up-dev  # Development
```

That's it! 🎉

---

## 💻 Node.js

### 3-Command Install

```bash
npm install && npm run dev
```

---

## 🎯 What You Get

| Feature | Production | Development |
|---------|-----------|-------------|
| **URL** | http://localhost | http://localhost:5173 |
| **Hot Reload** | ❌ | ✅ |
| **Optimized** | ✅ | ❌ |
| **Size** | ~50MB | ~400MB |
| **Use Case** | Deployment | Development |

---

## 🔥 Common Commands

### Docker

```bash
# Start
make up          # or: docker-compose up -d

# Stop
make down        # or: docker-compose down

# Logs
make logs        # or: docker-compose logs -f

# Rebuild
make rebuild     # or: docker-compose build --no-cache

# Clean everything
make clean
```

### Node.js

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
npm test         # Run tests
```

---

## 📚 Next Steps

1. Press `?` for keyboard shortcuts
2. Press `D` to toggle dark mode
3. Create your first board
4. Read [full documentation](README.md)
5. Check [Docker guide](DOCKER.md)

---

## 🆘 Troubleshooting

### Port already in use?

**Docker:**
```bash
# Use different port
docker run -p 8080:80 trello-lite
```

**Node:**
```bash
# Vite uses next available port automatically
npm run dev
```

### Container won't start?

```bash
docker-compose logs     # Check logs
docker ps -a           # Check status
make rebuild           # Fresh start
```

### Build fails?

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

---

**Need help?** [Open an issue](https://github.com/yourusername/trello-lite/issues)
