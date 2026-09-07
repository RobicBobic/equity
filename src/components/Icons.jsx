import React from 'react'

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconMarkets(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 19V10" /><path d="M10 19V5" /><path d="M16 19V13" /><path d="M22 19V8" />
    </svg>
  )
}

export function IconPortfolio(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  )
}

export function IconTrophy(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a2 2 0 0 0 0 4h3" />
      <path d="M16 5h3a2 2 0 0 1 0 4h-3" />
      <path d="M12 13v3" /><path d="M9 20h6" /><path d="M10 16.5h4v3.5h-4z" />
    </svg>
  )
}

export function IconVote(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" /><path d="M5 21V10l7-6 7 6v11" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

export function IconDocs(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h6" />
    </svg>
  )
}

export function IconWallet(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13.5h2" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12" /><path d="M18 6L6 18" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconReset(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 1 3 6.7" /><path d="M3 21v-6h6" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function IconWarning(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 1 21h22L12 2Z" /><path d="M12 9v5" /><path d="M12 17.5h.01" />
    </svg>
  )
}

export function IconInfo(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><path d="M12 7.5h.01" />
    </svg>
  )
}
