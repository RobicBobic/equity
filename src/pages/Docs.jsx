import React, { useState } from 'react'

const SECTIONS = [
  { id: 'start-here', label: 'Start here' },
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'fee-engine', label: 'Fee engine' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'lp-accounting', label: 'LP accounting' },
  { id: 'emissions', label: 've(3,3) emissions' },
  { id: 'locking', label: 'Locking and voting' },
  { id: 'trading', label: 'Trading' },
  { id: 'roles', label: 'Roles and safety' },
  { id: 'running-locally', label: 'Running locally' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'faq', label: 'FAQ' },
]

function FaqItem({ q, a }) {
  return (
    <details className="faq-item">
      <summary>{q}</summary>
      <p>{a}</p>
    </details>
  )
}

export default function Docs() {
  const [active, setActive] = useState('start-here')

  return (
    <div className="page">
      <div style={{ marginBottom: 40 }}>
        <div className="page-title">Documentation<span className="dot">.</span></div>
        <p className="page-sub" style={{ maxWidth: 720 }}>
          Equity is an exchange on Robinhood Chain where every market sets its own fee rules. Under the hood it is
          Uniswap v4 with a single hook owning fees, liquidity accounting and emissions, and every term on this page
          is explained in plain words the first time it appears.
        </p>
      </div>

      <div className="docs-layout">
        <nav className="docs-toc">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={'#' + s.id}
              className={active === s.id ? 'active' : ''}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="docs-content">

          <h2 id="start-here">Start here</h2>
          <p>
            Equity is an exchange for tokens on Robinhood Chain, a public blockchain. You can swap one token for
            another (for example USDG for tokenized stock), and you can deposit your tokens into a market to earn a
            cut of every trade made there. Holders of EQUITY, the exchange's own token, can additionally lock it to
            vote on where the weekly EQUITY rewards go.
          </p>
          <h3>How do I use it</h3>
          <ol className="steps">
            <li><span className="num">1</span><span className="body"><b>Connect a wallet.</b> A wallet is an app (browser extension or phone) that holds your tokens; hit Connect wallet in the header of the home page and pick yours. In this demo, Connect wallet creates a local mock wallet with starter balances so you can try every flow.</span></li>
            <li><span className="num">2</span><span className="body"><b>Trade a market.</b> Pick a market card on the home page, for instance WETH/USDG, type what you want to spend and confirm the swap.</span></li>
            <li><span className="num">3</span><span className="body"><b>Provide liquidity, optional.</b> On the Portfolio page deposit both tokens into a pool and start earning a share of its fees.</span></li>
            <li><span className="num">4</span><span className="body"><b>Lock and vote, optional.</b> On the Vote page lock EQUITY to gain vote weight and steer weekly emissions toward the pools you back.</span></li>
          </ol>
          <div className="callout">
            <b>New to crypto?</b> read this page top to bottom once. Every term is defined the first time it appears,
            the glossary compresses all of it into one-liners, and the FAQ answers the naive questions first.
          </div>

          <h2 id="overview">Overview</h2>
          <p>
            Equity is an exchange with a twist: instead of one flat fee for everyone, each market owns a fee policy
            that can change with direction and with the clock. Traders swap (trade one token for another) through a
            Uniswap v4 pool, which is not a place but a shared pot of two tokens that every trade goes through. A hook
            contract, a piece of code the exchange calls on every single trade, intercepts each swap and quotes the
            fee for that exact moment: flat, direction-dependent, or session-aware. Fees do not go to the protocol,
            they go straight to the liquidity providers (the people who deposited the tokens into the pot), tracked
            mathematically per share.
          </p>
          <p>
            On top of that sits a ve(3,3) layer: holders lock EQUITY to earn vote weight, vote weekly on which
            markets deserve emissions (new EQUITY released on a schedule, here from a fixed pile set aside at
            launch), and the Voter contract streams EQUITY from its emission allocation to the winning pools' LPs,
            pro-rata by liquidity. The "ve" stands for vote-escrowed, tokens locked in exchange for voting power. That
            is the whole flywheel:
          </p>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">traders pay fees on every swap</span></li>
            <li><span className="num">2</span><span className="body">LPs earn them per share, autonomously</span></li>
            <li><span className="num">3</span><span className="body">veEQUITY votes steer weekly EQUITY emissions</span></li>
            <li><span className="num">4</span><span className="body">winning pools attract liquidity, which attracts traders</span></li>
          </ol>

          <h3>Markets at launch</h3>
          <div className="mini-table">
            <table>
              <thead><tr><th>Market</th><th>Price</th><th>Fee model</th><th>Buy fee</th><th>Sell fee</th></tr></thead>
              <tbody>
                <tr><td>WETH/USDG</td><td>$2,501.75</td><td>Flat</td><td>0.30%</td><td>0.30%</td></tr>
                <tr><td>TSLA/USDG</td><td>$353.98</td><td>Directional</td><td>0.20%</td><td>0.50%</td></tr>
                <tr><td>NVDA/USDG</td><td>$230.24</td><td>Calendar</td><td>0.15% in session</td><td>0.30% after hours</td></tr>
                <tr><td>GLD/USDG</td><td>opens ~$407 (no oracle feed)</td><td>Flat</td><td>0.10%</td><td>0.10%</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The pool price floats with trading from its opening level; the live column reads the Chainlink oracle, an
            on-chain feed that publishes real-world market prices. WETH is wrapped ether, the chain's native coin in
            token form so it can trade in pools. Every config carries floor 0.01% (the lowest a fee may ever be set
            to) and cap 1% per pool (the highest); the protocol-wide hard ceiling is 10% (see Roles and safety).
          </p>
          <div className="callout">
            Where this runs: Robinhood Chain (4663), with the official WETH, USDG and stock tokens. A local anvil
            chain runs the same bytecode for development. This build ships as a self-contained demo: connecting a
            wallet creates local mock balances so every flow — trading, liquidity, locking, voting — works fully
            client-side without a live chain.
          </div>

          <h2 id="architecture">Architecture</h2>
          <p>
            Unlike older Uniswap versions where every pair was its own contract, v4 has one PoolManager singleton
            that holds every pool's liquidity and every pool's tokens. A pool is not a contract, it is an entry keyed
            by a PoolKey:
          </p>
          <pre><code>{`PoolKey = (currency0, currency1, fee, tickSpacing, hooks)`}</code></pre>
          <p>In plain words: one big contract plays bank for everything, and each pool is a row in its ledger, not a branch office.</p>
          <p>
            Tokens move through flash accounting: everything happens inside an <code>unlock()</code> callback, and
            the manager syncs, settles and takes balances when the callback returns. If the books do not balance, the
            whole transaction reverts.
          </p>

          <h3>The hook and its permissions</h3>
          <p>
            The <code>hooks</code> field points at a contract that v4 calls at fixed points in the pool lifecycle.
            Which points a hook may intercept is encoded in the hook's own address: each permission is a bit, and the
            address must have those bits set. That is why the hook is deployed via CREATE2 with a mined salt: the
            deployer grinds salts until the address contains exactly the permission bits. Equity uses three, giving
            the address its shape 0x...20C0:
          </p>
          <div className="mini-table">
            <table>
              <thead><tr><th>Permission</th><th>Bit</th><th>What Equity does with it</th></tr></thead>
              <tbody>
                <tr><td>BEFORE_INITIALIZE</td><td>1&lt;&lt;13</td><td>Registers the pool in the ledger, enforces pool rules</td></tr>
                <tr><td>BEFORE_SWAP</td><td>1&lt;&lt;7</td><td>Quotes the dynamic fee for this exact swap</td></tr>
                <tr><td>AFTER_SWAP</td><td>1&lt;&lt;6</td><td>Records cumulative volume and last-swap time</td></tr>
              </tbody>
            </table>
          </div>
          <p>In plain words: the hook's permissions were burned into its address before it even existed, so nobody can quietly hand it new powers later.</p>
          <p>
            Two hard rules are enforced on pool creation: the pool's hook must be the hook itself (no foreign hooks),
            and the pool's fee must be the dynamic-fee flag, meaning the hook decides the fee per swap. Static-fee
            pools are rejected.
          </p>

          <h3>The cast of contracts</h3>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>PoolManager</b></td><td>Uniswap v4 core singleton. Holds all pools, liquidity and flash accounting.</td></tr>
                <tr><td><b>FeeLedgerHook</b></td><td>The brain: dynamic fees, the LP share ledger, fee escrow, emission distribution.</td></tr>
                <tr><td><b>EquityRouter</b></td><td>Minimal exact-in swap router: approve, swap with minOut and deadline.</td></tr>
                <tr><td><b>Escrow</b></td><td>Locks EQUITY for 7 to 730 days, computes decaying vote weight.</td></tr>
                <tr><td><b>Voter</b></td><td>Weekly epochs, collects votes, routes emissions from its funded allocation.</td></tr>
                <tr><td><b>StateView</b></td><td>Read-only lens over the manager (prices, slot0).</td></tr>
              </tbody>
            </table>
          </div>

          <h2 id="fee-engine">Fee engine</h2>
          <p>
            The fee engine is the product. On every swap, <code>beforeSwap</code> computes the fee at that instant,
            in hundredths of a bip (units of 1e-6, so 3_000 = 0.30%), and returns it to v4. v4 then charges exactly
            that. Resolution order, first match wins:
          </p>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">Active keeper override (if set and not expired)</span></li>
            <li><span className="num">2</span><span className="body">Autonomous fee, from the pool's model config</span></li>
            <li><span className="num">3</span><span className="body">Clamped to [floor, cap]</span></li>
          </ol>
          <p>
            In plain words: a fee is not a number anyone sets once. It is recomputed for every trade at the very
            moment it happens, then squeezed inside the pool's floor and cap so it can never leave that band.
          </p>

          <h3>The three autonomous models</h3>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>Flat</b></td><td>one fee both directions. Example: WETH at 0.30%, GLD at 0.10%.</td></tr>
                <tr><td><b>Directional</b></td><td>different fee for buys vs sells (by swap direction). Example: TSLA buy 0.20%, sell 0.50%, reflecting flow asymmetry and discouraging dump-after-pump exits.</td></tr>
                <tr><td><b>Calendar</b></td><td>base fee during the Mon-Fri 14:00-21:00 UTC session, 2x outside it, mirroring traditional market hours. Example: NVDA base 0.15%, so 0.30% when liquidity is thin. The window is computed on-chain from block.timestamp: day-of-week via epoch math, hour via the remainder, objective and identical for everyone.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keeper overrides</h3>
          <p>
            Real markets go wild sometimes. A keeper (an operational role, not an owner) can temporarily override any
            pool's fee, for example to keep an orderly market during a shock. The override is fenced on every side:
          </p>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>bounds</b></td><td>it must sit within the pool's [floor, cap]</td></tr>
                <tr><td><b>discount</b></td><td>at most 50% below the autonomous fee</td></tr>
                <tr><td><b>ttl</b></td><td>it expires within 72 hours</td></tr>
                <tr><td><b>exit</b></td><td>the emergency role can clear it instantly</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            When it expires (or the keeper dies), the autonomous model resumes automatically. Nothing about an
            override is permanent, and no override can ever cross the 10% absolute ceiling.
          </p>

          <h2 id="liquidity">Liquidity</h2>
          <p>
            Equity LPing is deliberately opinionated: full range only, one pooled position per pool, shares are the
            liquidity. There is no tick-range picker and no concentrated-liquidity math for users to get wrong.
          </p>
          <p>
            In plain words: full range means your deposit is working at every price the market will ever print, so
            you never have to guess price bands, and being an LP (a liquidity provider) just means lending the pool
            your tokens in exchange for a stream of its fees.
          </p>

          <h3>The share token</h3>
          <p>
            Each pool's LP shares are an ERC-6909 token (one contract serves all pools) with id <code>poolId</code>.
            Shares are minted 1:1 with the liquidity units contributed, so pool liquidity always equals total shares.
            That single invariant is what makes every per-share computation in the protocol exact.
          </p>
          <p>
            In plain words: your deposit is receipted as its own token, one share per unit of liquidity, so your
            slice of the pool is just a balance in your wallet. The dollar value of everything sitting in the pool is
            what stats sites call TVL, total value locked.
          </p>

          <h3>Deposit, step by step</h3>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">the hook pulls up to both max amounts from the depositor (approve first)</span></li>
            <li><span className="num">2</span><span className="body">it harvests any fees the pooled position has earned so far, so a late joiner cannot claim fees from before they arrived</span></li>
            <li><span className="num">3</span><span className="body">both sides are paid in, full-range liquidity is minted to the hook's position</span></li>
            <li><span className="num">4</span><span className="body">whatever the pool did not consume is refunded immediately (a generous max is safe)</span></li>
            <li><span className="num">5</span><span className="body">if shares minted would fall below minShares, everything reverts (slippage guard, 1% in the UI)</span></li>
          </ol>

          <h3>Withdraw, step by step</h3>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">fees are harvested first, so everything accrued is priced into the per-share state</span></li>
            <li><span className="num">2</span><span className="body">burning shares removes the exact proportional principal: no queue, no delay, no fee</span></li>
            <li><span className="num">3</span><span className="body">pending fees and pending emissions are computed on the full share balance</span></li>
            <li><span className="num">4</span><span className="body">you leave with principal + fees + emissions in one transaction</span></li>
          </ol>
          <div className="callout">
            Pause asymmetry: deposits can be paused globally by the emergency role as a circuit breaker. Withdrawals
            and claims are permissionless and can never be paused.
          </div>

          <h2 id="lp-accounting">LP accounting</h2>
          <p>
            Swap fees accrue inside the v4 pool, spread across its liquidity. The hook must convert that into "X
            tokens owed to address Y" without trusting anyone and without iterating over LPs.
          </p>
          <p>
            The mechanism: for every pool the hook keeps three cumulative per-share accumulators (1e18 fixed point):
            <code>fees0PerShare</code>, <code>fees1PerShare</code> and <code>capPerShare</code>. For every (pool,
            user) it keeps a checkpoint of the accumulator values at the user's last deposit, withdraw or claim. The
            invariant is the classic MasterChef-style pattern:
          </p>
          <pre><code>{`owed(user) = (poolAcc - userCheckpoint) * userShares / 1e18`}</code></pre>
          <p>
            In plain words: the pool keeps a lifetime counter of earnings per share, and your pending payout is
            simply how much that counter grew since your last action, times your shares. It is arithmetic over public
            state: nothing to trust, nobody to ask permission from.
          </p>
          <p>Whenever any liquidity action touches the pool, the hook:</p>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">calls modifyLiquidity with delta 0, which makes v4 pay out all fees accrued to the pooled position</span></li>
            <li><span className="num">2</span><span className="body">adds the collected amounts to the pool accumulators, divided by current liquidity</span></li>
            <li><span className="num">3</span><span className="body">escrows the exact collected amounts into its own balance (sync, then take)</span></li>
          </ol>
          <p>
            Payouts (claimFees, and the fee leg of withdraw) are then plain ERC-20 transfers from the escrow, never
            manager takes, so rounding dust can never drift the manager's deltas. Every accrual is fully funded at the
            moment it is recorded: the escrow always covers the sum of all users' pending amounts.
          </p>
          <div className="callout">
            Public views powering the Portfolio page: <code>pendingFees(poolId, user)</code>,{' '}
            <code>pendingEmissions(poolId, user)</code>, <code>sharesOf(user)</code>.
          </div>

          <h2 id="emissions">ve(3,3) emissions</h2>
          <p>
            Fees reward LPs for what they did. Emissions reward LPs for what the community believes. The two loop
            together in weekly epochs (an epoch is just a fixed chunk of time, here 7 days). The (3,3) tag is
            game-theory shorthand: the design pays best when people both supply liquidity and lock tokens, so the two
            behaviors reinforce each other.
          </p>
          <h3 id="tokenomics">Tokenomics</h3>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>tail</b></td><td>the EQUITY allocation transferred to the Voter at deployment. A budget counter, not a premine.</td></tr>
                <tr><td><b>weekly</b></td><td>0.5% of the remaining tail per epoch: 0.5% of the allocation in week one, then 0.5% of what is left, halving roughly every 2.7 years.</td></tr>
                <tr><td><b>supply</b></td><td>EQUITY is a fixed-supply launchpad token: the whole supply has existed since deployment and no contract can mint more. The Voter streams emissions from its balance and reverts if underfunded until it is topped up.</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            In plain words: nobody can print EQUITY. A fixed pile was set aside at launch, and each week a small
            slice (half a percent of whatever is left) drips out to the pools the voters picked.
          </p>
          <h3>The weekly cycle</h3>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">anyone with veEQUITY weight allocates it across pools; votes are cumulative per (epoch, pool)</span></li>
            <li><span className="num">2</span><span className="body">when the epoch ends, anyone calls distribute(): the weekly amount is transferred to the hook and split pro-rata by that epoch's vote weights</span></li>
            <li><span className="num">3</span><span className="body">each pool's share lands in its capPerShare accumulator, so emissions accrue to LPs with no claim transaction needed to earn, only to collect</span></li>
            <li><span className="num">4</span><span className="body">if a notified pool has zero liquidity, the EQUITY forwards to admin instead of stranding</span></li>
          </ol>
          <p>A pool that wins 36% of the epoch's votes receives 36% of that week's release, distributed to its LPs.</p>

          <h2 id="locking">Locking and voting</h2>
          <p>
            Locking EQUITY transfers it into the Escrow and records one lock per account: amount and unlock time.
            Duration must be between 7 and 730 days. Locking again merges: amounts add up, the longer expiry wins.
            While locked, EQUITY cannot be moved anywhere else.
          </p>
          <p>Your live vote weight is:</p>
          <pre><code>{`voteWeight = amount * (unlockTime - now) / 730 days`}</code></pre>
          <p>Two consequences worth internalizing:</p>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>time scales</b></td><td>1000 EQUITY locked for 2 years = 1000 weight; 1 year = 500; 7 days = about 19.</td></tr>
                <tr><td><b>decay</b></td><td>weight decays every second: a max lock reaches zero over exactly two years, forcing continuous re-commitment.</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            In plain words: a longer lock means a louder voice, the voice fades to zero at the unlock date, and the
            locked tokens themselves are never at risk; you get every one of them back.
          </p>
          <p>
            Withdrawing returns the full amount with no penalty and no early exit once unlock time has passed;
            patience is the only rule. The Voter checks votes against live weight, so leave headroom for decay:
            spending a full 100% can revert seconds later.
          </p>
          <div className="callout">
            What voting is not (yet): no bribes, no vote markets, no per-epoch reset. A vote is a weight allocation;
            an epoch is a week; the emissions flow.
          </div>

          <h2 id="trading">Trading</h2>
          <p>
            Traders never touch the PoolManager. The path is trader → EquityRouter → PoolManager → hook callbacks.
            The router is the front-door contract that walks your trade through the manager, and it is exact-in: you
            state what you spend, not what you want out.
          </p>
          <ol className="steps">
            <li><span className="num">1</span><span className="body">swap(key, zeroForOne, amountIn, minOut, deadline): the router pulls amountIn, then opens the manager's unlock window</span></li>
            <li><span className="num">2</span><span className="body">inside the callback the router syncs, transfers in and settles the input currency</span></li>
            <li><span className="num">3</span><span className="body">beforeSwap quotes the dynamic fee for this direction at this second; the swap executes against the full-range curve</span></li>
            <li><span className="num">4</span><span className="body">afterSwap stamps cumulative volumes and last-swap time; the frontend diffs these counters to build volume charts without any indexer</span></li>
            <li><span className="num">5</span><span className="body">the output is checked against minOut (reverting on breach), synced and taken out to the trader; the window closes balanced or reverts</span></li>
          </ol>
          <p>
            Prices are marginal rates: the raw pool price P is token1 per token0. Because USDG's side depends on
            address sorting, the UI always displays the human-facing asset-per-USDG orientation, whatever the pair's
            ordering.
          </p>
          <div className="callout">
            Quote honesty: the UI quote is a client-side constant-product preview net of the current fee, recomputed
            at swap time so a calendar flip cannot surprise you. The chain enforces the real minimum; the frontend
            passes a 2% minOut and shows it.
          </div>

          <h2 id="roles">Roles and safety</h2>
          <p>
            Think of the roles as narrow job descriptions with hard limits, not owners: each can do two or three
            specific things and nothing else.
          </p>
          <div className="mini-table">
            <table>
              <thead><tr><th>Role</th><th>Powers</th></tr></thead>
              <tbody>
                <tr><td>admin</td><td>setFeeConfig per pool, assign keeper and emergency roles</td></tr>
                <tr><td>keeper</td><td>setOverride, bounded by floor/cap, max 50% discount, 72h TTL</td></tr>
                <tr><td>emergency</td><td>clearOverride instantly, pauseDeposits globally</td></tr>
              </tbody>
            </table>
          </div>
          <h3>Hard bounds no role can cross</h3>
          <div className="mini-table">
            <table>
              <tbody>
                <tr><td><b>ceiling</b></td><td>10% absolute fee max, enforced on every config write and every override</td></tr>
                <tr><td><b>shape</b></td><td>every config validates floor ≤ cap ≤ 10% and fees ≤ cap</td></tr>
                <tr><td><b>exit</b></td><td>withdrawals and claims are permissionless; only deposits pause</td></tr>
                <tr><td><b>mint</b></td><td>EQUITY has no mint function: emissions stream from the Voter's fixed allocation, at most 0.5% of the remaining tail per week</td></tr>
                <tr><td><b>keys</b></td><td>no contract is upgradeable; LP principal lives in the PoolManager, escrowed fees in the hook, locked EQUITY in Escrow, each spendable only by its owner</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            In plain words: immutable means the code is carved in stone, no upgrade route, no patch, no master key
            that could rewrite the rules after you deposit. The only things that can change after launch are exactly
            what the table above shows, and each is fenced by the bounds listed here.
          </p>
          <div className="callout">
            The forge test suite covers fee bounds, share accounting and the full ve(3,3) flow, including a
            multi-epoch simulation.
          </div>

          <h2 id="running-locally">Running locally</h2>
          <p>This section is for developers; if you only trade or provide liquidity, skip it.</p>
          <pre><code>{`npm install
npm run dev   # http://localhost:5173`}</code></pre>
          <p>
            This build is a self-contained frontend: connecting a wallet creates a local mock account, and every
            action — swapping, adding liquidity, locking, voting — runs against an in-browser simulation of the fee
            engine and ve(3,3) accounting persisted to <code>localStorage</code>. There is no chain, deploy script or
            contracts folder to run; open the Vote page's browser console and clear site data to reset the demo, or
            use the reset control on the Portfolio page.
          </p>

          <h2 id="glossary">Glossary</h2>
          <p>Every term this page uses, one line each. If a word on any Equity page stops you, it is here.</p>
          <div className="glossary-grid">
            {[
              ['wallet', "the app holding your tokens and signing each action; whoever holds its keys holds the money"],
              ['blockchain', 'the shared public ledger tokens and contracts live on; this app runs on Robinhood Chain (4663)'],
              ['token', 'a digital asset on that ledger: USDG, WETH, TSLA, GLD and EQUITY are all tokens'],
              ['swap', "trade one token for another at the pool's current price"],
              ['pool', 'the shared pot holding the two tokens of one market; every swap exchanges against it'],
              ['liquidity', 'the tokens actually sitting in that pot; more of it means easier trades at closer-to-quoted prices'],
              ['LP', 'liquidity provider: someone who deposits tokens into a pool and earns its fees in return'],
              ['TVL', 'total value locked: the dollar value of everything deposited in a pool, or in the whole protocol'],
              ['fee', "the small percentage each swap pays; on Equity it all goes to that pool's LPs, split per share"],
              ['shares', 'the ERC-6909 tokens proving your slice of a pool, minted 1:1 with what you deposit'],
              ['USDG', 'the dollar token used as one side of every market; all prices on Equity are quoted in it'],
              ['oracle', 'an on-chain price feed (here Chainlink) the UI reads to show live real-world prices'],
              ['hook', "a contract Uniswap v4 calls at fixed points of every swap; Equity's hook computes the fee and tracks LP credit"],
              ['keeper', "an operational role that can shade a pool's fee down for at most 72 hours, never past its cap"],
              ['epoch', 'a fixed chunk of time, one week on Equity; the unit of voting and emissions'],
              ['emissions', "EQUITY streamed weekly from the Voter's fixed allocation to the pools that won the vote"],
              ['veEQUITY', 'locked EQUITY carrying vote weight that decays toward the unlock date; the tokens return in full'],
              ['escrow', 'a contract that holds something and pays it only to its owner; locked EQUITY and pending fees each sit in one'],
            ].map(([term, def]) => (
              <React.Fragment key={term}>
                <div className="term">{term}</div>
                <div className="def">{def}</div>
              </React.Fragment>
            ))}
          </div>

          <h2 id="faq">FAQ</h2>

          <div className="faq-section">
            <h3>Basics</h3>
            <FaqItem q="What is this site?" a="Equity is an exchange where each market — like TSLA/USDG or NVDA/USDG — sets its own fee rules instead of one fee for everyone. You can trade, provide liquidity to earn a share of fees, or lock EQUITY to vote on where weekly rewards go." />
            <FaqItem q="What do I need to start?" a="Just a wallet. In this demo, clicking Connect wallet creates one instantly with starter balances so you can try every feature without needing a browser extension or real funds." />
            <FaqItem q="Is this Robinhood, the stock broker?" a="No. Robinhood Chain is the name of the public blockchain this app is built for; Equity itself is an independent exchange, not the brokerage." />
            <FaqItem q="Do I need to buy EQUITY to trade?" a="No. Trading and providing liquidity only need the tokens in the market you're using. EQUITY is only needed to lock and vote." />
            <FaqItem q="What can I lose?" a="In this demo, nothing real — balances are simulated locally in your browser. On the live protocol, the usual AMM risks apply: price impact, impermanent loss as an LP, and smart-contract risk." />
            <FaqItem q="Who holds my money?" a="Your wallet, always. LP principal sits in the PoolManager and is redeemable any time by burning your shares; nothing routes through a custodian." />
            <FaqItem q="Can I get my money out whenever I want?" a="Yes. Withdrawals and fee/emission claims are permissionless and can never be paused, even if deposits are." />
            <FaqItem q="All these words are new to me. Is there a cheat sheet?" a="Yes — see the Glossary section above; every term used anywhere on this site is defined there in one line." />
          </div>

          <div className="faq-section">
            <h3>Trading</h3>
            <FaqItem q="How do I trade on Equity?" a="Connect a wallet, open a market from the Markets page, choose buy or sell, enter an amount, and confirm — the quote and fee update live as you type." />
            <FaqItem q="What is slippage, and what is minOut?" a="Slippage is how much the price can move against you between quoting and executing. minOut is the least you'll accept back; if the trade would return less, it reverts instead of silently giving you a worse fill." />
            <FaqItem q="Why did my trade cost more than the quote?" a="The quote is a live preview; if the pool's fee model shifts (say, a calendar pool flips out of session) or the price moves before you confirm, the executed fee or price can differ slightly." />
            <FaqItem q="Are fees the same in both directions?" a="Only for flat-fee pools. Directional pools charge a different fee for buys vs sells, and calendar pools charge a different fee inside vs outside trading hours." />
            <FaqItem q="Why does the calendar fee change with the clock?" a="Calendar pools mirror traditional market-hours liquidity: fees are lower during the Mon-Fri 14:00-21:00 UTC session and double outside it, when liquidity is typically thinner." />
            <FaqItem q="Can I trade while deposits are paused?" a="Yes. Pausing only blocks new liquidity deposits as a circuit breaker; trading, withdrawals and claims keep working." />
            <FaqItem q="What is USDG?" a="The dollar-denominated token every market quotes against — the 'quote currency' side of every pair on Equity." />
          </div>

          <div className="faq-section">
            <h3>Providing liquidity</h3>
            <FaqItem q="What do I need to provide liquidity?" a="Both tokens of a pair, in the pool's current ratio. Deposit from the Portfolio page — enter the USDG amount and the matching asset amount is computed for you." />
            <FaqItem q="How do LPs get paid?" a="A per-share counter tracks lifetime fees for each pool; your pending payout is simply how much that counter has grown since your last action, times your shares." />
            <FaqItem q="Do I need to claim to keep earning?" a="No. Fees and emissions accrue automatically to your position; claiming (or withdrawing) is only needed to move them into your spendable balance." />
            <FaqItem q="Do my LP shares expire or decay?" a="No. Shares represent a fixed slice of the pool until you burn them by withdrawing; they never decay on their own." />
            <FaqItem q="Why is there no range picker?" a="Equity pools are full-range only by design, so every LP earns on every price the market ever prints — simpler to reason about, with no tick-range math to get wrong." />
            <FaqItem q="What happens to the part of my deposit the pool does not use?" a="It's refunded immediately in the same transaction — you never leave a stray balance behind." />
            <FaqItem q="Can I withdraw while deposits are paused?" a="Yes, always — pausing only affects new deposits, never withdrawals or claims." />
          </div>

          <div className="faq-section">
            <h3>veEQUITY and emissions</h3>
            <FaqItem q="What is veEQUITY?" a="Vote-escrowed EQUITY — EQUITY you've locked in exchange for voting weight. It isn't a separate token you hold, just a state recorded against your locked amount and unlock date." />
            <FaqItem q="How long can I lock for?" a="Anywhere from 7 to 730 days (two years). Longer locks grant more voting weight." />
            <FaqItem q="Can I unlock early?" a="No. Once locked, EQUITY is only withdrawable after the unlock date passes — but there's no penalty at all once it does." />
            <FaqItem q="What happens to my TALES while it is locked?" a="It sits safely in the Escrow contract; you keep 100% of it, it just can't be transferred or traded until it unlocks." />
            <FaqItem q="How much voting power do I get per EQUITY?" a="Weight = amount × (time left until unlock) / 730 days. A 2-year lock on 1000 EQUITY gives 1000 weight; a 1-year lock gives 500." />
            <FaqItem q="Can I split my vote across pools?" a="Yes — allocate any portion of your available weight to as many pools as you like, as long as the total doesn't exceed your current weight." />
            <FaqItem q="When do emissions drop?" a="Weekly, at the end of each 7-day epoch, split across pools in proportion to that epoch's votes." />
            <FaqItem q="Who can mint EQUITY?" a="Nobody. EQUITY has a fixed supply set at launch; emissions only stream out of a pre-funded allocation, never newly minted." />
            <FaqItem q="Why did my vote weight go down by itself?" a="Weight decays continuously toward your unlock date by design — it's meant to reward ongoing commitment, not a one-time lock." />
            <FaqItem q="What happens if a voted pool has no liquidity?" a="Its share of that week's emissions is redirected rather than left stranded." />
          </div>

          <div className="faq-section">
            <h3>Safety and roles</h3>
            <FaqItem q="Can the team change the contracts after launch?" a="No contract is upgradeable — the logic is fixed at deployment. Only a small set of narrow, bounded parameters (like a temporary fee override) can change, and every bound is public." />
            <FaqItem q="Is there an admin who can freeze my funds?" a="No. Admin, keeper and emergency are narrow operational roles — none of them can seize funds, and withdrawals can never be paused." />
            <FaqItem q="Can fees hit 100%?" a="No — 10% is an absolute, hard-coded ceiling that no role or override can ever cross." />
            <FaqItem q="What happens if the keeper disappears?" a="Any active override simply expires within 72 hours and the pool's autonomous fee model resumes automatically." />
            <FaqItem q="What does the emergency role control?" a="Only two things: instantly clearing a fee override, and pausing new deposits as a circuit breaker." />
            <FaqItem q="Is anything upgradeable?" a="No. Every contract is immutable once deployed." />
            <FaqItem q="Which chain is this on?" a="Robinhood Chain (4663) in production; this build is a self-contained frontend demo that simulates the same mechanics locally." />
          </div>

        </div>
      </div>
    </div>
  )
}