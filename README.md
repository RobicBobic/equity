# Equity

A hook-native ve(3,3) exchange UI — every market sets its own fee. This is a fully
self-contained React app: no backend, no real blockchain required. Connecting a
wallet creates a local mock account, and every action (swapping, providing
liquidity, locking, voting) runs against an in-browser simulation of the fee
engine and ve(3,3) accounting, persisted to `localStorage`.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

To build a static production bundle:

```bash
npm run build
npm run preview   # serve the built dist/ folder locally
```

## What's inside

- **Markets** (`/`) — hero + live ticker + the full pool table (price, TVL,
  reserves, volume, fee model, ve weight). Click **Trade** to open the swap
  drawer; it runs a real constant-product AMM against in-memory pool reserves,
  quoting flat / directional / calendar fees exactly as described in the docs.
- **Portfolio** (`/portfolio`) — wallet holdings, LP positions, and a
  deposit/withdraw drawer for any market.
- **Leaderboard** (`/leaderboard`) — traders / liquidity / voters, built from
  your own local activity (this demo is single-wallet, so it reflects your
  actions only).
- **Vote** (`/vote`) — lock CAP into veCAP (7–730 days, linear decay to zero
  at unlock), and allocate vote weight across pools to project weekly
  emissions.
- **Docs** (`/docs`) — the full protocol documentation, rebranded to Equity.

## Reset the demo

Portfolio → there's no destructive UI control by default, but you can reset
all local state at any time from the browser console:

```js
localStorage.removeItem('equity_state_v2')
location.reload()
```

## Tech

Vite + React 18 + React Router. No UI kit — hand-rolled CSS in
`src/index.css` matching the dark/lime aesthetic. All protocol math lives in
`src/engine.js`; all state lives in `src/context/StoreContext.jsx`.
