import React, { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { IconCheck, IconWarning, IconInfo } from './Icons'

export default function Toast() {
  const { toast, clearToast } = useStore()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 3200)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null
  const Icon = toast.kind === 'success' ? IconCheck : toast.kind === 'error' ? IconWarning : IconInfo
  return (
    <div className={'toast ' + toast.kind} key={toast.id}>
      <Icon width={15} height={15} /> {toast.msg}
    </div>
  )
}
