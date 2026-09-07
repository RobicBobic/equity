// Seed data for every market Equity lists at launch.
// feeModel: 'flat' | 'directional' | 'calendar'
export const MARKET_SEED = [
  // --- crypto / originals ---
  { symbol: 'WETH', name: 'Wrapped Ether', category: 'Crypto', price: 2501.75, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'cbBTC', name: 'Coinbase Wrapped BTC', category: 'Crypto', price: 65000, feeModel: 'flat', buyFeeBps: 20, sellFeeBps: 20, floorBps: 1, capBps: 100 },

  // --- equities ---
  { symbol: 'TSLA', name: 'Tesla', category: 'Equity', price: 353.98, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'NVDA', name: 'NVIDIA', category: 'Equity', price: 230.24, feeModel: 'calendar', buyFeeBps: 15, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'AAPL', name: 'Apple', category: 'Equity', price: 320.52, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'AMZN', name: 'Amazon', category: 'Equity', price: 258.73, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'MSFT', name: 'Microsoft', category: 'Equity', price: 500.53, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'MSTR', name: 'Strategy', category: 'Equity', price: 142.30, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'SPCX', name: 'SpaceX Class A', category: 'Equity', price: 147.90, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'GME', name: 'GameStop', category: 'Equity', price: 19.16, feeModel: 'directional', buyFeeBps: 50, sellFeeBps: 20, floorBps: 1, capBps: 100 },
  { symbol: 'AMC', name: 'AMC Entertainment', category: 'Equity', price: 2.65, feeModel: 'directional', buyFeeBps: 50, sellFeeBps: 20, floorBps: 1, capBps: 100 },
  { symbol: 'PLTR', name: 'Palantir Technologies', category: 'Equity', price: 174.43, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'GOOGL', name: 'Alphabet Class A', category: 'Equity', price: 338.46, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'META', name: 'Meta Platforms', category: 'Equity', price: 616.77, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'Equity', price: 477.57, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'NFLX', name: 'Netflix', category: 'Equity', price: 78.25, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'COIN', name: 'Coinbase', category: 'Equity', price: 184.64, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'SNDK', name: 'SanDisk', category: 'Equity', price: 64.50, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'CRCL', name: 'Circle Internet Group', category: 'Equity', price: 85.10, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'MU', name: 'Micron Technology', category: 'Equity', price: 120.30, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'TTWO', name: 'Take-Two Interactive', category: 'Equity', price: 195.40, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'RIVN', name: 'Rivian Automotive', category: 'Equity', price: 13.20, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'COST', name: 'Costco', category: 'Equity', price: 930.00, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'DJT', name: 'Trump Media & Technology Group', category: 'Equity', price: 18.40, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 60, floorBps: 1, capBps: 100 },
  { symbol: 'RDDT', name: 'Reddit', category: 'Equity', price: 145.20, feeModel: 'directional', buyFeeBps: 20, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'HIMS', name: 'Hims & Hers Health', category: 'Equity', price: 45.60, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'BB', name: 'BlackBerry', category: 'Equity', price: 4.50, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'LLY', name: 'Eli Lilly', category: 'Equity', price: 780.00, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'WYFI', name: 'WhiteFiber', category: 'Equity', price: 20.10, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing', category: 'Equity', price: 210.80, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'RBLX', name: 'Roblox', category: 'Equity', price: 75.30, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'SKHY', name: 'SK hynix', category: 'Equity', price: 30.40, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'DELL', name: 'Dell Technologies', category: 'Equity', price: 119.90, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'SNAP', name: 'Snap', category: 'Equity', price: 9.80, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'LULU', name: 'Lululemon Athletica', category: 'Equity', price: 250.00, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'FIG', name: 'Figma', category: 'Equity', price: 70.20, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'MRNA', name: 'Moderna', category: 'Equity', price: 35.50, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'PFE', name: 'Pfizer', category: 'Equity', price: 25.30, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'MRVL', name: 'Marvell Technology', category: 'Equity', price: 75.60, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'Equity', price: 160.40, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'BABA', name: 'Alibaba', category: 'Equity', price: 90.10, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'IBM', name: 'IBM', category: 'Equity', price: 230.70, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'BULL', name: 'Webull', category: 'Equity', price: 35.20, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'NU', name: 'Nu Holdings', category: 'Equity', price: 13.40, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'SHOP', name: 'Shopify', category: 'Equity', price: 110.60, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'BE', name: 'Bloom Energy', category: 'Equity', price: 25.90, feeModel: 'directional', buyFeeBps: 30, sellFeeBps: 50, floorBps: 1, capBps: 100 },
  { symbol: 'F', name: 'Ford Motor', category: 'Equity', price: 11.20, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },
  { symbol: 'UPS', name: 'United Parcel Service', category: 'Equity', price: 105.30, feeModel: 'flat', buyFeeBps: 30, sellFeeBps: 30, floorBps: 1, capBps: 100 },

  // --- ETFs / commodities ---
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'Commodity', price: 407, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
  { symbol: 'SLV', name: 'iShares Silver Trust', category: 'Commodity', price: 32.10, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
  { symbol: 'USO', name: 'United States Oil Fund', category: 'Commodity', price: 75.40, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'ETF', price: 770.19, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
  { symbol: 'QQQ', name: 'Invesco QQQ', category: 'ETF', price: 717.54, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
  { symbol: 'SGOV', name: 'iShares 0-3 Month Treasury Bond ETF', category: 'ETF', price: 100.40, feeModel: 'flat', buyFeeBps: 5, sellFeeBps: 5, floorBps: 1, capBps: 100 },
  { symbol: 'INDA', name: 'iShares MSCI India ETF', category: 'ETF', price: 55.20, feeModel: 'flat', buyFeeBps: 10, sellFeeBps: 10, floorBps: 1, capBps: 100 },
]

export const QUOTE = 'USDG'
export const GOV_TOKEN = 'CAP'
export const GOV_TOKEN_NAME = 'EQUITY'

// seed liquidity so pools open with a believable TVL and the mock AMM has depth
export const SEED_BASE_UNITS = 5000

export const TOKENOMICS_SEED = {
  tail: 100_000_000, // CAP set aside for the Voter at deploy
  weeklyBps: 50, // 0.5% of remaining tail per epoch
  epochLengthMs: 7 * 24 * 60 * 60 * 1000,
}