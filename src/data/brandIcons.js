// Real vector brand logos, from three open sources (nothing is fetched over
// the network — everything is bundled at build time):
//  - Simple Icons (CC0, https://simpleicons.org) — most tickers; raw SVG
//    path plus the brand's own official hex color.
//  - Font Awesome Free brand icons — Amazon and Microsoft, not in Simple
//    Icons at all; used as ready-made React components.
//  - Iconify's "Logos" collection (CC0) — IBM, Micron, TSMC and SK hynix,
//    the only place those exist as open icons; full-color official marks
//    rendered on a white tile.
//
// Anything not listed here (GameStop, AMC, Costco, Rivian, SanDisk, Pfizer,
// Johnson & Johnson, Moderna, Eli Lilly, Marvell, Lululemon, Webull, Nu
// Holdings, Bloom Energy, Trump Media, Hims & Hers, WhiteFiber, and every
// ETF/commodity ticker) has no real open-source logo available anywhere —
// checked across Simple Icons, Font Awesome, Tabler Icons, Bootstrap Icons
// and Iconify Logos. Those fall back to a generated ticker badge in Avatar.
import {
  siNvidia, siSpacex, siGoogle, siTesla, siApple, siAmd, siMeta,
  siCircle, siCoinbase, siBitcoin, siEthereum, siPalantir, siMicrostrategy, siReddit,
  siBlackberry, siRoblox, siDell, siSnapchat, siFigma, siAlibabadotcom,
  siNetflix, siShopify, siFord, siUps, siTaketwointeractivesoftware,
} from 'simple-icons'
import { FaAmazon, FaMicrosoft } from 'react-icons/fa'
import { IBM_SVG, MICRON_SVG, TSMC_SVG, SKHYNIX_SVG } from './logoSvgs'

export const BRAND_ICONS = {
  WETH: { path: siEthereum.path, hex: siEthereum.hex },
  NVDA: { path: siNvidia.path, hex: siNvidia.hex },
  SPCX: { path: siSpacex.path, hex: siSpacex.hex },
  GOOGL: { path: siGoogle.path, hex: siGoogle.hex },
  TSLA: { path: siTesla.path, hex: siTesla.hex },
  AAPL: { path: siApple.path, hex: siApple.hex },
  AMD: { path: siAmd.path, hex: siAmd.hex },
  META: { path: siMeta.path, hex: siMeta.hex },
  CRCL: { path: siCircle.path, hex: siCircle.hex },
  COIN: { path: siCoinbase.path, hex: siCoinbase.hex },
  cbBTC: { path: siBitcoin.path, hex: siBitcoin.hex },
  PLTR: { path: siPalantir.path, hex: siPalantir.hex },
  MSTR: { path: siMicrostrategy.path, hex: siMicrostrategy.hex },
  RDDT: { path: siReddit.path, hex: siReddit.hex },
  BB: { path: siBlackberry.path, hex: siBlackberry.hex },
  RBLX: { path: siRoblox.path, hex: siRoblox.hex },
  DELL: { path: siDell.path, hex: siDell.hex },
  SNAP: { path: siSnapchat.path, hex: siSnapchat.hex },
  FIG: { path: siFigma.path, hex: siFigma.hex },
  BABA: { path: siAlibabadotcom.path, hex: siAlibabadotcom.hex },
  NFLX: { path: siNetflix.path, hex: siNetflix.hex },
  SHOP: { path: siShopify.path, hex: siShopify.hex },
  F: { path: siFord.path, hex: siFord.hex },
  UPS: { path: siUps.path, hex: siUps.hex },
  TTWO: { path: siTaketwointeractivesoftware.path, hex: siTaketwointeractivesoftware.hex },

  // Font Awesome components — not in Simple Icons at all
  AMZN: { Icon: FaAmazon, hex: 'FF9900' },
  MSFT: { Icon: FaMicrosoft, hex: '00A4EF' },

  // Iconify "Logos" collection — full-color official marks, rendered on a
  // white tile rather than tinted to a single brand color like the ones above
  IBM: { body: IBM_SVG.body, viewBox: `0 0 ${IBM_SVG.width} ${IBM_SVG.height}`, hex: '0F62FE' },
  MU: { body: MICRON_SVG.body, viewBox: `0 0 ${MICRON_SVG.width} ${MICRON_SVG.height}`, whiteTile: true },
  TSM: { body: TSMC_SVG.body, viewBox: `0 0 ${TSMC_SVG.width} ${TSMC_SVG.height}`, whiteTile: true },
  SKHY: { body: SKHYNIX_SVG.body, viewBox: `0 0 ${SKHYNIX_SVG.width} ${SKHYNIX_SVG.height}`, whiteTile: true },
}