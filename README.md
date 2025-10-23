# Data Nadhi Internal Server

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0-brightgreen.svg)](https://nodejs.org/)

Internal API server for Data Nadhi that handles internal service communications, secret management, and administrative operations.

## 🎯 Overview

The Data Nadhi Internal Server is a critical component of the Data Nadhi ecosystem that provides:

- **Secret Management**: Secure storage and retrieval of API keys and secrets
- **Internal APIs**: Service-to-service communication endpoints
- **Caching Layer**: Redis-based caching for performance optimization
- **Administrative Operations**: Internal tooling and management functions

## 📋 Prerequisites

- **Node.js** 20.0 or higher
- **MongoDB** (for data storage)
- **Redis** (for caching)
- **Docker Desktop** (for dev containers)

## 🚀 Quick Start

### Using Dev Container (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Data-ARENA-Space/data-nadhi-internal-server.git
   cd data-nadhi-internal-server
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Reopen in Container**
   - Click "Reopen in Container" when prompted
   - Or use Command Palette: `Dev Containers: Reopen in Container`

4. **Start the server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:5001`

### Manual Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/Data-ARENA-Space/data-nadhi-internal-server.git
   cd data-nadhi-internal-server
   npm install
   ```

2. **Set up services**
   ```bash
   # Using Docker Compose
   docker-compose up -d mongo redis
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
data-nadhi-internal-server/
├── src/
│   ├── app.js              # Express application setup
│   ├── server.js           # Server entry point
│   ├── controllers/        # Request handlers
│   ├── dal/                # Data Access Layer
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── .devcontainer/          # Dev container configuration
├── .env.example            # Environment variables template
└── package.json
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=5001

# Database
MONGO_URL=mongodb://mongo:27017/datanadhi_dev

# Cache
REDIS_URL=redis://redis:6379

# Security
SEC_DB=my-secret-db-key
SEC_GLOBAL=my-global-root-key
NONCE_VALUE=DataNadhi

# Cache TTLs (in seconds)
API_KEY_CACHE_TTL_SECONDS=300
SECRET_CACHE_TTL_SECONDS=3600
ENTITY_CACHE_TTL_SECONDS=1800
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm test` | Run tests (to be implemented) |

## 🔐 API Endpoints

### Health Check
```bash
GET /health
```

### Internal APIs
*Documentation coming soon...*

## 🏗️ Architecture

### Components

- **Express Server**: Handles HTTP requests
- **MongoDB**: Stores secrets and configuration
- **Redis**: Caches frequently accessed data
- **DAL (Data Access Layer)**: Abstracts database operations
- **Services**: Contains business logic
- **Controllers**: Handles request/response flow

### Caching Strategy

- API keys cached for 5 minutes (300s)
- Secrets cached for 1 hour (3600s)
- Entity data cached for 30 minutes (1800s)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://docs.datanadhi.com/contributions) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📚 Documentation

- [Full Documentation](https://docs.datanadhi.com)
- [Architecture Overview](https://docs.datanadhi.com/docs/architecture)
- [Setup Guide](https://docs.datanadhi.com/docs/setup/internal-server)
- [API Reference](https://docs.datanadhi.com/docs/architecture/api)

## 🔗 Related Repositories

Browse all Data Nadhi repositories:
[Data Nadhi Repositories](https://github.com/search?q=topic%3Adata-nadhi+org%3AData-ARENA-Space&type=Repositories)

Key repositories:
- [data-nadhi-server](https://github.com/Data-ARENA-Space/data-nadhi-server) - Main API server
- [data-nadhi-temporal-worker](https://github.com/Data-ARENA-Space/data-nadhi-temporal-worker) - Workflow worker
- [data-nadhi-sdk](https://github.com/Data-ARENA-Space/data-nadhi-sdk) - Client SDKs
- [data-nadhi-documentation](https://github.com/Data-ARENA-Space/data-nadhi-documentation) - Documentation site

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help?

- 📖 Check our [documentation](https://docs.datanadhi.com)
- 💬 Browse [GitHub Discussions](https://github.com/Data-ARENA-Space/data-nadhi-internal-server/discussions)
- 🐛 Report bugs via [GitHub Issues](https://github.com/Data-ARENA-Space/data-nadhi-internal-server/issues)
- 📧 Contact us via the [contact form](https://docs.datanadhi.com/contact)

## 🌟 About Data Nadhi

**Direct. Transform. Deliver.**

Data Nadhi is an open-source data pipeline platform that provides streamlined data ingestion, powerful transformation capabilities, and reliable data delivery.

Learn more at [docs.datanadhi.com](https://docs.datanadhi.com)

---

Made with ❤️ by the Data Nadhi team
