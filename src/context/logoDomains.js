// For every ticker that has no bundled open-source logo (see brandIcons.js),
// map it to the company's real domain. Avatar uses this to request a live
// favicon at runtime — this only works in an actual browser with internet
// access (it cannot be verified from a sandboxed build environment), but it
// is the standard technique most trading/portfolio apps use for exactly this
// long tail of tickers no icon library covers.
export const LOGO_DOMAINS = {
  GME: 'gamestop.com',
  AMC: 'amctheatres.com',
  SNDK: 'sandisk.com',
  RIVN: 'rivian.com',
  COST: 'costco.com',
  DJT: 'truthsocial.com',
  HIMS: 'hims.com',
  LLY: 'lilly.com',
  WYFI: 'whitefiber.com',
  LULU: 'lululemon.com',
  MRNA: 'modernatx.com',
  PFE: 'pfizer.com',
  MRVL: 'marvell.com',
  JNJ: 'jnj.com',
  BULL: 'webull.com',
  NU: 'nubank.com.br',
  BE: 'bloomenergy.com',
  GLD: 'spdrgoldshares.com',
  USO: 'uscfinvestments.com',
  SPY: 'spdrs.com',
  QQQ: 'invesco.com',
  // SLV, SGOV and INDA are all iShares funds and would otherwise all show
  // the same generic iShares mark, which doesn't help tell them apart — left
  // out on purpose so they get distinct generated badges instead.
}

// Google's public favicon endpoint — no API key, no signup, been stable for
// years. Returns a small (usually 16-128px) icon for a domain; quality varies
// by site but it's the company's own real mark, not a stand-in.
export function faviconUrl(domain, size = 128) {
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${domain}`
}