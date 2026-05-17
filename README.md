# 🌿 AgriMarket — Agricultural Market Price Intelligence Tool

> A full-stack web platform connecting Chadian farmers and traders to real-time commodity prices across N'Djamena, Moundou, and Sarh.

---

## 📋 Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally (Without Docker)](#running-locally-without-docker)
  - [Running with Docker](#running-with-docker)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Role-Based Access](#role-based-access)
- [Anomaly Detection](#anomaly-detection)
- [Design Patterns](#design-patterns)
- [Testing](#testing)
- [Docker Architecture](#docker-architecture)

---

## Overview

AgriMarket is a mobile-friendly web application that solves a critical information asymmetry problem in Chad's agricultural sector. Community reporters log commodity prices from local markets, an anomaly detection engine validates the data, and farmers query real-time prices and trends through a clean, role-differentiated dashboard.

The platform was built as a final project for the **Best Programming Practices and Design Patterns** course at the **Adventist University of Central Africa (AUCA)**.

---

## The Problem

Chadian farmers and small traders have no visibility into real-time market prices across cities. A farmer in Sarh may sell sorghum at **300 XAF/kg** while the same commodity trades at **550 XAF/kg** in N'Djamena — a price difference of over **80%** separated by only 200 kilometres. Without access to cross-market price data, farmers consistently undersell and traders consistently overpay.

---

## Features

### 👤 Three Role-Based Dashboards

| Role | Capabilities |
|---|---|
| **Admin** | Moderate price reports, manage commodities and markets, manage users, view system stats |
| **Reporter** | Submit price reports, view own submission history and approval status |
| **Farmer** | Search approved prices, filter by commodity and market, view 30-day trend charts, compare prices across cities |

### 🔍 Price Intelligence
- Real-time price querying with filters (commodity, market, city)
- 30-day price trend line charts (Recharts)
- City-to-city price comparison bar charts

### 🛡️ Data Integrity
- Statistical anomaly detection using z-score analysis
- Prices deviating more than **2 standard deviations** from the 30-day mean are auto-flagged
- Human-in-the-loop moderation queue — admins approve or flag reports
- Only **APPROVED** reports are visible to farmers

### 🔐 Security
- JWT-based stateless authentication
- BCrypt password hashing
- Role-based access control (`ADMIN`, `REPORTER`, `FARMER`)
- Spring Security filter chain with `@PreAuthorize` method-level guards

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.4.x | REST API framework |
| Spring Security | 6.x | Authentication & authorization |
| JJWT | 0.12.6 | JWT token generation & validation |
| Spring Data JPA | 3.x | Database abstraction layer |
| Hibernate | 7.x | ORM |
| PostgreSQL | 16 | Relational database |
| Lombok | Latest | Boilerplate reduction |
| Maven | 3.9.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool & dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| Axios | Latest | HTTP client with interceptors |
| Recharts | Latest | Price trend & comparison charts |
| React Router | 6.x | Client-side routing |
| Lucide React | Latest | Icon library |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Frontend serving & API reverse proxy |

---

## Project Structure

```
agrimarket/
├── docker-compose.yml
│
├── agrimarket-backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/main/java/com/agrimarket/
│       ├── auth/
│       │   ├── AuthController.java
│       │   ├── AuthService.java
│       │   ├── AuthServiceImpl.java
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   └── AuthResponse.java
│       ├── user/
│       │   ├── User.java
│       │   ├── Role.java
│       │   ├── UserRepository.java
│       │   ├── UserController.java
│       │   └── UserDTO.java
│       ├── commodity/
│       │   ├── Commodity.java
│       │   ├── CommodityCategory.java
│       │   ├── CommodityRepository.java
│       │   ├── CommodityController.java
│       │   ├── CommodityService.java
│       │   ├── CommodityServiceImpl.java
│       │   ├── CommodityRequest.java
│       │   └── CommodityDTO.java
│       ├── market/
│       │   ├── Market.java
│       │   ├── MarketRepository.java
│       │   ├── MarketController.java
│       │   ├── MarketService.java
│       │   ├── MarketServiceImpl.java
│       │   ├── MarketRequest.java
│       │   └── MarketDTO.java
│       ├── price/
│       │   ├── PriceReport.java
│       │   ├── PriceStatus.java
│       │   ├── PriceReportRepository.java
│       │   ├── PriceController.java
│       │   ├── PriceService.java
│       │   ├── PriceServiceImpl.java
│       │   ├── PriceReportRequest.java
│       │   ├── PriceReportDTO.java
│       │   ├── ModerationRequest.java
│       │   ├── AnomalyDetector.java
│       │   └── AnomalyResult.java
│       ├── analytics/
│       │   ├── AnalyticsController.java
│       │   ├── AnalyticsService.java
│       │   ├── AnalyticsServiceImpl.java
│       │   ├── TrendPoint.java
│       │   ├── TrendResponse.java
│       │   ├── CityComparisonPoint.java
│       │   └── CityComparisonResponse.java
│       └── common/
│           ├── JwtUtil.java
│           ├── JwtAuthFilter.java
│           ├── SecurityConfig.java
│           ├── ApiResponse.java
│           └── GlobalExceptionHandler.java
│
└── agrimarket-frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── api/
        │   ├── axios.js
        │   ├── auth.js
        │   ├── commodities.js
        │   ├── markets.js
        │   ├── prices.js
        │   └── analytics.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── RoleRoute.jsx
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── ModerationQueue.jsx
        │   │   ├── ManageCommodities.jsx
        │   │   ├── ManageMarkets.jsx
        │   │   └── ManageUsers.jsx
        │   ├── reporter/
        │   │   ├── ReporterDashboard.jsx
        │   │   ├── SubmitPrice.jsx
        │   │   └── MyReports.jsx
        │   └── farmer/
        │       ├── FarmerDashboard.jsx
        │       ├── SearchPrices.jsx
        │       └── PriceTrends.jsx
        ├── App.jsx
        └── main.jsx
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Java | 21+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| PostgreSQL | 16+ |
| Docker Desktop | Latest (for Docker setup) |

---

### Running Locally (Without Docker)

#### 1. Clone the repository

```bash
git clone https://github.com/sade01sade/AgriMarket.git
cd agrimarket
```

#### 2. Set up the database

Create a PostgreSQL database:

```sql
CREATE DATABASE agrimarket;
CREATE USER agrimarket_user WITH PASSWORD 'agrimarket_pass';
GRANT ALL PRIVILEGES ON DATABASE agrimarket TO agrimarket_user;
```

#### 3. Configure the backend

Edit `agrimarket-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agrimarket
spring.datasource.username=agrimarket_user
spring.datasource.password=agrimarket_pass
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=your-very-long-secret-key-minimum-256-bits
app.jwt.expiration=900000
```

#### 4. Run the backend

```bash
cd agrimarket-backend
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`

#### 5. Run the frontend

```bash
cd agrimarket-frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

### Running with Docker

The entire stack (frontend, backend, database) runs with a single command.

#### 1. Clone the repository

```bash
git clone https://github.com/sade01sade/AgriMarket.git
cd agrimarket
```

#### 2. Build and start all containers

```bash
docker compose up --build
```

#### 3. Open the app

```
http://localhost
```

Docker Compose starts three containers in the correct order:
1. `agrimarket-db` — PostgreSQL (waits for health check)
2. `agrimarket-backend` — Spring Boot API (waits for DB)
3. `agrimarket-frontend` — React app served by Nginx

#### Useful Docker Commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Stop all containers
docker compose down

# Stop and wipe database (full reset)
docker compose down -v

# Rebuild a single service
docker compose up --build backend
```

---

## Environment Variables

All sensitive values are injected via environment variables. The `application.properties` uses `${VARIABLE:fallback}` syntax so the app works both locally and inside Docker.

| Variable | Description | Default |
|---|---|---|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/agrimarket` |
| `SPRING_DATASOURCE_USERNAME` | Database username | — |
| `SPRING_DATASOURCE_PASSWORD` | Database password | — |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Schema strategy | `update` |
| `APP_JWT_SECRET` | JWT signing secret (min 256-bit) | — |
| `APP_JWT_EXPIRATION` | Token expiry in milliseconds | `900000` (15 min) |

---

## API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT token |

**Register request body:**
```json
{
  "fullName": "Moussa Deby",
  "email": "moussa@agrimarket.td",
  "password": "secret123",
  "role": "REPORTER",
  "city": "N'Djamena"
}
```

**Login request body:**
```json
{
  "email": "moussa@agrimarket.td",
  "password": "secret123"
}
```

---

### Commodities

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/commodities` | Any role | Get all active commodities |
| `GET` | `/commodities/{id}` | Any role | Get commodity by ID |
| `GET` | `/commodities/category/{category}` | Any role | Filter by category |
| `POST` | `/commodities` | ADMIN | Create commodity |
| `PUT` | `/commodities/{id}` | ADMIN | Update commodity |
| `DELETE` | `/commodities/{id}` | ADMIN | Deactivate commodity |

---

### Markets

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/markets` | Any role | Get all active markets |
| `GET` | `/markets/{id}` | Any role | Get market by ID |
| `GET` | `/markets/city/{city}` | Any role | Filter by city |
| `POST` | `/markets` | ADMIN | Create market |
| `PUT` | `/markets/{id}` | ADMIN | Update market |
| `DELETE` | `/markets/{id}` | ADMIN | Deactivate market |

---

### Prices

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/prices` | REPORTER | Submit a price report |
| `GET` | `/prices/my-reports` | REPORTER | View own submissions |
| `GET` | `/prices` | FARMER, ADMIN | Get approved prices (filterable) |
| `GET` | `/prices/moderation-queue` | ADMIN | View pending and flagged reports |
| `PATCH` | `/prices/{id}/moderate` | ADMIN | Approve or flag a report |

**Submit price body:**
```json
{
  "commodityId": 1,
  "marketId": 1,
  "price": 450.00,
  "reportDate": "2026-04-24"
}
```

**Moderate body:**
```json
{
  "status": "APPROVED"
}
```
```json
{
  "status": "FLAGGED",
  "flagReason": "Price significantly above market average"
}
```

**Filter approved prices:**
```
GET /prices?commodityId=1&marketId=2
```

---

### Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/trend` | Any role | Price trend over N days |
| `GET` | `/analytics/compare` | Any role | City-to-city price comparison |

```
GET /analytics/trend?commodityId=1&marketId=1&days=30
GET /analytics/compare?commodityId=1
```

---

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | ADMIN | Get all registered users |

---

## Role-Based Access

| Endpoint Group | ADMIN | REPORTER | FARMER |
|---|---|---|---|
| Auth (register/login) | ✅ | ✅ | ✅ |
| Read commodities & markets | ✅ | ✅ | ✅ |
| Write commodities & markets | ✅ | ❌ | ❌ |
| Submit price report | ❌ | ✅ | ❌ |
| View own reports | ❌ | ✅ | ❌ |
| View approved prices | ✅ | ❌ | ✅ |
| Moderation queue | ✅ | ❌ | ❌ |
| Moderate reports | ✅ | ❌ | ❌ |
| Analytics & trends | ✅ | ✅ | ✅ |
| User management | ✅ | ❌ | ❌ |

---

## Anomaly Detection

When a Reporter submits a price, the system automatically runs a statistical check before saving:

```
1. Fetch all APPROVED reports for the same commodity + market from the last 30 days
2. If fewer than 3 reports exist → skip detection, set status = PENDING
3. Compute mean and standard deviation of historical prices
4. Compute z-score: | (incoming_price - mean) / std_dev |
5. If z-score > 2.0 → set status = FLAGGED with statistical reason attached
6. Otherwise → set status = PENDING
```

**Example flag reason:**
```
Price 5000.00 deviates significantly from recent average of 450.00 (±32.50)
```

Admins see flagged reports at the top of the moderation queue and can review them with the statistical context already attached.

---

## Design Patterns

### Observer Pattern (Primary)

Applied in the price submission workflow. `PriceServiceImpl` acts as the Subject — when a new `PriceReport` is submitted, it notifies three observers in sequence:

| Observer | Responsibility |
|---|---|
| `AnomalyDetector` | Evaluates the incoming price statistically |
| Status Setter | Sets `PENDING` or `FLAGGED` based on detection result |
| `PriceReportRepository` | Persists the report and updates the moderation queue |

### Strategy Pattern (Secondary)

Applied in the analytics module. The trend computation strategy is parameterized via the `days` query parameter, allowing the time window (7, 30, or 90 days) to vary independently of the computation logic.

---

## Testing

The project includes 33 test cases across 6 categories:

| Category | Test Cases |
|---|---|
| Authentication | 7 |
| Role-Based Access Control | 7 |
| Anomaly Detection | 5 |
| Price Lifecycle | 5 |
| Analytics | 4 |
| Docker Deployment | 5 |

### Running API Tests with Postman

1. Register three users — one per role (ADMIN, REPORTER, FARMER)
2. Save each token as a Postman environment variable (`admin_token`, `reporter_token`, `farmer_token`)
3. Use `Bearer {{admin_token}}` in the Authorization tab for each request

### Key Test Scenarios

```
# Test anomaly detection — submit normal prices first
POST /prices  { price: 450 }   → status: PENDING
POST /prices  { price: 460 }   → status: PENDING
POST /prices  { price: 440 }   → status: PENDING (now have 3 data points)

# Now submit an anomalous price
POST /prices  { price: 5000 }  → status: FLAGGED (auto-detected)

# Admin approves a normal report
PATCH /prices/1/moderate  { "status": "APPROVED" }

# Farmer now sees the approved price
GET /prices?commodityId=1
```

---

## Docker Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Docker Host                       │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  agrimarket-frontend  (nginx:alpine)  :80    │   │
│  │                                              │   │
│  │   React SPA  ──→  Nginx Reverse Proxy       │   │
│  │                        │                    │   │
│  └────────────────────────│────────────────────┘   │
│                           │ /api/** proxy_pass       │
│  ┌────────────────────────▼────────────────────┐   │
│  │  agrimarket-backend  (temurin:21-jre)  :8080│   │
│  │                                              │   │
│  │   Spring Boot API + Spring Security + JWT   │   │
│  │                        │                    │   │
│  └────────────────────────│────────────────────┘   │
│                           │ JDBC :5432               │
│  ┌────────────────────────▼────────────────────┐   │
│  │  agrimarket-db  (postgres:16-alpine)  :5432  │   │
│  │                                              │   │
│  │   PostgreSQL + persistent volume             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Multi-stage builds** — Maven/Node.js used only during build; minimal JRE/Nginx images used at runtime
- **Health checks** — backend waits for `pg_isready` before starting, preventing connection errors
- **Nginx proxy** — all `/api/*` requests forwarded to `backend:8080` internally, eliminating CORS in production
- **Persistent volume** — `postgres_data` volume survives container restarts

---

## Git Branching Strategy

```
main          ← stable, production-ready
  └── develop ← integration branch
        ├── feature/auth
        ├── feature/price-anomaly-detection
        ├── feature/farmer-dashboard
        └── feature/docker-setup
```

**Commit convention:**
```
feat(price): add z-score anomaly detection on submission
fix(auth): correct JWT filter token extraction
chore(docker): add multi-stage Dockerfile for frontend
docs: update README with API documentation
```

---

## Academic Context

| Field | Detail |
|---|---|
| **Course** | Best Programming Practices and Design Patterns |
| **Institution** | Adventist University of Central Africa (AUCA) |
| **Department** | Software Engineering |
| **Instructor** | RUTARINDWA JEAN PIERRE |
| **Year** | 2025 – 2026 |
