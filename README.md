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

