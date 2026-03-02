# PrivSyncro

PrivSyncro is a privacy-preserving data synchronization and consent management platform. It empowers users with fine-grained control over their data shared with third-party applications (like fitness trackers, health apps, and music streaming services). 

This repository contains the ongoing development for the PrivSyncro MVP. 

## Project Structure

The project is built using a modern, scalable architecture:

*   **`frontend/`**: The user-facing web application built with React, Vite, and Material-UI. It provides a dashboard to manage active consents and view real-time data flows.
*   **`backend/`**: A Node.js and Express server that handles API requests, user authentication (JWT), and securely interacts with the MongoDB database. 
*   **`ai-service/`**: A Python-based microservice (FastAPI) responsible for analyzing user access patterns and detecting anomalies using machine learning (scikit-learn/TensorFlow).
*   **`blockchain/`**: Contains Solidity smart contracts designed to log immutable audit trails of consent changes (grants/revocations) on an Ethereum testnet (Sepolia).

## Current Phase: Phase 1 (MVP Refinement)

We have recently completed the core Phase 1 foundation, which includes:
- **MERN Stack Setup**: Configured MongoDB schemas for `User` and `Consent`.
- **Authentication**: JWT-based secure user registration and login functionalities.
- **Consent Management APIs**: Endpoints to grant, view, and revoke data access permissions.
- **Frontend UI**: Built a responsive Material-UI dashboard with routing and dynamic consent tables.
- **Blockchain Service**: Integrated `ethers.js` on the backend to simulate logging consent actions to a smart contract (`ConsentLog.sol`).

*(See `PrivSyncro_Roadmap.md` for the full long-term project roadmap).*

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Docker)
- Python 3.9+ (for the AI microservice)

### 1. Database Setup
To run MongoDB locally using Docker:
```bash
docker run -d -p 27017:27017 --name privsyncro-mongo mongo
```

### 2. Backend
Navigate to the `backend` directory, install dependencies, and start the server:
```bash
cd backend
npm install
npm run dev
```
*(Ensure you configure a `.env` file in the backend directory based on `backend/config/db.js` requirements).*

### 3. Frontend
Navigate to the `frontend` directory, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## License
MIT License
