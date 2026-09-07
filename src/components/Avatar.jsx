import React, { useState } from 'react'
import { avatarColor, avatarLabel } from '../engine'
import { BRAND_ICONS } from '../data/brandIcons'
import { LOGO_DOMAINS, faviconUrl } from '../data/logoDomains'

// perceived luminance of a hex color, used to pick a readable icon color
function isLight(hex) {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6
}

function GeneratedBadge({ symbol, size }) {
  const label = avatarLabel(symbol)
  const fontSize = label.length > 3 ? size * 0.28 : size * 0.36
  return (
    <div className="pfp" style={{ width: size, height: size, background: avatarColor(symbol), fontSize }}>
      {label}
    </div>
  )
}

// Tries a live favicon fetch for tickers with no bundled logo. Falls back to
// the generated badge if the image fails to load (offline, blocked, etc).
function LiveLogo({ symbol, domain, size }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <GeneratedBadge symbol={symbol} size={size} />
  return (
    <div className="pfp" style={{ width: size, height: size, background: '#ffffff', padding: size * 0.14 }}>
      <img
        src={faviconUrl(domain, 128)}
        alt=""
        width="100%"
        height="100%"
        style={{ objectFit: 'contain' }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export default function Avatar({ symbol, size = 34 }) {
  const brand = BRAND_ICONS[symbol]

  if (brand) {
    // full-color, multi-path official mark (e.g. TSMC, Micron, SK hynix) —
    // shown on a plain white tile since it carries its own baked-in colors
    if (brand.whiteTile) {
      return (
        <div className="pfp" style={{ width: size, height: size, background: '#ffffff' }}>
          <svg
            viewBox={brand.viewBox}
            width={size * 0.72}
            height={size * 0.72}
            dangerouslySetInnerHTML={{ __html: brand.body }}
          />
        </div>
      )
    }

    const iconColor = isLight(brand.hex) ? '#0b0c0d' : '#ffffff'

    // single-color mark supplied as a react-icons component (Amazon, Microsoft)
    if (brand.Icon) {
      return (
        <div className="pfp" style={{ width: size, height: size, background: '#' + brand.hex }}>
          <brand.Icon size={size * 0.56} color={iconColor} />
        </div>
      )
    }

    // single-color mark supplied as a multi-path body using currentColor (IBM)
    if (brand.body) {
      return (
        <div className="pfp" style={{ width: size, height: size, background: '#' + brand.hex, color: iconColor }}>
          <svg
            viewBox={brand.viewBox}
            width={size * 0.62}
            height={size * 0.62}
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: brand.body }}
          />
        </div>
      )
    }

    // single-color mark supplied as one SVG path (Simple Icons)
    return (
      <div className="pfp" style={{ width: size, height: size, background: '#' + brand.hex }}>
        <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill={iconColor}>
          <path d={brand.path} />
        </svg>
      </div>
    )
  }

  const domain = LOGO_DOMAINS[symbol]
  if (domain) return <LiveLogo symbol={symbol} domain={domain} size={size} />

  return <GeneratedBadge symbol={symbol} size={size} />
}