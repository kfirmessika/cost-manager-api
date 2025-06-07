# Cost Manager API

## Overview

The Cost Manager API is a RESTful service designed to help users track expenses across predefined categories and generate monthly summary reports. It supports creating users, adding cost items, and fetching structured reports.

## Features

- Create, retrieve, and list users
- Add cost entries with description, category, and amount
- Generate monthly expense reports grouped by category
- Simple JSON-based HTTP API with input validation and error handling

## Prerequisites

- Node.js >= 14
- npm >= 6
- MongoDB instance (Atlas or local)

## Installation

    git clone https://github.com/kfirmessika/cost-manager-api.git
    cd cost-manager-api
    npm install
    cp .env.example .env   # configure DB_URI and PORT in .env

## Running Locally

- Development (with auto-reload):

  npm run dev

- Production:

  npm start

## API Endpoints

    GET    /api/about             # Server metadata and version
    POST   /api/users             # Create a new user
    GET    /api/users/:id         # Retrieve user by ID
    GET    /api/users             # List all users
    POST   /api/add               # Add a cost entry (body: userid, description, category, sum)
    GET    /api/report            # Monthly report (query: userid, year, month)

## Configuration

- DB_URI: MongoDB connection string
- PORT: Server port (default 3000)

## Testing

    npm test   # runs Jest automated tests

## Deployment

- GitHub repository: https://github.com/kfirmessika/cost-manager-api.git
- Live demo: https://cost-manager-api-dvtp.onrender.com

## Contributing

Contributions are welcome! Please open issues or pull requests on the repository.

## License

MIT License
