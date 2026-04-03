# Finance Dashboard

A React-based finance dashboard with transaction tracking, insight cards, and role-based views.

## Features

- Dashboard summary cards (balance, income, expenses, savings)
- Role selector with `admin`, `manager`, or `user` behavior
- Breakdown charts: balance trend, spending categories
- Transaction list with filters and add/edit forms
- Local state management via React Context in `src/context/FinanceContext.jsx`

## Project structure

- `src/App.jsx` - root app component and primary layout
- `src/index.js` - app entry point
- `src/components/Dashboard/RoleSelector.jsx` - role switches
- `src/components/Dashboard/SummaryCards.jsx` - KPI cards
- `src/components/Charts/*` - chart components
- `src/components/Transactions/*` - transaction list, filters, forms, and items
- `src/components/Common/*` - reusable UI components (Card, Button, Modal, EmptyState)
- `src/data/transactions.js` - sample transaction dataset
- `src/utils/helpers.js` - helper functions and formatting

## Getting started

1. `npm install`
2. `npm start`

Open [http://localhost:3000](http://localhost:3000)

## Available scripts

- `npm start` - run development server
- `npm test` - run tests
- `npm run build` - production build
- `npm run eject` - eject CRA config

## Notes


- React app uses function components and hooks.
- Replace the sample data in `src/data/transactions.js` for real data usage.
- For production deployment, run `npm run build` and deploy static files from `build/`.

## API Integration

This dashboard can load and persist transactions via a backend API.  
If no API is configured, it falls back to the local sample data in `src/data/transactions.js`.

### Endpoints (expected)

The app expects a REST API with these endpoints:

- `GET /transactions`  
  - Returns an array of transaction objects:
    ```json
    [
      {
        "id": "string",
        "date": "YYYY-MM-DD",
        "description": "string",
        "amount": 1234.56,
        "category": "Food & Dining",
        "type": "income" | "expense"
      }
    ]
    ```

- `POST /transactions`  
  - Body: a transaction object (without or with `id`, depending on your backend).  
  - Returns the created transaction (or 201 with empty body, depending on your API).

- `PUT /transactions/:id`  
  - Body: full transaction object to update.  
  - Returns the updated transaction (or 200/204).

- `DELETE /transactions/:id`  
  - Deletes a transaction.  
  - Returns 204 No Content (or similar).

The API wrapper lives in `src/api/financeApi.js`. It handles JSON requests, optional auth headers, and basic error handling.

## Environment Configuration

API configuration is done via environment variables.

Create a `.env` file in the project root (same level as `package.json`) based on `.env.example`:

```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com
# Optional: only if your backend requires a token
REACT_APP_API_TOKEN=your-token-here

